import sequelize from './database';
const Sequelize = require('sequelize');

// noinspection JSUnresolvedVariable
const Provider = sequelize.define('provider', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
});

// noinspection JSUnresolvedVariable
const Brand = sequelize.define('brand', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
});

// noinspection JSUnresolvedVariable, JSUnresolvedFunction
const Purchase = sequelize.define('purchase', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  reinvestment: {
    type: Sequelize.DECIMAL(13, 2),
    allowNull: false,
  },
  investment: {
    type: Sequelize.DECIMAL(13, 2),
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false
  }
});

// noinspection JSUnresolvedVariable, JSUnresolvedFunction
const MeasurementUnit = sequelize.define('measurement_unit', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  abbreviation: {
    type: Sequelize.STRING(45),
  },
});

// noinspection JSUnresolvedVariable, JSUnresolvedFunction
const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  code: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING(3000),
  },
  minimalExistences: {
    field: 'minimal_existences',
    type: Sequelize.DOUBLE,
    defaultValue: 0,
  },
  existences: {
    field: 'existences',
    type: Sequelize.DOUBLE,
    defaultValue: 0,
  },
  brandId: {
    field: 'brand_id',
    type: Sequelize.INTEGER,
    references: {
      model: Brand,
      key: 'id',
    },
  },
  measurementUnitId: {
    field: 'measurement_unit_id',
    type: Sequelize.INTEGER,
    references: {
      model: MeasurementUnit,
      key: 'id',
    },
  }
});

// noinspection JSUnresolvedVariable
const Equivalence = sequelize.define('equivalence', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  multiplicative: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  value: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  measurementUnitId: {
    field: 'measurement_unit_id',
    type: Sequelize.INTEGER,
    references: {
      model: MeasurementUnit,
      key: 'id',
    },
  },
  productId: {
    field: 'product_id',
    type: Sequelize.INTEGER,
    references: {
      model: Product,
      key: 'id',
    },
  },
});

// noinspection JSUnresolvedVariable, JSUnresolvedFunction
const PurchasePrice = sequelize.define('purchase_price', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  price: {
    type: Sequelize.DECIMAL(13, 2),
    allowNull: false,
  },
  minimalQuantity: {
    field: 'minimal_quantity',
    type: Sequelize.DOUBLE,
    defaultValue: 1,
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false
  },
  measurementUnitId: {
    field: 'measurement_unit_id',
    type: Sequelize.INTEGER,
    references: {
      model: MeasurementUnit,
      key: 'id',
    },
  },
  providerId: {
    field: 'provider_id',
    type: Sequelize.INTEGER,
    references: {
      model: Provider,
      key: 'id',
    },
  },
  productId: {
    field: 'product_id',
    type: Sequelize.INTEGER,
    references: {
      model: Product,
      key: 'id',
    },
  },
});

// noinspection JSUnresolvedVariable
const PurchaseHasProduct = sequelize.define('purchase_has_product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  purchaseId: {
    field: 'purchase_id',
    type: Sequelize.INTEGER,
    references: {
      model: Purchase,
      key: 'id',
    },
  },
  productId: {
    field: 'product_id',
    type: Sequelize.INTEGER,
    references: {
      model: Product,
      key: 'id',
    },
  },
  purchasePriceId: {
    field: 'purchase_price_id',
    type: Sequelize.INTEGER,
    references: {
      model: PurchasePrice,
      key: 'id',
    },
  },
  quantity: {
    field: 'quantity',
    type: Sequelize.DOUBLE
  }
});

// noinspection JSUnresolvedVariable, JSUnresolvedFunction
const Sale = sequelize.define('sale', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  total: {
    type: Sequelize.DECIMAL(13, 2),
    allowNull: false,
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false
  },
});

// noinspection JSUnresolvedVariable, JSUnresolvedFunction
const SalePrice = sequelize.define('sale_price', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  price: {
    type: Sequelize.DECIMAL(13, 2),
    allowNull: false,
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false
  },
  productId: {
    field: 'product_id',
    type: Sequelize.INTEGER,
    references: {
      model: Product,
      key: 'id',
    },
  },
});

// noinspection JSUnresolvedVariable
const SaleHasProduct = sequelize.define('sale_has_product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  saleId: {
    field: 'sale_id',
    type: Sequelize.INTEGER,
    references: {
      model: Sale,
      key: 'id',
    },
  },
  salePriceId: {
    field: 'sale_price_id',
    type: Sequelize.INTEGER,
    references: {
      model: SalePrice,
      key: 'id',
    },
  },
  selfConsumption: {
    field: 'self_consumption',
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  quantity: {
    field: 'quantity',
    type: Sequelize.DOUBLE,
    defaultValue: 1
  },
});


//
// Define all relationships between models

Provider.hasMany(PurchasePrice, { foreignKey: 'provider_id' });
PurchasePrice.belongsTo(Provider, {
  as: 'provider',
  foreignKey: 'provider_id'
});
PurchasePrice.belongsTo(Product, { foreignKey: 'product_model_id' });
PurchasePrice.belongsTo(MeasurementUnit, { foreignKey: 'measurement_unit_id' });
Brand.hasMany(Product, { foreignKey: 'brand_id' });
Product.hasMany(PurchasePrice, { foreignKey: 'product_id' });
Product.hasMany(PurchaseHasProduct, { foreignKey: 'product_id' });
Product.hasMany(SalePrice, { foreignKey: 'product_id' });
Product.hasMany(Equivalence, { foreignKey: 'product_id' });
Product.belongsTo(MeasurementUnit, {
  as: 'measurementUnit',
  foreignKey: 'measurement_unit_id'
});
Product.belongsTo(Brand, { foreignKey: 'brand_id' });
Purchase.hasMany(PurchaseHasProduct, { foreignKey: 'purchase_id' });
PurchaseHasProduct.belongsTo(Product, {
  as: 'product',
  foreignKey: 'product_id' });
PurchaseHasProduct.belongsTo(Purchase, { foreignKey: 'purchase_id' });
PurchaseHasProduct.belongsTo(PurchasePrice, {
  as: 'purchasePrice',
  foreignKey: 'purchase_price_id'
});
SaleHasProduct.belongsTo(Sale, { foreignKey: 'sale_id' });
SaleHasProduct.belongsTo(SalePrice, { as: 'salePrice', foreignKey: 'sale_price_id' });
Sale.hasMany(SaleHasProduct, { foreignKey: 'sale_id' });
SalePrice.belongsTo(Product, { as: 'product', foreignKey: 'product_id' });


// Sync all models against database
Provider.sync();
Brand.sync();
Purchase.sync();
MeasurementUnit.sync();
Product.sync();
Equivalence.sync();
PurchasePrice.sync();
PurchaseHasProduct.sync();
Sale.sync();
SalePrice.sync();
SaleHasProduct.sync();

export {
  Provider,
  Brand,
  Purchase,
  MeasurementUnit,
  Product,
  Equivalence,
  PurchasePrice,
  PurchaseHasProduct,
  Sale,
  SalePrice,
  SaleHasProduct,
};
