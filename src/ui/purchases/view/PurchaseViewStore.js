import { EventEmitter } from 'events';
import PoSDispatcher from '../../PoSDispatcher';
import ActionTypes from '../../ActionTypes';
import {Purchase} from "../../../model/entities";
import sequelize from "../../../model/database";
const Sequelize = require('sequelize');

class PurchaseViewStore extends EventEmitter {
  constructor() {
    super();
    this.CHANGE_EVENT = 'CHANGE';

    this.state = {
      purchase: null,
      contents: [],

      isLoadingProducts: true
    }
  }

  getState() {
    return this.state;
  }

  emitChange() {
    this.emit(this.CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(this.CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(this.CHANGE_EVENT, callback);
  }

  fetchPurchase(purchaseId) {
    Purchase.findById(purchaseId)
        .then(purchase => {
          this.state.purchase = purchase;

          this.fetchContents(purchase.id)
            .then(contents => {
              this.state.isLoadingProducts = false;
              this.state.contents = contents;
              this.emitChange();
            })
            .catch(err => {
              console.log('Existences could not be retrieved: ' + err);
              this.emitChange();
            });
        })
        .catch(err => {
          console.error('Purchase could not be retrieved: ' + err);
        });
  }

  // noinspection JSMethodCanBeStatic
  fetchContents(purchaseId) {
    let sql = '\
      SELECT \
        EXI.purchase_id                   AS existence_id, \
        PURCHASE_PRICE.id                 AS purchase_price_id, \
        PROD.name                         AS product_name, \
        PURCHASE_PRICE.price              AS cost, \
        PROV.name                         AS provider_name, \
        COUNT(*)                          AS quantity,\
        MU.name                           AS measurement_unit,\
        SUM(\
          CASE\
            WHEN SHE.existence_id IS NULL THEN 0\
            ELSE IFNULL(SHE.partial_quantity, 1)\
          END)                            AS sold,\
        COUNT(*) -\
        SUM(\
          CASE\
            WHEN SHE.existence_id IS NULL THEN 0\
            ELSE IFNULL(SHE.partial_quantity, 1)\
          END)                            AS stock,\
        PURCHASE_PRICE.price * COUNT(*)   AS total\
      FROM existence EXI\
      INNER JOIN product PROD\
        ON EXI.product_id = PROD.id\
      INNER JOIN purchase_price PURCHASE_PRICE\
        ON EXI.purchase_price_id = PURCHASE_PRICE.id\
      INNER JOIN provider PROV\
        ON PROV.id = PURCHASE_PRICE.provider_id\
      INNER JOIN measurement_unit MU\
        ON PROD.measurement_unit_id = MU.id\
      LEFT JOIN sale_has_existence SHE\
        ON EXI.id = SHE.existence_id\
      WHERE EXI.purchase_id = :purchaseId\
      GROUP BY PURCHASE_PRICE.id, PROD.id, PROV.id';

    return sequelize.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        purchaseId: purchaseId
      }
    });
  }
}

const storeInstance = new PurchaseViewStore();
storeInstance.dispatchToken = PoSDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.PURCHASE.FETCH:
      storeInstance.fetchPurchase(action.purchaseId);
      break;
  }
});

export default storeInstance;
