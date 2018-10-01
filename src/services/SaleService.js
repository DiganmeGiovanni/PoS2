/**
 * @typedef {object} PurchasedProduct
 * @property {number} product_id
 * @property {number} price
 * @property {number} quantity
 * @property {object} date
 * @property {number} soldBeforeQuantity
 * @property {number} soldBeforeEarnings
 * @property {number} soldQuantity
 * @property {number} soldEarnings
 * @property {[StockSalePrice]} salePrices
 */
/**
 * @typedef {object} SoldProduct
 * @property {number} product_id
 * @property {number} sale_price_id
 * @property {number} price
 * @property {number} quantity
 * @property {object} date
 */
/**
 * @typedef {object} StockSalePrice
 * @property {number} id
 * @property {number} price
 * @property {number} quantity
 */
/**
 * @typedef {object} EarningsReport
 * @property {number} totalEarnings
 * @property {number} totalSold
 * @property {[PurchasedProduct]} details
 */

import {
  MeasurementUnit,
  Product,
  Sale, SaleHasProduct, SalePrice
} from "../model/entities";
import ProductService from './ProductService';
import DateService from "./DateService";
import sequelize from '../model/database';

const Sequelize = require('sequelize');

class SaleService {

  /**
   * Deletes all recors from 'sale_has_product' for given sale's id
   * and adds its quantities to inventory
   * @param saleId Id of sale
   * @returns saleId Id of sale
   */
  static deleteContents(saleId) {
    return this.findSaleHasProducts(saleId).then(hasProducts => {
      let promises = [];

      // Store all increments in array
      let productIncrements = [];

      for (let hasProduct of hasProducts) {

        // Add increment to array
        let productIncrementedPreviously = false;
        for (let increment of productIncrements) {
          if (increment.productId === hasProduct.salePrice.productId) {
            productIncrementedPreviously = true;

            increment.quantity += hasProduct.quantity;
            break;
          }
        }
        if (!productIncrementedPreviously) {
          productIncrements.push({
            productId: hasProduct.salePrice.productId,
            quantity: hasProduct.quantity
          });
        }

        // Destroy has product
        promises.push(hasProduct.destroy());
      }

      // increment products existences
      for (let increment of productIncrements) {
        let incrementPromise = ProductService
          .findOne(increment.productId)
          .then(product => {
            product.existences += increment.quantity;
            return product.save();
          });

        promises.push(incrementPromise);
      }

      return Promise.all(promises);
    });
  }

  static findOne(saleId) {
    return Sale.findOne({
      where: { id: saleId }
    });
  }

  static findSaleHasProducts(saleId) {
    return SaleHasProduct.findAll({
      where: { saleId: saleId },
      include: [
        {
          model: SalePrice,
          as: 'salePrice',
          include: [
            {
              model: Product,
              as: 'product',
              include: [
                { model: MeasurementUnit, as: 'measurementUnit' }
              ]
            }
          ]
        }
      ]
    });
  }

  static getEarningsReport(startDate, endDate, cb) {
    this.getPurchasedStockUntil(endDate, purchasedStock => {
      let startOfTime = new Date(2017, 1, 1);
      this.getSoldStockBetween(startOfTime, startDate, soldStock => {

        // Compute earnings before start date
        for (let soldProduct of soldStock) {
          for (let purchasedProduct of purchasedStock) {
            if (soldProduct.quantity === 0) break;

            if (purchasedProduct.product_id === soldProduct.product_id) {

              // Purchased product has available stock?
              if (purchasedProduct.soldBeforeQuantity < purchasedProduct.quantity) {
                let availableQty = purchasedProduct.quantity - purchasedProduct.soldBeforeQuantity;
                let consumedQty = availableQty >= soldProduct.quantity
                  ? soldProduct.quantity
                  : availableQty;

                let totalPrice = consumedQty * soldProduct.price;
                let totalCost = consumedQty * purchasedProduct.price;
                let earnings = totalPrice - totalCost;

                purchasedProduct.soldBeforeQuantity += consumedQty;
                purchasedProduct.soldBeforeEarnings += earnings;
                soldProduct.quantity -= consumedQty;
              }
            }
          }
        }

        this.getSoldStockBetween(startDate, endDate, soldStock => {
          let earningsInRange = 0;
          let soldInRange = 0;

          // Compute earnings during dates range
          for (let soldProduct of soldStock) {
            for (let purchasedProduct of purchasedStock) {
              if (soldProduct.quantity === 0) break;

              if (purchasedProduct.product_id === soldProduct.product_id) {

                // Purchased product has available stock?
                if (purchasedProduct.soldBeforeQuantity < purchasedProduct.quantity) {
                  let availableQty = purchasedProduct.quantity - purchasedProduct.soldQuantity;
                  let consumedQty = availableQty >= soldProduct.quantity
                    ? soldProduct.quantity
                    : availableQty;

                  let totalPrice = consumedQty * soldProduct.price;
                  let totalCost = consumedQty * purchasedProduct.price;
                  let earnings = totalPrice - totalCost;

                  purchasedProduct.soldQuantity += consumedQty;
                  purchasedProduct.soldEarnings += earnings;
                  soldProduct.quantity -= consumedQty;
                  earningsInRange += earnings; // Add to total earnings
                  soldInRange += totalPrice;

                  // Store sale price
                  if (!purchasedProduct.salePrices) {
                    purchasedProduct.salePrices = [];
                    purchasedProduct.salePrices.push({
                      // id: soldProduct.sale_price_id,
                      price: soldProduct.price,
                      quantity: consumedQty
                    });
                  } else {
                    let salePriceFound = false;
                    for (let salePrice of purchasedProduct.salePrices) {
                      if (salePrice.price === soldProduct.price) {
                        salePriceFound = true;
                        salePrice.quantity += consumedQty;
                        break;
                      }
                    }

                    if (!salePriceFound) {
                      purchasedProduct.salePrices.push({
                        // id: soldProduct.sale_price_id,
                        price: soldProduct.price,
                        quantity: consumedQty
                      });
                    }
                  }
                }
              }
            }
          }

          // Remove purchases without sales
          let stockWithSales = [];
          for (let purchasedProduct of purchasedStock) {
            if (purchasedProduct.soldQuantity > 0) {
              stockWithSales.push(purchasedProduct);
            }
          }

          cb({
            totalEarnings: earningsInRange,
            totalSold: soldInRange,
            details: stockWithSales
          })
        })
      });
    });
  }

