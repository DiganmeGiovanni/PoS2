import React from 'react';
import ProviderCreateStore from './ProviderCreateStore';
import ProviderForm from '../ProviderForm';
import PoSActions from "../../PoSActions";

class ProviderCreate extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    this.state = ProviderCreateStore.getState();
  }

  componentDidMount() {
    document.title = 'Registrar proveedor';
  }

  componentDidUpdate() {
    if (this.state.redirectToList) {
      PoSActions.provider.create.setRedirectAsCompleted();
      this.props.history.push('/providers');
    }
  }

  componentWillMount() {
    ProviderCreateStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    ProviderCreateStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState(ProviderCreateStore.getState());
  }

  static onNameChange(evt) {
    PoSActions.provider.create.onNameChange(evt.target.value);
  }

  static onSaveClicked(evt) {
    evt.preventDefault();
    PoSActions.provider.create.save();
  }

  render() {
    return (
      <div className="container">
        <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
          <h1>Nuevo proveedor</h1>
          <br />
          <br />

          <ProviderForm
            name={ this.state.provider.name.value }
            nameError={ this.state.provider.name.error }
            onNameChange={ ProviderCreate.onNameChange }
            onSaveClicked={ ProviderCreate.onSaveClicked }
          />
        </div>
      </div>
    );
  }
}

export default ProviderCreate;
