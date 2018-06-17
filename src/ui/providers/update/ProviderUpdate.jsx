import React from 'react';
import ProviderUpdateStore from './ProviderUpdateStore';
import ProviderForm from '../ProviderForm';
import PoSActions from "../../PoSActions";

class ProviderUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    this.providerId = this.props.match.params.providerId;
    this.state = ProviderUpdateStore.getState();
  }

  componentDidMount() {
    document.title = 'Modificar proveedor';
    PoSActions.provider.update.onIdChange(this.providerId);
  }

  componentDidUpdate() {
    if (this.state.redirectToList) {
      PoSActions.provider.update.setRedirectAsCompleted();
      this.props.history.push('/providers');
    }
  }

  componentWillMount() {
    ProviderUpdateStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    ProviderUpdateStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState(ProviderUpdateStore.getState());
  }

  static onNameChange(evt) {
    PoSActions.provider.update.onNameChange(evt.target.value);
  }

  static onSaveClicked(evt) {
    evt.preventDefault();
    PoSActions.provider.update.save();
  }

  render() {
    return (
      <div className="container">
        <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
          <h1>Modificar proveedor</h1>
          <br />
          <br />

          <ProviderForm
            name={ this.state.provider.name.value }
            nameError={ this.state.provider.name.error }
            onNameChange={ ProviderUpdate.onNameChange }
            onSaveClicked={ ProviderUpdate.onSaveClicked }
            submitText='Modificar'
          />
        </div>
      </div>
    );
  }
}

export default ProviderUpdate;
