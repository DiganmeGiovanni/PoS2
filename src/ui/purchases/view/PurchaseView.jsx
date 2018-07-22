import React from 'react';
import PoSActions from "../../PoSActions";
import PurchaseViewStore from "../../purchases/view/PurchaseViewStore";
import TextFormatter from '../../../services/TextFormatter';

import moment from 'moment';
import 'moment/locale/es';
import PurchaseContents from "./PurchaseContents";

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
    PoSActions.purchases.fetch(this.purchaseId);
  }

  componentWillUnmount() {
    PurchaseViewStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState(PurchaseViewStore.getState());
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
          <label className="control-label">Fecha:</label>
          <br/>
          <span>{ moment(this.state.purchase.date).format('DD MMMM, YYYY') }</span>
        </div>

        <div className="col-sm-3">
          <label className="control-label">Inversión</label>
          <br/>
          <span>{ TextFormatter.asMoney(this.state.purchase.investment) }</span>
        </div>

        <div className="col-sm-3">
          <label className="control-label">Reinversión</label>
          <br/>
          <span>{ TextFormatter.asMoney(this.state.purchase.reinvestment) }</span>
        </div>

        <div className="col-sm-3">
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
      <div className="container">
        <h1 className="margin-bottom-0">Detalles de compra</h1>
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
            <h4 className="panel-title">Contenido</h4>
          </div>
          <div className="panel-body">
            <PurchaseContents
              contents={ this.state.contents }
              isLoadingProducts={ this.state.isLoadingProducts }
            />
          </div>
        </div>
      </div>
    );
  }
}

export default PurchaseView;