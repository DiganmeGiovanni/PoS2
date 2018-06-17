const ActionTypes = {
  BRANDS: {
    PAGE: 'brands/page',
  },
  MEASUREMENT_UNITS: {
    PAGE: 'measurement_units/page',
  },
  PRODUCTS: {
    PAGE: 'products/page',
    SET_END_DATE: 'products/set_end_date',

    FILTER_BY_NAME: 'products/filter_by_name'
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
