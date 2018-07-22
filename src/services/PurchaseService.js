import {MeasurementUnit, Product, Purchase, PurchaseHasProduct, PurchasePrice} from '../model/entities';

class PurchaseService {
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
        { model: PurchasePrice, as: 'purchasePrice' }
      ]
    })
  }
}

export default PurchaseService
