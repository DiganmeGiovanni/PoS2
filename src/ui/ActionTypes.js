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
    FILTER_BY_NAME: 'products/filter_by_name',

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
  PURCHASE: {
    ADD_CONTENT: 'purchase/add_content',
    CHANGE_PAYMENT_AS_REINVESTMENT: 'purchase/change_reinvestment',
    CHANGE_PAYMENT_AS_INVESTMENT: 'purchase/change_investment',
    CHANGE_TOTAL_PAID: 'purchase/change_total_paid',
    CHANGE_DATE: 'purchase/change_date',
    SAVE: 'purchase/save',
    SET_REDIRECT_AS_COMPLETED: 'purchase/set_redirect_as_completed',

    LIST: 'purchase/list',
    FETCH: 'purchase/fetch',
  },
  PURCHASE_PRICES: {
    FETCH_P_MODEL: 'purchase_prices/fetch_p_model'
  },
  SALES: {
    CREATE: {
      ON_DATE_CHANGE: 'sales/create/on_date_change',
      ON_PRODUCT_AUTO_COMPLETE_VALUE_CHANGE: 'sales/create/on_product_ac_change',
      ON_PRODUCT_SELECTED: 'sales/create/on_product_selected',
      ON_QUANTITY_CHANGE: 'sales/create/on_quantity_change',
      ON_SELF_CONSUMPTION_CHANGE: 'sales/create/on_self_consumption_change',
      ON_PRICE_CHANGE: 'sales/create/on_price_change',
      ON_ADD_PRODUCT_CLICKED: 'sales/create/on_add_product_clicked',
      ON_SAVE_CLICKED: 'sales/create/on_save_clicked',
      ON_CONTENT_DELETE_CLICKED: 'sales/create/on_content_delete_clicked',
    },

    ADD_CONTENT: 'sales/add_content',
    CHANGE_DATE: 'sales/change_date',
    CHANGE_SELF_CONSUMPTION: 'sales/self_consumption',
    SAVE: 'sales/save',
    SET_REDIRECT_AS_COMPLETED: 'sales/set_redirect_as_completed',

    LIST: 'sales/list',
    FETCH: 'sales/fetch'
  }
};

export default ActionTypes;
