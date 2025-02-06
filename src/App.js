import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';

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

  const [newDoctor, setNewDoctor] = useState({
    name: '',
    type: 'full-time',
    unavailableDays: [],
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewDoctor({ ...newDoctor, [name]: value });
  };

  const addDoctor = () => {
    if (newDoctor.name.trim() === '') {
      alert('Please enter a doctor name.');
      return;
    }

    setDoctors([...doctors, newDoctor]);

    setNewDoctor({ name: '', type: 'full-time', unavailableDays: [] });
  };

  const resetAll = () => {
    setDoctors([]);
    setSchedule({});

    setCurrentMonth(getNextMonthAndYear().month);
    setCurrentYear(getNextMonthAndYear().year);
  };

  const generateCalendarDays = (month, year) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDayOfMonth = new Date(year, month, 1); // Get the first day of the month
    let startingDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

    // Adjust startingDayOfWeek to make Monday the first day (1)
    startingDayOfWeek = (startingDayOfWeek + 6) % 7;
    const calendarDays = [];

    // Add days from the *previous* month to fill the first week
    const prevMonth = month === 0 ? 11 : month - 1; // Handle January (month 0)
    const prevMonthYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevMonth, prevMonthYear);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      calendarDays.push({
        day: daysInPrevMonth - i,
        month: prevMonth,
        year: prevMonthYear,
        isCurrentMonth: false,
        doctor: null, // Placeholder for the assigned doctor
      });
    }

    // Add days from the *current* month
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({
        day: i,
        month: month,
        year: year,
        isCurrentMonth: true,
        doctor: null, // Placeholder for the assigned doctor
      });
    }

    // Add days from the *next* month to fill the last week(s)
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    let nextMonthDay = 1;
    while (calendarDays.length < 42) {
      // Ensure we have 6 weeks (42 days)
      calendarDays.push({
        day: nextMonthDay,
        month: nextMonth,
        year: nextMonthYear,
        isCurrentMonth: false,
        doctor: null, // Placeholder for the assigned doctor
      });
      nextMonthDay++;
    }

    return calendarDays;
  };

  return (
    <div className='app'>
      <h1>Doctor Shift Scheduler</h1>
      <p>
        Displaying schedule for {currentMonth + 1}/{currentYear}
      </p>

      <div>
        <h2>Add Doctor</h2>
        <input
          type='text'
          name='name'
          placeholder='Doctor Name'
          value={newDoctor.name}
          onChange={handleInputChange}
        />
        <select name='type' value={newDoctor.type} onChange={handleInputChange}>
          <option value='full-time'>Full-time</option>
          <option value='part-time'>Part-time</option>
        </select>
        <button onClick={addDoctor}>Add Doctor</button>
      </div>

      <div>
        <h2>Doctors</h2>
        <ul>
          {doctors.map((doctor, index) => (
            <li key={index}>
              {doctor.name} ({doctor.type})
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Calendar</h2>
        <div className="calendar-grid">
          {/* Days of the week headings */}

          <div className="day-header">Mon</div>
          <div className="day-header">Tue</div>
          <div className="day-header">Wed</div>
          <div className="day-header">Thu</div>
          <div className="day-header">Fri</div>
          <div className="day-header">Sat</div>
          <div className="day-header">Sun</div>

          {/* Generate calendar days */}
          {generateCalendarDays(currentMonth, currentYear).map((day, index) => (
            <div
              key={index}
              className={`calendar-day ${day.isCurrentMonth ? '' : 'other-month'}`}
            >
              {day.day}
              {/* We'll add doctor display here later */}
            </div>
          ))}
        </div>
      </div>
      <div>
        <button className='reset-button' onClick={resetAll}>
          Reset All
        </button>
      </div>
    </div>
  );
}

export default App;
