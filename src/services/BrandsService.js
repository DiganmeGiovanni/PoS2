import { Brand } from '../model/entities';
const Sequelize = require('sequelize');

class BrandsService {

  find(query, limit, cb) {

    Brand.findAll({
      where: { name: { [Sequelize.Op.like]: `%${ query }%` }},
      limit: limit
    })
    .then(cb)
    .catch(() => {
      console.error('Brands could not be queried');
    });
  }
}

export default new BrandsService();
