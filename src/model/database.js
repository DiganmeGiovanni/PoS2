const Sequelize = require('sequelize');

const sequelize = new Sequelize('pos_db', 'root', 'root', {
  host: 'localhost',
  dialect: 'sqlite',
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },

  storage: 'pos.db.sqlite',
  define: {
    freezeTableName: true,
    timestamps: true,
  },
});

export default sequelize;
