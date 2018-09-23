import React from 'react';

const GoBackTitle = ({ title, history }) => {
  if (!history) {
    return <h1>{ title }</h1>
  }

  return (
    <h1>
      <small
        className="color-red cur-pointer glyphicon glyphicon-menu-left "
        onClick={ history.goBack }
      />
      <span>&nbsp;</span>
      <span>{ title }</span>
    </h1>
  )
};

export default GoBackTitle;
