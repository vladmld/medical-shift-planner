import React, { useState } from 'react';

function DoctorForm({ onAddDoctor }) {
    const [newDoctor, setNewDoctor] = useState({
      name: '',
      type: 'full-time',
      unavailableDays: [],
    });
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setNewDoctor({ ...newDoctor, [name]: value });
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
            type="text"
            name="name"
            placeholder="Doctor Name"
            value={newDoctor.name}
            onChange={handleInputChange}
          />
          <select
            name="type"
            value={newDoctor.type}
            onChange={handleInputChange}
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
          </select>
          <button type="submit">Add Doctor</button>
        </form>
      </div>
    );
  }
  
  export default DoctorForm;