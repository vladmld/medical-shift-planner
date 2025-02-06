import React, { useState } from 'react';

function DoctorForm({
  onAddDoctor,
  currentMonth,
  currentYear,
  getDaysInMonth,
}) {
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    type: 'full-time',
    unavailableDays: [],
  });
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'unavailableDays') {
      setInputValue(value); // Keep the input value for display

      if (!value.trim()) {
        setNewDoctor({ ...newDoctor, unavailableDays: [] });
        return;
      }

      // Split, clean and validate days
      const daysArray = value
        .split(',')
        .map((day) => day.trim())
        .filter((day) => {
          const dayNum = parseInt(day, 10);
          const daysInMonth = getDaysInMonth(currentMonth, currentYear);
          return (
            !isNaN(dayNum) &&
            Number.isInteger(dayNum) &&
            dayNum >= 1 &&
            dayNum <= daysInMonth
          );
        })
        .map((day) => parseInt(day, 10)); // Convert to numbers

      // Remove duplicates
      const uniqueDays = [...new Set(daysArray)];

      // Sort days for better display
      uniqueDays.sort((a, b) => a - b);

      setNewDoctor({ ...newDoctor, unavailableDays: uniqueDays });
    } else {
      setNewDoctor({ ...newDoctor, [name]: value });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    if (newDoctor.name.trim() === '') {
      alert('Please enter a doctor name.');
      return;
    }
    onAddDoctor(newDoctor);
    setNewDoctor({ name: '', type: 'full-time', unavailableDays: [] });
  };

  return (
    <div>
      <h2>Add Doctor</h2>
      <form onSubmit={handleSubmit}>
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
        <input
          type='text'
          name='unavailableDays'
          value={inputValue}
          onChange={handleInputChange}
          placeholder='Enter days (e.g., 1,15 ,30)'
        />
        <button type='submit'>Add Doctor</button>
      </form>
    </div>
  );
}

export default DoctorForm;
