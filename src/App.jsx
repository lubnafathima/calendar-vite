import { useState } from "react";
import Header from "./components/Header";
import Calendar from "./components/Calendar";
import "./App.css";
import { CURRENT_MONTH, CURRENT_YEAR } from "./utils/constants";

function App() {
  const [month, setMonth] = useState(CURRENT_MONTH);
  const [year, setYear] = useState(CURRENT_YEAR);

  return (
    <div className="app">
      <Header month={month} setMonth={setMonth} year={year} setYear={setYear} />
      <Calendar month={month} year={year} />
    </div>
  );
}

export default App;
