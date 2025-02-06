import React from 'react';

function DoctorList({ doctors }) {
    return (
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
    );
  }
  
  export default DoctorList;