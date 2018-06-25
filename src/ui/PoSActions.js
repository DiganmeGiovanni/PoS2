import ActionTypes from './ActionTypes';
import PosDispatcher from './PoSDispatcher';

const PoSActions = {
  brands: {
    list: {
      page(pageNumber, pageSize) {
        PosDispatcher.dispatch({
          type: ActionTypes.BRANDS.LIST.PAGE,
          pageNumber,
          pageSize,
        });
      },
      filterByName(name) {
        PosDispatcher.dispatch({
          type: ActionTypes.BRANDS.LIST.FILTER_BY_NAME,
          name
        })
      },
      filterById(id) {
        PosDispatcher.dispatch({
          type: ActionTypes.BRANDS.LIST.FILTER_BY_ID,
          id
        })
      }
    },
    create: {
      onNameChange(name) {
        PosDispatcher.dispatch({
          type: ActionTypes.BRANDS.CREATE.ON_NAME_CHANGE,
          name
        })
      },
      save() {
        PosDispatcher.dispatch({ type: ActionTypes.BRANDS.CREATE.SAVE });
      },
      setRedirectAsCompleted() {
        PosDispatcher.dispatch({
          type: ActionTypes.BRANDS.CREATE.SET_REDIRECT_AS_COMPLETED
        });
      }
    },
    update: {
      onIdChange(id) {
        PosDispatcher.dispatch({
          type: ActionTypes.BRANDS.UPDATE.ON_ID_CHANGE,
          id
        });
      },
      onNameChange(name) {
        PosDispatcher.dispatch({
          type: ActionTypes.BRANDS.UPDATE.ON_NAME_CHANGE,
          name
        })
      },
      save() {
        PosDispatcher.dispatch({ type: ActionTypes.BRANDS.UPDATE.SAVE });
      },
      setRedirectAsCompleted() {
        PosDispatcher.dispatch({
          type: ActionTypes.BRANDS.UPDATE.SET_REDIRECT_AS_COMPLETED
        });
      }
    }
  },
  measurementUnits: {
    list: {
      page(pageNumber, pageSize) {
        PosDispatcher.dispatch({
          type: ActionTypes.MEASUREMENT_UNITS.LIST.PAGE,
          pageNumber,
          pageSize,
        });
      },
      filterById(id) {
        PosDispatcher.dispatch({
          type: ActionTypes.MEASUREMENT_UNITS.LIST.FILTER_BY_ID,
          id
        })
      },
      filterByName(name) {
        PosDispatcher.dispatch({
          type: ActionTypes.MEASUREMENT_UNITS.LIST.FILTER_BY_NAME,
          name
        })
      },
      filterByAbbr(abbr) {
        PosDispatcher.dispatch({
          type: ActionTypes.MEASUREMENT_UNITS.LIST.FILTER_BY_ABBR,
          abbr
        })
      }
    },
    create: {
      onNameChange(name) {
        PosDispatcher.dispatch({
          type: ActionTypes.MEASUREMENT_UNITS.CREATE.ON_NAME_CHANGE,
          name
        })
      },
      onAbbrChange(abbr) {
        PosDispatcher.dispatch({
          type: ActionTypes.MEASUREMENT_UNITS.CREATE.ON_ABBR_CHANGE,
          abbr
        })
      },
      save() {
        PosDispatcher.dispatch({
          type: ActionTypes.MEASUREMENT_UNITS.CREATE.SAVE
        });
      },
      setRedirectAsCompleted() {
        PosDispatcher.dispatch({
          type: ActionTypes.MEASUREMENT_UNITS.CREATE.SET_REDIRECT_AS_COMPLETED
        });
      }
    },
    update: {
      onIdChange(id) {
        PosDispatcher.dispatch({
          type: ActionTypes.MEASUREMENT_UNITS.UPDATE.ON_ID_CHANGE,
          id
        });
      },
      onNameChange(name) {
        PosDispatcher.dispatch({
          type: ActionTypes.MEASUREMENT_UNITS.UPDATE.ON_NAME_CHANGE,
          name
        })
      },
      onAbbrChange(abbr) {
        PosDispatcher.dispatch({
          type: ActionTypes.MEASUREMENT_UNITS.UPDATE.ON_ABBR_CHANGE,
          abbr
        })
      },
      save() {
        PosDispatcher.dispatch({
          type: ActionTypes.MEASUREMENT_UNITS.UPDATE.SAVE
        });
      },
      setRedirectAsCompleted() {
        PosDispatcher.dispatch({
          type: ActionTypes.MEASUREMENT_UNITS.UPDATE.SET_REDIRECT_AS_COMPLETED
        });
      }
    }
  },
  products: {
    page(pageNumber, pageSize) {
      PosDispatcher.dispatch({
        type: ActionTypes.PRODUCTS.PAGE,
        pageNumber,
        pageSize,
      });
    },
    setEndDate(endDate) {
      PosDispatcher.dispatch({
        type: ActionTypes.PRODUCTS.SET_END_DATE,
        endDate
      });
    },
    filterByName(name) {
      PosDispatcher.dispatch({
        type: ActionTypes.PRODUCTS.FILTER_BY_NAME,
        name
      });
    }
  },
  provider: {
    list: {
      page(pageNumber, pageSize) {
        PosDispatcher.dispatch({
          type: ActionTypes.PROVIDERS.LIST.PAGE,
          pageNumber,
          pageSize,
        });
      },
      filterByName(name) {
        PosDispatcher.dispatch({
          type: ActionTypes.PROVIDERS.LIST.FILTER_BY_NAME,
          name
        })
      },
      filterById(id) {
        PosDispatcher.dispatch({
          type: ActionTypes.PROVIDERS.LIST.FILTER_BY_ID,
          id
        })
      }
    },
    create: {
      onNameChange(name) {
        PosDispatcher.dispatch({
          type: ActionTypes.PROVIDERS.CREATE.ON_NAME_CHANGE,
          name
        })
      },
      save() {
        PosDispatcher.dispatch({ type: ActionTypes.PROVIDERS.CREATE.SAVE });
      },
      setRedirectAsCompleted() {
        PosDispatcher.dispatch({
          type: ActionTypes.PROVIDERS.CREATE.SET_REDIRECT_AS_COMPLETED
        });
      }
    },
    update: {
      onIdChange(id) {
        PosDispatcher.dispatch({
          type: ActionTypes.PROVIDERS.UPDATE.ON_ID_CHANGE,
          id
        });
      },
      onNameChange(name) {
        PosDispatcher.dispatch({
          type: ActionTypes.PROVIDERS.UPDATE.ON_NAME_CHANGE,
          name
        })
      },
      save() {
        PosDispatcher.dispatch({ type: ActionTypes.PROVIDERS.UPDATE.SAVE });
      },
      setRedirectAsCompleted() {
        PosDispatcher.dispatch({
          type: ActionTypes.PROVIDERS.UPDATE.SET_REDIRECT_AS_COMPLETED
        });
      }
    }
  },
  purchase: {
    create: {
      addProduct(product, provider, quantity, cost, price) {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASE.ADD_CONTENT,
          product,
          provider,
          quantity,
          cost,
          price
        });
      },
      changeDate(date) {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASE.CHANGE_DATE,
          date
        });
      },
      changePaymentReinvestment(amount) {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASE.CHANGE_PAYMENT_AS_REINVESTMENT,
          amount: amount
        });
      },
      changePaymentInvestment(amount) {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASE.CHANGE_PAYMENT_AS_INVESTMENT,
          amount: amount
        });
      },
      changeTotalPaid(amount) {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASE.CHANGE_TOTAL_PAID,
          amount: amount
        })
      },
      save() {
        PosDispatcher.dispatch({ type: ActionTypes.PURCHASE.SAVE });
      },
      setRedirectAsCompleted() {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASE.SET_REDIRECT_AS_COMPLETED
        });
      }
    },
    list: {
      page(pageNumber, pageSize) {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASE.LIST,
          pageNumber,
          pageSize
        })
      },
      fetch(purchaseId) {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASE.FETCH,
          purchaseId
        });
      }
    },
  },
  purchasePrices: {
    fetchProductModel(pModelId) {
      PosDispatcher.dispatch({
        type: ActionTypes.PURCHASE_PRICES.FETCH_P_MODEL,
        pModelId
      });
    }
  },
  sales: {
    create: {
      addProduct(product, quantity, price) {
        PosDispatcher.dispatch({
          type: ActionTypes.SALES.ADD_CONTENT,
          product,
          quantity,
          price
        });
      },
      changeDate(date) {
        PosDispatcher.dispatch({
          type: ActionTypes.SALES.CHANGE_DATE,
          date
        });
      },
      changeSelfConsumption(selfConsumption) {
        PosDispatcher.dispatch({
          type: ActionTypes.SALES.CHANGE_SELF_CONSUMPTION,
          selfConsumption
        });
      },
      save() {
        PosDispatcher.dispatch({
          type: ActionTypes.SALES.SAVE
        });
      },

      setRedirectAsCompleted() {
        PosDispatcher.dispatch({
          type: ActionTypes.SALES.SET_REDIRECT_AS_COMPLETED
        });
      },

      // New actions
      onDateChange(date) {
        PosDispatcher.dispatch({
          type: ActionTypes.SALES.CREATE.ON_DATE_CHANGE,
          date
        });
      },
      onProductAutoCompleteValueChange(value) {
        PosDispatcher.dispatch({
          type: ActionTypes.SALES.CREATE.ON_PRODUCT_AUTO_COMPLETE_VALUE_CHANGE,
          value
        });
      },
      onProductSelected(product) {
        PosDispatcher.dispatch({
          type: ActionTypes.SALES.CREATE.ON_PRODUCT_SELECTED,
          product
        });
      },
      onQuantityChange(value) {
        PosDispatcher.dispatch({
          type: ActionTypes.SALES.CREATE.ON_QUANTITY_CHANGE,
          value
        });
      },
      onSelfConsumptionChange(value) {
        PosDispatcher.dispatch({
          type: ActionTypes.SALES.CREATE.ON_SELF_CONSUMPTION_CHANGE,
          value
        });
      },
      onPriceChange(value) {
        PosDispatcher.dispatch({
          type: ActionTypes.SALES.CREATE.ON_PRICE_CHANGE,
          value
        })
      },
      onAddProductClicked() {
        PosDispatcher.dispatch({
          type: ActionTypes.SALES.CREATE.ON_ADD_PRODUCT_CLICKED
        })
      },
      onSaveClicked() {
        PosDispatcher.dispatch({
          type: ActionTypes.SALES.CREATE.ON_SAVE_CLICKED
        });
      },
      onContentDeleteClicked(index) {
        PosDispatcher.dispatch({
          type: ActionTypes.SALES.CREATE.ON_CONTENT_DELETE_CLICKED,
          index
        })
      }
    },
    list: {
      page(pageNumber, pageSize) {
        PosDispatcher.dispatch({
          type: ActionTypes.SALES.LIST,
          pageNumber,
          pageSize
        });
      },
      fetch(saleId) {
        PosDispatcher.dispatch({
          type: ActionTypes.SALES.FETCH,
          saleId
        });
      }
    }
  }
};

export default PoSActions;