  /**
   * Gets a list of all items purchased before a given date,
   * items structure is like this:
   * {
   *   product_id: <product_id>,
   *   price: <price>,
   *   quantity: <quantity>,
   *   date: <date>
   * }
   *
   * @param date - Only items purchased before given date will
   *               be returned
   * @param cb - Callback to invoke with query results
   */
  static getPurchasedStockUntil(date, cb) {
    let sql = `
      SELECT
        PHP.product_id                   AS product_id,
        PRO.name                         AS product_name,
        MU.name                          AS measurement_unit_name,
        PP.price                         AS price,
        SUM(PHP.quantity)                AS quantity,
        datetime(PP.date, 'localtime') AS date,
        0                                AS soldBeforeQuantity,
        0                                AS soldBeforeEarnings,
        0                                AS soldQuantity,
        0                                AS soldEarnings
      FROM purchase_has_product PHP
      INNER JOIN purchase_price PP
        ON PP.id = PHP.purchase_price_id
      INNER JOIN purchase PUR
        ON PUR.id = PHP.purchase_id
      INNER JOIN product PRO
        ON PRO.id = PHP.product_id
      INNER JOIN measurement_unit MU
        ON MU.id = PRO.measurement_unit_id       
      WHERE ${ DateService.fromSQLiteUtcToLocal('PUR.date', false) } <= :date
      GROUP BY PHP.purchase_price_id, PHP.product_id
      ORDER BY PHP.product_id, PP.date
    `;

    sequelize.query(sql, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { date: date }
      })
      .then(cb)
      .catch(err => {
        console.error('Purchased stock until date could not be quiried');
        console.error(err);
      });
  }

  /**
   * Gets a list of all sold items between given dates range,
   * items structure is like this:
   * {
   *   product_id: <product_id>,
   *   price: <price>,
   *   quantity: <quantity>,
   *   date: <date>
   * }
   *
   * @param startDate
   * @param endDate
   * @param cb - Callback to invoke with query results as param
   */
  static getSoldStockBetween(startDate, endDate, cb) {
    let sql = `
      SELECT
        SP.product_id     AS product_id,
        SP.id             AS sale_price_id,
        SP.price          AS price,
        SUM(SHP.quantity) AS quantity,
        SAL.date          AS date
      FROM sale_has_product SHP
      INNER JOIN sale SAL
        ON SAL.id = SHP.sale_id
      INNER JOIN sale_price SP
        ON SP.id = SHP.sale_price_id
      WHERE ${ DateService.fromSQLiteUtcToLocal('SAL.date', false) } 
        BETWEEN :startDate 
            AND :endDate
      GROUP BY SHP.sale_price_id, SP.product_id
      ORDER BY SP.product_id, SAL.date
    `;

    sequelize.query(sql, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { startDate: startDate, endDate: endDate }
      })
      .then(cb)
      .catch(err => {
        console.error('Sold stock between date could not be queried');
        console.error(err);
      });
  }
}

export default SaleService
