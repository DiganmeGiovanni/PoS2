import {Brand, MeasurementUnit, Product, PurchasePrice, SalePrice} from '../model/entities';
import sequelize from '../model/database';
import moment from 'moment';
import DateFormatter from "./DateFormatter";
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
   * purchases and sales until given date.
   *
   * @param {number} productId - Id of product
   * @param {Date} date - Date in which to calculate existences
   * @param {Function} [cb] - Callback for query promise
   * @returns {Promise}
   */
  stockCount(productId, date, cb) {
    const sqlStock = "\
      SELECT\
        PRO.id                        AS product_id,\
        IFNULL(PURCHASES.quantity, 0) AS purchased,\
        IFNULL(SALES.sold, 0)         AS sold\
      FROM product PRO\
      LEFT JOIN (\
            SELECT\
              PHP.product_id,\
              SUM(PHP.quantity) AS quantity\
            FROM purchase_has_product PHP\
            INNER JOIN purchase PUR\
            ON PUR.id = PHP.purchase_id\
            WHERE strftime('%Y-%m-%d', datetime(PUR.date, '-5 hours')) <= :formattedDate1\
            GROUP BY PHP.product_id\
          ) PURCHASES\
        ON PURCHASES.product_id = PRO.id\
      \
      LEFT JOIN (\
            SELECT\
              SP.product_id,\
              SUM(SHP.quantity) AS sold\
            FROM sale_has_product SHP\
            INNER JOIN sale SAL\
              ON SAL.id = SHP.sale_id\
            INNER JOIN sale_price SP\
              ON SP.id = SHP.sale_price_id\
            WHERE strftime('%Y-%m-%d', datetime(SAL.date, '-5 hours')) <= :formattedDate2\
            GROUP BY SP.product_id\
          ) SALES\
        ON SALES.product_id = PRO.id\
      WHERE PRO.id = :productId\
    ";

    const formattedDate = DateFormatter.asDateOnly(date);
    let promise = sequelize
      .query(sqlStock, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          productId: productId,
          formattedDate1: formattedDate,
          formattedDate2: formattedDate
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

  purchasesHistory(productId, cb) {
    let sql = '\
      SELECT\
        PHP.product_id     AS product_id,\
        PUR.id             AS purchase_id,\
        PRO.name           AS provider_name,\
        PUR.date           AS date,\
        ROUND(PP.price, 2) AS price\
      FROM purchase_has_product PHP\
      INNER JOIN purchase PUR\
        ON PUR.id = PHP.purchase_id\
      INNER JOIN purchase_price PP\
        ON PP.id = PHP.purchase_price_id\
      INNER JOIn provider PRO\
        ON PRO.id = PP.provider_id\
      WHERE PP.product_id = :productId\
      ORDER BY PUR.date DESC\
    ';

    sequelize.query(sql, { replacements: { productId: productId }})
      .then(cb)
      .catch(err => {
        console.error('Purchases history could not be retrieved: ' + err);
      });
  }

  salesHistory(productId, cb) {
    let sql = '\
      SELECT\
        SP.product_id        AS product_id,\
        SAL.id               AS sale_id,\
        SHP.self_consumption AS self_consumption,\
        SAL.date             AS date,\
        ROUND(SP.price, 2)   AS price\
      FROM sale_has_product SHP\
      INNER JOIN sale SAL\
        ON SAL.id = SHP.sale_id\
      INNER JOIN sale_price SP\
        ON SP.id = SHP.sale_price_id\
      WHERE SP.product_id = :productId\
      ORDER BY SAL.date DESC\
    ';

    sequelize.query(sql, { replacements: { productId: productId }})
      .then(cb)
      .catch(err => {
        console.error('Sales history could not be retrieved: ' + err);
      });
  }
}

const instance = new ProductService();
export default instance;
