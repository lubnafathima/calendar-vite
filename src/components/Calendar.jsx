import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  DAY_OF_THE_WEEK,
  CURRENT_DATE,
  CURRENT_MONTH,
  CURRENT_YEAR,
} from "../utils/constants";

export default function Calendar({ month, year }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const getLastDate = (monthValue, yearValue) =>
    new Date(yearValue, monthValue + 1, 0).getDate();

  const firstDateOfAMonth = 1;
  const lastDateOfMonth = getLastDate(month, year);
  const firstDayOfAMonth = new Date(year, month, firstDateOfAMonth).getDay();

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const closePopup = () => {
    setSelectedDate(null);
  };

  const days = Array.from({ length: firstDayOfAMonth }, (_, i) => (
    <div key={`empty-${i}`} className="calendar_day empty"></div>
  )).concat(
    Array.from({ length: lastDateOfMonth }, (_, day) => {
      const date = day + 1;
      const isToday = date === CURRENT_DATE && month === CURRENT_MONTH && year === CURRENT_YEAR;
      return (
        <div
          key={date}
          className={`calendar_day ${isToday ? "today" : ""}`}
          onClick={() => handleDateClick(date)}
        >
          {date}
        </div>
      );
    })
  );

  return (
    <div className="calendar-container">
      <div className="calendar">
        <div className="calendar_header">
          {DAY_OF_THE_WEEK.map((day, index) => (
            <p key={index} className="day_of_week">
              {day}
            </p>
          ))}
        </div>
        <div className="calendar_main">{days}</div>
      </div>
      {selectedDate !== null && (
        <div className="popup">
          <div className="popup_content">
            <button onClick={closePopup} className="close-popup">
              Close
            </button>
            <h3>{`${selectedDate}/${month + 1}/${year}`}</h3>
            <input type="text" placeholder="Your input" />
            <button>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
}

Calendar.propTypes = {
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
};
