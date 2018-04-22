import React from 'react';
import PropTypes from 'prop-types';
import Link from './Link';

const Paginator = ({ activePage, totalPages, navCallback }) => {
  const navBack = () => {
    navCallback(activePage - 1);
  };

  const navForward = () => {
    navCallback(activePage + 1);
  };

  const prevButtons = () => {
    const buttons = [];
    if (activePage >= 3) {
      buttons.push(
        <Link
          key={'link_n1'}
          currentPage={activePage}
          targetPage={activePage - 2}
          navCallback={navCallback}
        />,
      );
    }
    if (activePage >= 2) {
      buttons.push(
        <Link
          key={'link_n2'}
          currentPage={activePage}
          targetPage={activePage - 1}
          navCallback={navCallback}
        />,
      );
    }

    return buttons;
  };

  const backButton = () => {
    if (activePage === 1) {
      return (
        <li className={'disabled'}><span>&laquo;</span></li>
      );
    }

    return (
      <li className={'cur-pointer'}>
        <a onClick={navBack}>
          <span>&laquo;</span>
        </a>
      </li>
    );
  };

  const nextButtons = () => {
    const leftPages = totalPages - activePage;
    const buttons = [];

    if (leftPages >= 1) {
      buttons.push(
        <Link
          key={'link_p1'}
          currentPage={activePage}
          targetPage={activePage + 1}
          navCallback={navCallback}
        />,
      );
    }

    if (leftPages >= 2) {
      buttons.push(
        <Link
          key={'link_p2'}
          currentPage={activePage}
          targetPage={activePage + 2}
          navCallback={navCallback}
        />,
      );
    }

    return buttons;
  };

  const forwardButton = () => {
    if (activePage === totalPages) {
      return (
        <li className={'disabled'}>
          <span>&raquo;</span>
        </li>
      );
    }

    return (
      <li className={'cur-pointer'}>
        <a onClick={navForward}>
          <span>&raquo;</span>
        </a>
      </li>
    );
  };

  if (totalPages > 1) {
    return (
      <nav>
        <ul className="pagination">
          {backButton()}
          {prevButtons()}
          <li className={'active'}>
            <span>{activePage}</span>
          </li>
          {nextButtons()}
          {forwardButton()}
        </ul>
      </nav>
    );
  }

  return null;
};

Paginator.propTypes = {
  activePage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  navCallback: PropTypes.func.isRequired,
};

export default Paginator;
