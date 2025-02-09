import React from 'react';

function DoctorList({ doctors }) {
  return (
    <div>
      <h2>Doctors</h2>
      <ul>
        {doctors.map((doctor, index) => (
          <li key={index}>
            {doctor.name} ({doctor.type})
            {doctor.unavailableDays.length > 0 && (
              <> - Unavailable: {doctor.unavailableDays.join(', ')}</>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DoctorList;
