import {
  MeasurementUnit,
  Product,
  Provider,
  Purchase,
  PurchaseHasProduct,
  PurchasePrice,
  SalePrice
} from '../model/entities';

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

      for (let hasProduct of hasProducts) {
        hasProduct.product.existences -= hasProduct.quantity;
        let updatePromise = hasProduct.product.save().then(() => {
          let deletePromise = hasProduct.destroy();
          promises.push(deletePromise);
        });

        promises.push(updatePromise);
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
