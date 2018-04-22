import React from 'react';
import PropTypes from 'prop-types';
import Item from './Item';

class Breadcrumbs extends React.Component {

  render() {
    return (
      <ol className={'breadcrumb'}>
        {this.props.items.map(item => <Item text={item.text} key={item.text} />)}
      </ol>
    );
  }
}

Breadcrumbs.PropTypes = {
  items: PropTypes.array.isRequired,
};

export default Breadcrumbs;
