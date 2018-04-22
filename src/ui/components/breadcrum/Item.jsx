import React from 'react';
import PropTypes from 'prop-types';

class Item extends React.Component {

  render() {
    return <li className={'breadcrumb-item'}>{ this.props.text }</li>;
  }
}

Item.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Item;
