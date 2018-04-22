import ActionTypes from './ActionTypes';
import PosDispatcher from './PoSDispatcher';

const PoSActions = {
  brands: {
    page(pageNumber, pageSize) {
      PosDispatcher.dispatch({
        type: ActionTypes.BRANDS.PAGE,
        pageNumber,
        pageSize,
      });
    },
  },
  measurementUnits: {
    page(pageNumber, pageSize) {
      PosDispatcher.dispatch({
        type: ActionTypes.MEASUREMENT_UNITS.PAGE,
        pageNumber,
        pageSize,
      });
    },
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
    }
  },
  provider: {
    page(pageNumber, pageSize) {
      PosDispatcher.dispatch({
        type: ActionTypes.PROVIDERS.PAGE,
        pageNumber,
        pageSize,
      });
    },
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
