import React from 'react';
import BrandUpdateStore from './BrandUpdateStore';
import BrandForm from '../BrandForm';
import PoSActions from "../../PoSActions";

class BrandUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    this.brandId = this.props.match.params.brandId;
    this.state = BrandUpdateStore.getState();
  }

  componentDidMount() {
    document.title = 'Modificar marca';
    PoSActions.brands.update.onIdChange(this.brandId);
  }

  componentDidUpdate() {
    if (this.state.redirectToList) {
      PoSActions.brands.update.setRedirectAsCompleted();
      this.props.history.push('/brands');
    }
  }

  componentWillMount() {
    BrandUpdateStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    BrandUpdateStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState(BrandUpdateStore.getState());
  }

  static onNameChange(evt) {
    PoSActions.brands.update.onNameChange(evt.target.value);
  }

  static onSaveClicked(evt) {
    evt.preventDefault();
    PoSActions.brands.update.save();
  }

  render() {
    return (
      <div className="container">
        <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
          <h1>Modificar marca</h1>
          <br />
          <br />

          <BrandForm
            name={ this.state.brand.name.value }
            nameError={ this.state.brand.name.error }
            onNameChange={ BrandUpdate.onNameChange }
            onSaveClicked={ BrandUpdate.onSaveClicked }
            submitText='Modificar'
          />
        </div>
      </div>
    );
  }
}

export default BrandUpdate;
