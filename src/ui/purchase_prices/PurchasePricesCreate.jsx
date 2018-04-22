import React from 'react';
import PurchasePricesForm from "./PurchasePricesForm";
import { PurchasePrice } from "../../model/entities";

class PurchasePricesCreate extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      purchasePrice: PurchasePrice.build()
    }
  }

  onSubmit(purchasePrice, history) {
    purchasePrice.save().then(() => {
      this.setState({ purchasePrice })
      history.push(`purchase_prices/${ purchasePrice.id }`)
    });
  }

  render() {
    return (
      <div className="container">
        <div className="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
          <h1>Registrar precio de compra</h1>
          <br/><br/>

          <PurchasePricesForm
            onSubmit={ this.onSubmit }
            purchasePrice={ this.state.purchasePrice }
          />
        </div>
      </div>
    )
  }
}

export default PurchasePricesCreate
