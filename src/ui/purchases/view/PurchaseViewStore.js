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
      SELECT\
        PRO.id,\
        PROV.name                    AS provider_name,\
        PRO.name                     AS product_name,\
        COUNT(*)                     AS quantity,\
        MU.name                      AS measurement_unit,\
        IFNULL(CONSUMED.quantity, 0) AS sold,\
        COUNT(*) - IFNULL(\
          CONSUMED.quantity,\
          0\
        )                            AS stock,\
        PP.price                     AS cost,\
        COUNT(*) * PP.price          AS total\
      FROM existence EXI\
      INNER JOIN product PRO\
        ON PRO.id = EXI.product_id\
      INNER JOIN measurement_unit MU\
        ON MU.id = PRO.measurement_unit_id\
      INNER JOIN purchase_price PP\
        ON PP.id = EXI.purchase_price_id\
      INNER JOIN provider PROV\
        ON PP.provider_id = PROV.id\
      LEFT JOIN (\
            SELECT\
              existence.product_id,\
              SUM(IFNULL(partial_quantity, 1)) AS quantity\
            FROM sale_has_existence\
            INNER JOIN existence\
              ON existence.id = sale_has_existence.existence_id\
            WHERE existence.purchase_id = :purchaseId\
            GROUP BY product_id\
          ) CONSUMED\
        ON CONSUMED.product_id = PRO.id\
      WHERE EXI.purchase_id = :purchaseId\
      GROUP BY PRO.id, PP.price\
      ORDER BY PRO.name';

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
