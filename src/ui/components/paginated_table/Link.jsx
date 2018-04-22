import React from 'react';
import PropTypes from 'prop-types';

const Link = ({ targetPage, currentPage, navCallback }) => {
  const navigateToPage = () => {
    navCallback(targetPage);
  };

  const content = () => {
    if (targetPage === currentPage) {
      return <span>{ currentPage }</span>;
    }

    return (
      <a onClick={navigateToPage}>
        <span>{targetPage}</span>
      </a>
    );
  };

  return (
    <li className={targetPage === currentPage ? 'active' : 'cur-pointer'}>
      {content()}
    </li>
  );
};

Link.propTypes = {
  targetPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  navCallback: PropTypes.func.isRequired,
};

export default Link;
