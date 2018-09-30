import React from 'react';
import BrandCreateStore from './BrandCreateStore';
import BrandsForm from '../BrandForm';
import PoSActions from "../../PoSActions";

class BrandCreate extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    this.state = BrandCreateStore.getState();
  }

  componentDidMount() {
    document.title = 'Registrar marca';
  }

  componentDidUpdate() {
    if (this.state.redirectToList) {
      PoSActions.brands.create.setRedirectAsCompleted();
      this.props.history.push('/brands');
    }
  }

  componentWillMount() {
    BrandCreateStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    BrandCreateStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState(BrandCreateStore.getState());
  }

  static onNameChange(evt) {
    PoSActions.brands.create.onNameChange(evt.target.value);
  }

  static onSaveClicked(evt) {
    evt.preventDefault();
    PoSActions.brands.create.save();
  }

  render() {
    return (
      <div className="container">
        <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
          <h1>Nueva marca</h1>
          <br />

          <BrandsForm
            name={ this.state.brand.name.value }
            nameError={ this.state.brand.name.error }
            onNameChange={ BrandCreate.onNameChange }
            onSaveClicked={ BrandCreate.onSaveClicked }
          />
        </div>
      </div>
    );
  }
}

export default BrandCreate;
