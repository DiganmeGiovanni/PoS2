import {
  MeasurementUnit,
  Product,
  Sale, SaleHasProduct, SalePrice
} from "../model/entities";
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
      for (let hasProduct of hasProducts) {
        hasProduct.salePrice.product.existences += hasProduct.quantity;
        let updatePromise = hasProduct.salePrice.product.save().then(() => {
          let deletePromise = hasProduct.destroy();
          promises.push(deletePromise);
        });

        promises.push(updatePromise);
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
