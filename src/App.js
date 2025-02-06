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



  // Reset function
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
      <div>
        <button className='reset-button' onClick={resetAll}>
          Reset All
        </button>
      </div>
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
    </div>
  );
}

export default App;
