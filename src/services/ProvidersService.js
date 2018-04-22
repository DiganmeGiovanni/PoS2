import { Provider } from './../model/entities';
const Sequelize = require('sequelize');

class ProvidersService {

  find(query, limit, cb) {
    Provider.findAll({
      where: { name: { [Sequelize.Op.like]: `%${ query }%` }},
      limit: limit
    })
    .then(cb)
    .catch(() => {
      console.error('Providers could not be queried');
    });
  }
}

export default new ProvidersService();
