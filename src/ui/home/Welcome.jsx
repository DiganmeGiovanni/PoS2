import React from 'react';

class Welcome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12 text-center">
            <h1>Punto de venta</h1>
          </div>
        </div>
      </div>
    );
  }
}

export default Welcome;