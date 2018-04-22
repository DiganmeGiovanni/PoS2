import React from 'react';
import moment from "moment";
import "moment/locale/es";

const MonthYearForm = ({ date, localeUtils, onChange }) => {

  const months = moment.months('es');
  const years = [];

  const currYear = new Date().getFullYear();
  years.push(currYear - 1);
  years.push(currYear);
  years.push(currYear + 1);

  const handleChange = (e) => {
    const { year, month } = e.target.form;
    onChange(new Date(year.value, month.value));
  };

  console.log('Rendering month year form');
  return (
    <form className="DayPicker-Caption">
      <div className="select-container">
        <select name="month" onChange={ handleChange } value={ date.getMonth() }>
          { months.map((month, i) => (
            <option key={ month } value={ i }>
              { `${ month.charAt(0).toUpperCase() }${ month.slice(1) }` }
            </option>
          ))}
        </select>

        <span className="glyphicon glyphicon-triangle-bottom"/>
      </div>
      <div className="select-container">
        <select name="year" onChange={ handleChange } value={ date.getFullYear() }>
          { years.map((year, i) => (
            <option key={ year } value={ year }>
              { year }
            </option>
          ))}
        </select>

        <span className="glyphicon glyphicon-triangle-bottom"/>
      </div>
    </form>
  )
};

export default MonthYearForm;
