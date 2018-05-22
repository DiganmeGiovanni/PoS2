import {Brand, MeasurementUnit, Product, PurchasePrice, SalePrice} from '../model/entities';
import sequelize from '../model/database';
import moment from 'moment';
const Sequelize = require('sequelize');

class ProductService {
  find(query, limit, cb) {
    Product.findAll({
      where: { name: { [Sequelize.Op.like]: `%${ query }%`}},
      limit: limit,
      include: [{
        model: MeasurementUnit,
        as: 'measurementUnit'
      }]
    })
    .then(cb)
    .catch(error => {
      console.error('Products could not be retrieved');
      console.error(error);
    });
  }

  // noinspection JSMethodCanBeStatic
  findOne(productId) {
    return Product.findOne({
      where: { id: productId },
      include: [
        {
          model: MeasurementUnit,
          as: 'measurementUnit'
        },
        {
          model: Brand,
          as: 'brand'
        }
      ]
    });
  }

  // noinspection JSMethodCanBeStatic
  purchasePrices(productId) {
    return PurchasePrice.findAll({
      where: { productId: productId },
      order: [['date', 'ASC']]
    });
  }

  // noinspection JSMethodCanBeStatic
  salePrices(productId) {
    return SalePrice.findAll({
      where: { productId: productId },
      order: [['date', 'ASC']]
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
   * @param {Function} [cb] - If provided, will be executed with result,
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
   * @param {Function} [cb] - If provided, will be executed with result,
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

  /**
   * Calculates the available stock for a product on specified date
   * by checking all no consumed existences and partially consumed
   * existences
   * @param {number} productId - Id of product
   * @param {string} date - Date in which to calculate existences
   * @param {Function} [cb] - Callback for query promise
   * @returns {Promise}
   */
  stockCount(productId, date, cb) {
    let sql = '\
      SELECT\
        existence.product_id,\
        SUM(IFNULL(1 - CONSUMED.quantity, 1)) AS stock\
      FROM existence\
        INNER JOIN purchase p\
          ON existence.purchase_id = p.id\
        LEFT JOIN (\
            SELECT existence_id, SUM(IFNULL(partial_quantity, 1)) AS quantity\
            FROM sale_has_existence\
            GROUP BY existence_id\
          ) CONSUMED\
          ON CONSUMED.existence_id = existence.id\
      WHERE existence.product_id = :productId\
        AND p.date < :date\
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

  /**
   * Retrieves all the existences purchased before given date
   * with stock available
   * @param {number} productId - Id of product
   * @param {string} date - Date until which to retrieve stock
   * @param {Function} [cb] - Callback for query promise
   */
  stockAvailable(productId, date, cb) {
    let sql = '\
      SELECT\
        existence.id,\
        IFNULL(1 - CONSUMED.quantity, 1) AS available\
      FROM existence\
      INNER JOIN purchase p\
        ON existence.purchase_id = p.id\
      LEFT JOIN (\
          SELECT existence_id, SUM(partial_quantity) AS quantity\
          FROM sale_has_existence\
          GROUP BY existence_id\
        ) CONSUMED\
        ON CONSUMED.existence_id = existence.id\
      WHERE existence.product_id = :productId\
      AND p.date < :date\
      AND IFNULL(1 - CONSUMED.quantity, 1) > 0\
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
          console.error('Stock available could not be retrieved' + err);
        });
    } else {
      return promise;
    }
  }
}

const instance = new ProductService();
export default instance;
