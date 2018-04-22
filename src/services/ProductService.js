import { Product, PurchasePrice, SalePrice } from '../model/entities';
import sequelize from '../model/database';
import moment from 'moment';
const Sequelize = require('sequelize');

class ProductService {
  find(query, limit, cb) {
    Product.findAll({
      where: { name: { [Sequelize.Op.like]: `%${ query }%`}},
      limit: limit
    })
    .then(cb)
    .catch(() => {
      console.error('Products could not be retrieved');
    });
  }

  /**
   * Queries the last purchase price offered by a given provider
   * for specified product
   * @param {number} productId - Product's id
   * @param {number} providerId - Provider's id
   * @param {Date} date - Look for product until this date
   * @param {Function} cb - If provided, callback will be executed with result,
   *                        otherwise, a promise will be returnted
   */
  lastProviderPrice(productId, providerId, date, cb) {
    let promise = PurchasePrice.findOne({
      where: {
        productId: productId,
        providerId: providerId,
        date: {
          [Sequelize.Op.lte]: date
        }
      },
      order: [['date', 'DESC']]
    });

    if (typeof cb !== "undefined") {
      promise
          .then(cb)
          .catch(err => {
            console.error('Last provider price query has failed: ' + err)
          });
    } else {
      return promise;
    }
  }

  /**
   * Queries for the last purchase price for given product
   * until given date
   * @param {number} productId - Product's id
   * @param {Date} date - Look for price until this date
   * @param {Function} cb - If provided, will be executed with result,
   *                        otherwise a promise will be returned
   */
  lastCost(productId, date, cb) {
    let promise = PurchasePrice.findOne({
      where: {
        productId: productId,
        date: {
          [Sequelize.Op.lte]: date
        }
      },
      order: [['date', 'DESC']]
    });

    if (typeof cb !== "undefined") {
      promise
          .then(cb)
          .catch(err => { console.error('Last cost query has failed: ' + err) });
    } else {
      return promise;
    }
  }

  /**
   * Queries for the last sale price for given product
   * until given date
   * @param {number} productId - Product's id
   * @param {Date} date - Look for price until this date
   * @param {Function} cb - If provided, will be executed with result,
   *                        otherwise a promise will be returned
   * @return {Promise}
   */
  lastPrice(productId, date, cb) {
    let promise = SalePrice.findOne({
      where: {
        productId: productId,
        date: { [Sequelize.Op.lte]: date }
      },
      order: [['date', 'DESC']]
    });

    if (typeof cb !== "undefined") {
      promise
        .then(cb)
        .catch(err => { console.error('Last price query has failed: ' + err)})
    } else {
      return promise;
    }
  }

  stockCount(productId, date, cb) {
    let sql = '\
      SELECT\
        PROD.id,\
        COUNT(*) AS stock\
      FROM existence EXI\
      INNER JOIN purchase PUR\
        ON PUR.id = EXI.purchase_id\
      INNER JOIN product PROD\
        ON PROD.id = EXI.product_id\
      LEFT JOIN sale_has_existence SHE\
        ON SHE.existence_id = EXI.id\
      WHERE SHE.id IS NULL\
        AND PUR.date <= :date\
        AND PROD.id = :productId\
    ';

    let promise = sequelize.query(sql, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          date: moment(date).utc().format('YYYY-MM-DD HH:mm:ss'),
          productId: productId
        }
    });

    if (typeof cb !== "undefined") {
      promise
        .then(cb)
        .catch(err => {
          console.error('Stock could not be retrieved: ' + err);
        })
    } else {
      return promise
    }
  }

  availableExistences(productId, quantity, date, cb) {
    let sql = '\
      SELECT\
        EXI.id AS existence_id,\
        EXI.product_id\
      FROM existence EXI\
      INNER JOIN purchase PUR\
        ON PUR.id = EXI.purchase_id\
      INNER JOIN product PROD\
        ON PROD.id = EXI.product_id\
      LEFT JOIN sale_has_existence SHE\
        ON SHE.existence_id = EXI.id\
      WHERE SHE.id IS NULL\
        AND PUR.date <= :date\
        AND PROD.id = :productId\
      LIMIT :quantity\
    ';

    let promise = sequelize.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        date: moment(date).utc().format('YYYY-MM-DD HH:mm:ss'),
        productId: productId,
        quantity: quantity
      }
    });

    if (typeof cb !== "undefined") {
      promise
        .then(cb)
        .catch(err => {
          console.error('Available existences could not be retrieved' + err);
        });
    } else {
      return promise;
    }
  }
}

const instance = new ProductService();
export default instance;
