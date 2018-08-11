const ActionTypes = {
  BRANDS: {
    LIST: {
      PAGE: 'brands/list/page',
      FILTER_BY_NAME: 'brands/list/filter_by_name',
      FILTER_BY_ID: 'brands/list/filter_by_id'
    },
    CREATE: {
      ON_NAME_CHANGE: 'brands/create/on_name_change',
      SAVE: 'brands/create/save',
      SET_REDIRECT_AS_COMPLETED: 'brands/create/set_redirect_as_completed'
    },
    UPDATE: {
      ON_ID_CHANGE: 'brands/update/on_id_change',
      ON_NAME_CHANGE: 'brands/update/on_name_change',
      SAVE: 'brands/update/save',
      SET_REDIRECT_AS_COMPLETED: 'brands/update/set_redirect_as_completed'
    }
  },
  MEASUREMENT_UNITS: {
    LIST: {
      PAGE: 'measurement_units/list/page',
      FILTER_BY_NAME: 'measurement_units/list/filter_by_name',
      FILTER_BY_ID: 'measurement_units/list/filter_by_id',
      FILTER_BY_ABBR: 'measurement_units/list/filter_by_abbr'
    },
    CREATE: {
      ON_NAME_CHANGE: 'measurement_units/create/on_name_change',
      ON_ABBR_CHANGE: 'measurement_units/create/on_abbr_change',
      SAVE: 'measurement_units/create/save',
      SET_REDIRECT_AS_COMPLETED: 'measurement_units/create/set_redirect_as_completed'
    },
    UPDATE: {
      ON_ID_CHANGE: 'measurement_units/update/on_id_change',
      ON_NAME_CHANGE: 'measurement_units/update/on_name_change',
      ON_ABBR_CHANGE: 'measurement_units/update/on_abbr_change',
      SAVE: 'measurement_units/update/save',
      SET_REDIRECT_AS_COMPLETED: 'measurement_units/update/set_redirect_as_completed'
    }
  },
  PRODUCTS: {
    PAGE: 'products/page',
    SET_END_DATE: 'products/set_end_date',
    FILTER_BY_CODE: 'products/filter_by_code',
    FILTER_BY_NAME: 'products/filter_by_name',
    FILTER_BY_BRAND: 'products/filter_by_brand',
    FILTER_BY_MEASUREMENT_UNIT: 'products/filter_by_measurement_unit',

    UPSERT: {
      ON_ID_CHANGE: 'products/upsert/on_id_change',
      ON_BRAND_CHANGE: 'products/upsert/on_brand_change',
      ON_BRAND_INP_VALUE_CHANGE: 'products/upsert/on_brand_inp_value_change',
      ON_M_UNIT_CHANGE: 'products/upsert/on_m_unit_change',
      ON_M_UNIT_INP_VALUE_CHANGE: 'products/upsert/on_m_unit_inp_value_change',
      ON_NAME_CHANGE: 'products/upsert/on_name_change',
      ON_CODE_CHANGE: 'products/upsert/on_code_change',
      ON_DESC_CHANGE: 'products/upsert/on_desc_change',
      ON_MIN_EXISTENCES_CHANGE: 'products/upsert/on_min_existences_change',
      SAVE: 'products/upsert/save',
      SET_REDIRECT_AS_COMPLETED: 'products/upsert/set_redirect_as_completed',
    },
  },
  PROVIDERS: {
    LIST: {
      PAGE: 'providers/list/page',
      FILTER_BY_NAME: 'providers/list/filter_by_name',
      FILTER_BY_ID: 'providers/list/filter_by_id'
    },
    CREATE: {
      ON_NAME_CHANGE: 'providers/create/on_name_change',
      SAVE: 'providers/create/save',
      SET_REDIRECT_AS_COMPLETED: 'providers/create/set_redirect_as_completed'
    },
    UPDATE: {
      ON_ID_CHANGE: 'providers/update/on_id_change',
      ON_NAME_CHANGE: 'providers/update/on_name_change',
      SAVE: 'providers/update/save',
      SET_REDIRECT_AS_COMPLETED: 'providers/update/set_redirect_as_completed'
    }
  },
  PURCHASES: {
    UPSERT: {
      ON_ID_CHANGE: 'purchase/upsert/on_id_change',
      ON_DATE_CHANGE: 'purchase/upsert/on_date_change',
      ON_INVESTMENT_CHANGE: 'purchase/upsert/on_investment_change',
      ON_REINVESTMENT_CHANGE: 'purchase/upsert/on_reinvestment_change',
      ON_TOTAL_PAID_CHANGE: 'purchase/upsert/on_total_paid_change',
      ON_PROD_VALUE_CHANGE: 'purchase/upsert/on_product_value_change',
      ON_PROD_SELECTED: 'purchase/upsert/on_product_selected',
      ON_QUANTITY_CHANGE: 'purchase/upsert/on_quantity_change',
      ON_PROVIDER_VALUE_CHANGE: 'purchase/upsert/on_provider_value_change',
      ON_PROVIDER_SELECTED: 'purchase/upsert/on_provider_selected',
      ON_COST_CHANGE: 'purchase/upsert/on_cost_change',
      ON_PRICE_CHANGE: 'purchase/upsert/on_price_change',
      ON_ADD_PRODUCT_CLICKED: 'purchase/upsert/on_add_product_clicked',
      ON_EDIT_CONTENT_CLICKED: 'purchase/upsert/on_edit_content',
      ON_DELETE_CONTENT_CLICKED: 'purchase/upsert/on_delete_content',
      ON_SAVE_CLICKED: 'purchase/upsert/on_save_clicked',
      SET_REDIRECT_AS_COMPLETED: 'purchase/upsert/set_redirect_as_completed'
    },
    LIST: {
      ON_FILTER_ID_CHANGE: 'puchases/list/on_filter_id_change',
      ON_FILTER_DATE_CHANGE: 'purchases/list/on_filter_date_change',
      ON_FILTER_PROVIDER_CHANGE: 'purchases/list/on_filter_provider_change',
      ON_FILTER_INVESTMENT_CHANGE: 'puchases/list/on_filter_investment_change',
      ON_FILTER_REINVESTMENT_CHANGE: 'puchases/list/on_filter_reinvestment_change',
      ON_FILTER_TOTAL_CHANGE: 'puchases/list/on_filter_total_change',
      LIST: 'purchase/list/list'
    },
    VIEW: {
      FETCH: 'purchase/view/fetch',
      ON_FILTER_PRODUCT_CHANGE: 'purchase/view/on_filter_product_change',
      ON_FILTER_QUANTITY_CHANGE: 'purchase/view/on_filter_quantity_change',
      ON_FILTER_M_UNIT_CHANGE: 'purchase/view/on_filter_measurement_unit_change',
      ON_FILTER_SOLD_CHANGE: 'purchase/view/on_filter_sold_change',
      ON_FILTER_STOCK_CHANGE: 'purchase/view/on_filter_stock_change',
      ON_FILTER_UNIT_COST_CHANGE: 'purchase/view/on_filter_unit_cost_change',
      ON_FILTER_COST_CHANGE: 'purchase/view/on_filter_cost_change'
    }
  },
  PURCHASE_PRICES: {
    FETCH_P_MODEL: 'purchase_prices/fetch_p_model'
  },
  SALES: {
    UPSERT: {
      ON_ID_CHANGE: 'sales/upsert/on_id_change',
      ON_DATE_CHANGE: 'sales/upsert/on_date_change',
      ON_PRODUCT_AUTO_COMPLETE_VALUE_CHANGE: 'sales/upsert/on_product_ac_change',
      ON_PRODUCT_SELECTED: 'sales/upsert/on_product_selected',
      ON_QUANTITY_CHANGE: 'sales/upsert/on_quantity_change',
      ON_SELF_CONSUMPTION_CHANGE: 'sales/upsert/on_self_consumption_change',
      ON_PRICE_CHANGE: 'sales/upsert/on_price_change',
      ON_ADD_PRODUCT_CLICKED: 'sales/upsert/on_add_product_clicked',
      ON_SAVE_CLICKED: 'sales/upsert/on_save_clicked',
      ON_CONTENT_DELETE_CLICKED: 'sales/upsert/on_content_delete_clicked',
      ON_CONTENT_EDIT_CLICKED: 'sales/upsert/on_content_edit_clicked'
    },
    LIST: {
      ALL: 'sales/list/all',
      ON_FILTER_ID_CHANGE: 'sales/list/on_filter_id_change',
      ON_FILTER_DATE_CHANGE: 'sales/list/on_filter_date_change',
      ON_FILTER_TOTAL_CHANGE: 'sales/list/on_filter_total_change',
    },

    SET_REDIRECT_AS_COMPLETED: 'sales/set_redirect_as_completed',
    FETCH: 'sales/fetch'
  }
};

export default ActionTypes;
