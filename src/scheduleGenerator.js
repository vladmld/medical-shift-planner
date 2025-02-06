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

  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      '0'
    )}-${String(day).padStart(2, '0')}`;

    const isDayUnavailable = doctors.some((doctor) =>
      doctor.unavailableDays.includes(day.toString())
    );

    if (isDayUnavailable) {
      schedule[dateString] = null; // Keep this for days with NO available doctors
      continue;
    }

    schedule[dateString] = []; // Initialize as an array to hold multiple doctors

    // Assign Part-Time Doctor (if available)
    if (partTimeDoctors.length > 0) {
      let partTimeDoctor =
        partTimeDoctors[partTimeIndex % partTimeDoctors.length];
      let attempts = 0;
      while (
        partTimeDoctor.unavailableDays.includes(day.toString()) &&
        attempts < partTimeDoctors.length
      ) {
        partTimeIndex = partTimeIndex + 1;
        partTimeDoctor =
          partTimeDoctors[partTimeIndex % partTimeDoctors.length];
        attempts++;
      }
      if (!partTimeDoctor.unavailableDays.includes(day.toString())) {
        schedule[dateString].push({
          doctor: partTimeDoctor,
          shiftType: 'part-time',
        });
        partTimeIndex = partTimeIndex + 1;
      }
    }
    // Assign Full-Time Doctor (if available, and always if a part-time doctor is scheduled)

    if (fullTimeDoctors.length > 0) {
      let fullTimeDoctor =
        fullTimeDoctors[fullTimeIndex % fullTimeDoctors.length];
      let attempts = 0;
      while (
        fullTimeDoctor.unavailableDays.includes(day.toString()) &&
        attempts < fullTimeDoctors.length
      ) {
        fullTimeIndex = fullTimeIndex + 1;
        fullTimeDoctor =
          fullTimeDoctors[fullTimeIndex % fullTimeDoctors.length];
        attempts++;
      }

      if (!fullTimeDoctor.unavailableDays.includes(day.toString())) {
        schedule[dateString].push({
          doctor: fullTimeDoctor,
          shiftType: 'full-time',
        });
        fullTimeIndex = fullTimeIndex + 1;
      }
    }
    //check if there isn't any doctor available
    if (schedule[dateString].length === 0) {
      schedule[dateString] = null;
    }
  }

  return schedule;
};
