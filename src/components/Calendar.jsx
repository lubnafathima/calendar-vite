import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import {
  DAY_OF_THE_WEEK,
  CURRENT_DATE,
  CURRENT_MONTH,
  CURRENT_YEAR,
} from "../utils/constants";
import { IoMdClose } from "react-icons/io";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function Calendar({ month, year }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState({});
  const [taskInput, setTaskInput] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "test"), (snapshot) => {
      const taskData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const groupedTasks = taskData.reduce((acc, task) => {
        const dateKey = task.date;
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(task.task);
        return acc;
      }, {});
      setTasks(groupedTasks);
    });

    return () => unsubscribe();
  }, []);

  const handleTaskSubmit = async () => {
    if (taskInput && selectedDate) {
      const taskDate = `${selectedDate}-${month + 1}-${year}`;
      try {
        await addDoc(collection(db, "test"), {
          task: taskInput,
          date: taskDate,
        });
        setTaskInput("");
        setSelectedDate(null);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  const getDayTasks = (date) => tasks[`${date}-${month + 1}-${year}`] || [];

  const getLastDate = (monthValue, yearValue) =>
    new Date(yearValue, monthValue + 1, 0).getDate();

  const firstDateOfAMonth = 1;
  const lastDateOfMonth = getLastDate(month, year);
  const firstDayOfAMonth = new Date(year, month, firstDateOfAMonth).getDay();

  const handleClick = (date) => setSelectedDate(date);

  const closeTask = () => {
    setSelectedDate(null);
    setTaskInput("");
  };

  const days = Array.from({ length: firstDayOfAMonth }, (_, i) => (
    <div key={`empty-${i}`} className="calendar_day empty"></div>
  )).concat(
    Array.from({ length: lastDateOfMonth }, (_, day) => {
      const date = day + 1;
      const isToday =
        date === CURRENT_DATE &&
        month === CURRENT_MONTH &&
        year === CURRENT_YEAR;
      const taskList = getDayTasks(date);
      return (
        <div
          key={date}
          className={`calendar_day ${isToday ? "today" : ""}`}
          onClick={() => handleClick(date)}
        >
          <p className="calendar_date">
            <span>{date}</span>
          </p>
          {taskList.length > 0 && (
            <div className="task_display">
              {taskList[0]}
              {taskList.length > 1 && <p className="view_more">View more</p>}
            </div>
          )}
        </div>
      );
    })
  );

  return (
    <div className="calendar_container">
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
        <div className="task">
          <div className="task_content">
            <button onClick={closeTask} className="close_task">
              <IoMdClose />
            </button>
            <h3 className="task_date">
              <FaRegCalendarAlt /> {`${selectedDate}/${month + 1}/${year}`}
            </h3>
            {getDayTasks(selectedDate).length > 0 ? (
              getDayTasks(selectedDate).map((task, index) => (
                <p key={index} className="task_full_text">
                  {task}
                </p>
              ))
            ) : (
              <p className="no_task_text">No task added</p>
            )}
          </div>
          <div className="task_form">
            <input
              type="text"
              placeholder="Add task"
              className="task_input"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
            />
            <button className="task_submit button" onClick={handleTaskSubmit}>
              Submit
            </button>
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
