import {
  MeasurementUnit,
  Product,
  Provider,
  Purchase,
  PurchaseHasProduct,
  PurchasePrice,
  SalePrice
} from '../model/entities';
import ProductService from './ProductService';
const Sequelize = require('sequelize');

class PurchaseService {

  /**
   * Deletes all records from 'purchase_has_product'
   * for given purchase's id
   * @param purchaseId Id of purchase
   */
  static deleteContents(purchaseId) {
    return this.findPurchaseHasProducts(purchaseId).then(hasProducts => {
      let promises = [];

      // Store all decrements in array
      let productDecrements = [];

      for (let hasProduct of hasProducts) {

        // Add decrement to array
        let productDecrementedPreviously = false;
        for (let decrement of productDecrements) {
          if (decrement.productId === hasProduct.productId) {
            productDecrementedPreviously = true;

            decrement.quantity += hasProduct.quantity;
            break;
          }
        }
        if (!productDecrementedPreviously) {
          productDecrements.push({
            productId: hasProduct.productId,
            quantity: hasProduct.quantity
          });
        }

        // Destroy has product
        promises.push(hasProduct.destroy());
      }

      // Decrement products existences
      for (let decrement of productDecrements) {
        let decrementPromise = ProductService
          .findOne(decrement.productId)
          .then(product => {
            product.existences -= decrement.quantity;
            return product.save();
          });

        promises.push(decrementPromise);
      }

      return Promise.all(promises);
    });
  }

  static findOne(purchaseId) {
    return Purchase.findOne({
      where: { id: purchaseId }
    });
  }

  static findPurchaseHasProducts(purchaseId) {
    return PurchaseHasProduct.findAll({
      where: { purchaseId: purchaseId },
      include: [
        {
          model: Product,
          as: 'product',
          include: [
            { model: MeasurementUnit, as: 'measurementUnit' }
          ]
        },
        {
          model: PurchasePrice,
          as: 'purchasePrice',
          include: [
            { model: Provider, as: 'provider' }
          ]
        }
      ]
    })
  }

  /**
   * Retrieves the last cost, before given date
   * and the first sale price with after or equal date
   * @param purchaseContents Purchase contents array
   * @param provider Purchase's provider
   * @param date Purchase's date
   */
  static retrieveLastCostAndPrice(purchaseContents, provider, date) {
    let promises = [];

    for (let i = 0; i < purchaseContents.length; i++) {
      let hasProduct = purchaseContents[i];

      // Retrieve last purchase price
      let purchasePricePromise = PurchasePrice.findOne({
        where: {
          productId: hasProduct.product.value.id,
          providerId: provider.id,
          date: {
            [Sequelize.Op.lte]: date
          }
        },
        order: [['date', 'DESC']]
      }).then(lastPrice => {
        hasProduct.lastCost.value = lastPrice === null
          ? 0 :
          lastPrice.price;

        return Promise.resolve();
      });

      // Retrieve sale price
      let salePricePromise = SalePrice.findOne({
        where: {
          productId: hasProduct.product.value.id,
          date: { [Sequelize.Op.gte]: date }
        },
        order: [['date', 'ASC']]
      }).then(salePrice => {
        hasProduct.price.value = salePrice === null
          ? '0'
          : salePrice.price + "";

        return Promise.resolve();
      });

      promises.push(purchasePricePromise);
      promises.push(salePricePromise);
    }

    return Promise.all(promises);
  }
}

export default PurchaseService
