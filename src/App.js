import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
import DoctorForm from './components/DoctorForm';
import DoctorList from './components/DoctorList';
import Calendar from './components/Calendar';

function App() {
  const [doctors, setDoctors] = useState([]);

  const getNextMonthAndYear = () => {
    const now = new Date();
    let nextMonth = now.getMonth() + 1;
    let nextYear = now.getFullYear();

    if (nextMonth > 11) {
      // If nextMonth is December (11), we roll over to January
      nextMonth = 0; // January
      nextYear += 1; // Increment the year
    }
    return { month: nextMonth, year: nextYear };
  };

  const [currentMonth, setCurrentMonth] = useState(getNextMonthAndYear().month);
  const [currentYear, setCurrentYear] = useState(getNextMonthAndYear().year);
  const [schedule, setSchedule] = useState({});

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const addDoctor = (newDoctor) => {
    setDoctors([...doctors, newDoctor]);
  };

  const resetAll = () => {
    setDoctors([]);
    setSchedule({});
    setCurrentMonth(getNextMonthAndYear().month);
    setCurrentYear(getNextMonthAndYear().year);
  };

  return (
    <div className='app'>
      <h1>Doctor Shift Scheduler</h1>
      <p>
        Displaying schedule for {currentMonth + 1}/{currentYear}
      </p>

      <DoctorForm onAddDoctor={addDoctor} currentMonth={currentMonth} currentYear={currentYear} getDaysInMonth={getDaysInMonth}/>
      
      <DoctorList doctors={doctors} />
      <Calendar currentMonth={currentMonth} currentYear={currentYear} getDaysInMonth={getDaysInMonth}/>
      
      <div>
        <button className='reset-button' onClick={resetAll}>
          Reset All
        </button>
      </div>
    </div>
  );
}

export default App;
