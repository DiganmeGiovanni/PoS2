import React from 'react';
import ProvidersForm from './ProvidersForm';
import { Provider } from '../../model/entities';

class ProvidersCreate extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      provider: Provider.build(),
    };
  }

  componentDidMount() {
    document.title = 'Registrar proveedor';
  }

  onSubmit(provider, history) {
    provider.save().then(() => {
      this.setState({
        provider,
      });

      history.push('/providers');
    });
  }

  render() {
    return (
      <div className="container">
        <div className="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
          <h1>Nuevo proveedor</h1>
          <br />
          <br />

          <ProvidersForm
            onSubmit={this.onSubmit}
            provider={this.state.provider}
          />
        </div>
      </div>
    );
  }
}

export default ProvidersCreate;
