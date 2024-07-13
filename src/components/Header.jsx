import PropTypes from 'prop-types';
import { MONTHS, CURRENT_MONTH, CURRENT_YEAR } from '../utils/constants';

function Header({ month, year, setMonth, setYear }) {
  const handlePreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleToday = () => {
    setMonth(CURRENT_MONTH);
    setYear(CURRENT_YEAR);
  };

  return (
    <div className="header">
      <button className="button" onClick={handleToday}>
        Today
      </button>
      <h2 className="header_date">
        {MONTHS[month]}, {year}
      </h2>
      <div className="header_button_group">
        <button className="button" onClick={handlePreviousMonth}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <button className="button" onClick={handleNextMonth}>
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}

Header.propTypes = {
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  setMonth: PropTypes.func.isRequired,
  setYear: PropTypes.func.isRequired,
};

export default Header;
