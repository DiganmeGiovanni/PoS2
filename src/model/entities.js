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
    type: Sequelize.INTEGER,
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
const Existence = sequelize.define('existence', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  code: {
    type: Sequelize.STRING,
  },
  exhibitor: {
    type: Sequelize.INTEGER,
  },
  disabledAt: {
    field: 'disabled_at',
    type: Sequelize.DATE,
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
  purchaseId: {
    field: 'purchase_id',
    type: Sequelize.INTEGER,
    references: {
      model: Purchase,
      key: 'id',
    },
  },
});

// noinspection JSUnresolvedVariable, JSUnresolvedFunction
const Sale = sequelize.define('sale', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  selfConsumption: {
    field: 'self_consumption',
    type: Sequelize.BOOLEAN,
    defaultValue: false
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
    allowNull: true,
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
const SaleHasExistence = sequelize.define('sale_has_existence', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  partialQuantity: {
    field: 'partial_quantity',
    type: Sequelize.DOUBLE,
    defaultValue: 0
  },
  saleId: {
    field: 'sale_id',
    type: Sequelize.INTEGER,
    references: {
      model: Sale,
      key: 'id',
    },
  },
  existenceId: {
    field: 'existence_id',
    type: Sequelize.INTEGER,
    references: {
      model: Existence,
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
});


// Define all relationships between models
Provider.hasMany(PurchasePrice, { foreignKey: 'provider_id' });
PurchasePrice.belongsTo(Provider, { foreignKey: 'provider_id' });
PurchasePrice.belongsTo(Product, { foreignKey: 'product_model_id' });
PurchasePrice.belongsTo(MeasurementUnit, { foreignKey: 'measurement_unit_id' });
PurchasePrice.hasMany(Existence, { foreignKey: 'purchase_price_id' });
Brand.hasMany(Product, { foreignKey: 'brand_id' });
Product.hasMany(PurchasePrice, { foreignKey: 'product_id' });
Product.hasMany(Existence, { foreignKey: 'product_id' });
Product.hasMany(SalePrice, { foreignKey: 'product_id' });
Product.hasMany(Equivalence, { foreignKey: 'product_id' });
Product.belongsTo(MeasurementUnit, {
  as: 'measurementUnit',
  foreignKey: 'measurement_unit_id'
});
Product.belongsTo(Brand, { foreignKey: 'brand_id' });
Purchase.hasMany(Existence, { foreignKey: 'purchase_id' });
Existence.belongsTo(PurchasePrice, { foreignKey: 'purchase_price_id' });
Existence.belongsTo(Purchase, { foreignKey: 'purchase_id' });
Existence.belongsTo(Product, { foreignKey: 'product_id' });
SaleHasExistence.belongsTo(Existence, { foreignKey: 'existence_id' });
SaleHasExistence.belongsTo(Sale, { foreignKey: 'sale_id' });
SaleHasExistence.belongsTo(SalePrice, { foreignKey: 'sale_price_id' });
Sale.hasMany(SaleHasExistence, { foreignKey: 'sale_id' });
SalePrice.belongsTo(Product, { foreignKey: 'product_id' });


// Sync all models against database
Provider.sync();
Brand.sync();
Purchase.sync();
MeasurementUnit.sync();
Product.sync();
Equivalence.sync();
PurchasePrice.sync();
Existence.sync();
Sale.sync();
SalePrice.sync();
SaleHasExistence.sync();

export {
  Provider,
  Brand,
  Purchase,
  MeasurementUnit,
  Sale,
  Product,
  Equivalence,
  PurchasePrice,
  Existence,
  SalePrice,
  SaleHasExistence,
};
