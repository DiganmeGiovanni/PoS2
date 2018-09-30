import {
  MeasurementUnit,
  Product,
  Sale, SaleHasProduct, SalePrice
} from "../model/entities";
import ProductService from './ProductService';
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
}

export default SaleService
