export const generateSchedule = (
  doctors,
  currentMonth,
  currentYear,
  getDaysInMonth
) => {

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const schedule = {};

  const fullTimeDoctors = doctors.filter(
    (doctor) => doctor.type === 'full-time'
  );

  const partTimeDoctors = doctors.filter(
    (doctor) => doctor.type === 'part-time'
  );

  let fullTimeIndex = 0;
  let partTimeIndex = 0;

  const formatDate = (day) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      '0'
    )}-${String(day).padStart(2, '0')}`;
  };

  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = formatDate(day);
    schedule[dateString] = [];

    // Function to find an available doctor
    const findAvailableDoctor = (doctors, doctorIndex) => {
      let attempts = 0;
      let currentDoctor = doctors[doctorIndex % doctors.length];
      let initialIndex = doctorIndex;

      do {
        if (!currentDoctor.unavailableDays.includes(day)) {
          return {
            doctor: currentDoctor,
            newIndex: (doctorIndex + 1) % doctors.length,
          }; // Return the new index
        }
        doctorIndex++;
        currentDoctor = doctors[doctorIndex % doctors.length];
        attempts++;
      } while (
        attempts < doctors.length &&
        initialIndex !== doctorIndex % doctors.length
      );

      return { doctor: null, newIndex: doctorIndex }; // No doctor found
    };

    // 1. Assign Full-Time Doctor (if available)
    if (fullTimeDoctors.length > 0) {
      const { doctor: fullTimeDoctor, newIndex } = findAvailableDoctor(
        fullTimeDoctors,
        fullTimeIndex
      );
      fullTimeIndex = newIndex;
      if (fullTimeDoctor) {
        schedule[dateString].push({
          doctor: fullTimeDoctor,
          shiftType: 'full-time',
        });
      }
    }

    // 2. Assign Part-Time Doctor (if available)
    if (partTimeDoctors.length > 0) {
      const { doctor: partTimeDoctor, newIndex } = findAvailableDoctor(
        partTimeDoctors,
        partTimeIndex
      );
      partTimeIndex = newIndex;

      if (partTimeDoctor) {
        schedule[dateString].push({
          doctor: partTimeDoctor,
          shiftType: 'part-time',
        });
      }
    }

    // 3. If no doctors are available, set to null
    if (schedule[dateString].length === 0) {
      schedule[dateString] = null;
    }
  }

  return schedule;
};
