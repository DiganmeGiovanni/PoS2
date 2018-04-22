import { MeasurementUnit } from "../model/entities";
const Sequelize = require('sequelize');

class MeasurementUnitService {
  find(query, limit, cb) {
    MeasurementUnit.findAll({
      where: { name: { [Sequelize.Op.like]: `%${ query }%` }},
      limit: limit
    })
    .then(cb)
    .catch(() => {
      console.error('Measurement units could not be retrieved');
    });
  }
}

export default new MeasurementUnitService();
