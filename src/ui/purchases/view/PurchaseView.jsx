import React from 'react';
import PropTypes from 'prop-types';
import PoSActions from "../../PoSActions";
import PurchaseViewStore from "../../purchases/view/PurchaseViewStore";
import TextFormatter from '../../../services/TextFormatter';

import moment from 'moment';
import 'moment/locale/es';
import PurchaseContents from "./PurchaseContents";
import GoBackTitle from "../../components/GoBackTitle";

moment.locale('es');

class PurchaseView extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    this.purchaseId = this.props.match.params.purchaseId;
    this.state = PurchaseViewStore.getState();
  }

  componentWillMount() {
    PurchaseViewStore.addChangeListener(this.onChange);
  }

  componentDidMount() {
    document.title = 'Detalles de compra';
    PoSActions.purchases.view.fetch(this.purchaseId);
  }

  componentWillUnmount() {
    PurchaseViewStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState(PurchaseViewStore.getState());
  }

  static onFilterProductChange(e) {
    PoSActions.purchases.view.onFilterProductChange(e.target.value);
  }

  static onFilterQuantityChange(e) {
    PoSActions.purchases.view.onFilterQuantityChange(e.target.value);
  }

  static onFilterSoldChange(e) {
    PoSActions.purchases.view.onFilterSoldChange(e.target.value);
  }

  static onFilterStockChange(e) {
    PoSActions.purchases.view.onFilterStockChange(e.target.value);
  }

  static onFilterUnitCostChange(e) {
    PoSActions.purchases.view.onFilterUnitCostChange(e.target.value);
  }

  static onFilterCostChange(e) {
    PoSActions.purchases.view.onFilterCostChange(e.target.value);
  }

  renderDetails() {
    if (this.state.purchase === null) {
      return (
        <div className="padding-32">
          <span>Espere un momento por favor ...</span>
        </div>
      )
    }

    return (
      <div className="row">
        <div className="col-sm-3">
          <label className="control-label">No. Compra:</label>
          <br/>
          <span>{ this.state.purchase.id }</span>
        </div>

        <div className="col-sm-3">
          <label className="control-label">Fecha:</label>
          <br/>
          <span>{ moment(this.state.purchase.date).format('DD MMMM, YYYY') }</span>
        </div>

        <div className="col-sm-3">
          <label className="control-label">Fecha relativa:</label>
          <br/>
          <span>{ moment(this.state.purchase.date).format('DD MMMM, YYYY') }</span>
        </div>

        <div className="col-sm-3">
          <label className="control-label">Proveedor:</label>
          <br/>
          <span>
            { this.state.contents.length > 0
                ? this.state.contents[0].provider_name
                : ''
            }
          </span>
        </div>

        <div className="col-sm-3 padding-top-16">
          <label className="control-label">Inversión</label>
          <br/>
          <span>{ TextFormatter.asMoney(this.state.purchase.investment) }</span>
        </div>

        <div className="col-sm-3 padding-top-16">
          <label className="control-label">Reinversión</label>
          <br/>
          <span>{ TextFormatter.asMoney(this.state.purchase.reinvestment) }</span>
        </div>

        <div className="col-sm-3 padding-top-16">
          <label className="control-label">Total</label>
          <br/>
          <span>{ TextFormatter.asMoney(
            this.state.purchase.investment +
                this.state.purchase.reinvestment
          ) }</span>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={this.props.embeddedMode ? '' : 'container'}>
        <GoBackTitle
          title="Detalles de la compra"
          history={ this.props.history }
        />
        <h4 className="margin-top-4"># { this.purchaseId }</h4>

        <div className="panel panel-default margin-top-32">
          <div className="panel-heading">
            <h4 className="panel-title">Compra</h4>
          </div>
          <div className="panel-body">
            { this.renderDetails() }
          </div>
        </div>

        <div className="panel panel-default">
          <div className="panel-heading">
            <h4 className="panel-title">Contenido de la compra</h4>
          </div>
          <div className="panel-body">
            <PurchaseContents
              contents={ this.state.contents }
              isLoadingProducts={ this.state.isLoadingProducts }
              onFilterProductChange={ PurchaseView.onFilterProductChange }
              onFilterQuantityChange={ PurchaseView.onFilterQuantityChange }
              onFilterSoldChange={ PurchaseView.onFilterSoldChange }
              onFilterStockChange={ PurchaseView.onFilterStockChange }
              onFilterUnitCostChange={ PurchaseView.onFilterUnitCostChange }
              onFilterCostChange={ PurchaseView.onFilterCostChange }
            />
          </div>
        </div>
      </div>
    );
  }
}

PurchaseView.propTypes = {
  embeddedMode: PropTypes.bool
};

PurchaseView.defaultProps = {
  embeddedMode: false
};

export default PurchaseView;