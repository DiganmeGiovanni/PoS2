import ActionTypes from './ActionTypes';
import PosDispatcher from './PoSDispatcher';
import PoSDispatcher from './PoSDispatcher';

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
    },

    upsert: {
      onIdChange(id) {
        PosDispatcher.dispatch({
          type: ActionTypes.PRODUCTS.UPSERT.ON_ID_CHANGE,
          id
        });
      },
      onBrandChange(brand) {
        PosDispatcher.dispatch({
          type: ActionTypes.PRODUCTS.UPSERT.ON_BRAND_CHANGE,
          brand
        });
      },
      onBrandInpValueChange(value) {
        PosDispatcher.dispatch({
          type: ActionTypes.PRODUCTS.UPSERT.ON_BRAND_INP_VALUE_CHANGE,
          value
        })
      },
      onMeasurementUnitChange(measurementUnit) {
        PosDispatcher.dispatch({
          type: ActionTypes.PRODUCTS.UPSERT.ON_M_UNIT_CHANGE,
          measurementUnit
        });
      },
      onMeasurementUnitInpValueChange(value) {
        PoSDispatcher.dispatch({
          type: ActionTypes.PRODUCTS.UPSERT.ON_M_UNIT_INP_VALUE_CHANGE,
          value
        });
      },
      onNameChange(name) {
        PosDispatcher.dispatch({
          type: ActionTypes.PRODUCTS.UPSERT.ON_NAME_CHANGE,
          name
        });
      },
      onCodeChange(code) {
        PosDispatcher.dispatch({
          type: ActionTypes.PRODUCTS.UPSERT.ON_CODE_CHANGE,
          code
        });
      },
      onDescriptionChange(description) {
        PosDispatcher.dispatch({
          type: ActionTypes.PRODUCTS.UPSERT.ON_DESC_CHANGE,
          description
        });
      },
      onMinExistencesChange(minExistences) {
        PosDispatcher.dispatch({
          type: ActionTypes.PRODUCTS.UPSERT.ON_MIN_EXISTENCES_CHANGE,
          minExistences
        });
      },
      save() {
        PosDispatcher.dispatch({
          type: ActionTypes.PRODUCTS.UPSERT.SAVE
        });
      },
      setRedirectAsCompleted() {
        PosDispatcher.dispatch({
          type: ActionTypes.PRODUCTS.UPSERT.SET_REDIRECT_AS_COMPLETED,
        });
      }
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
  purchases: {
    upsert: {
      onIdChange(purchaseId) {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASES.UPSERT.ON_ID_CHANGE,
          purchaseId
        });
      },
      onDateChange(date) {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASES.UPSERT.ON_DATE_CHANGE,
          date
        });
      },
      onInvestmentChange(investment) {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASES.UPSERT.ON_INVESTMENT_CHANGE,
          investment
        });
      },
      onReinvestmentChange(reinvestment) {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASES.UPSERT.ON_REINVESTMENT_CHANGE,
          reinvestment
        });
      },
      onTotalPaidChange(totalPaid) {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASES.UPSERT.ON_TOTAL_PAID_CHANGE,
          totalPaid
        });
      },
      onProductValueChange(value) {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASES.UPSERT.ON_PROD_VALUE_CHANGE,
          value
        }); 
      },
      onProductSelected(product) {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASES.UPSERT.ON_PROD_SELECTED,
          product
        });
      },
      onQuantityChange(quantity) {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASES.UPSERT.ON_QUANTITY_CHANGE,
          quantity
        });
      },
      onProviderValueChange(value) {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASES.UPSERT.ON_PROVIDER_VALUE_CHANGE,
          value
        });
      },
      onProviderSelected(provider) {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASES.UPSERT.ON_PROVIDER_SELECTED,
          provider
        });
      },
      onCostChange(cost) {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASES.UPSERT.ON_COST_CHANGE,
          cost
        });
      },
      onPriceChange(price) {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASES.UPSERT.ON_PRICE_CHANGE,
          price
        });
      },
      onAddProductClicked() {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASES.UPSERT.ON_ADD_PRODUCT_CLICKED
        });
      },
      deleteContent(index) {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASES.UPSERT.ON_DELETE_CONTENT_CLICKED,
          index
        });
      },
      editContent(index) {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASES.UPSERT.ON_EDIT_CONTENT_CLICKED,
          index
        });
      },
      onSaveClicked() {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASES.UPSERT.ON_SAVE_CLICKED
        });
      },
      setRedirectAsCompleted() {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASES.UPSERT.SET_REDIRECT_AS_COMPLETED
        });
      }
    },
    list: {
      page(pageNumber, pageSize) {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASES.LIST.LIST,
          pageNumber,
          pageSize
        })
      },
      onFilterProviderChange(filter) {
        PosDispatcher.dispatch({
          type: ActionTypes.PURCHASES.LIST.ON_FILTER_PROVIDER_CHANGE,
          filter
        });
      }
    },
    fetch(purchaseId) {
      PosDispatcher.dispatch({
        type: ActionTypes.PURCHASES.FETCH,
        purchaseId
      });
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
