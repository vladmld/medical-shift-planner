export const generateSchedule = (
  doctors,
  currentMonth,
  currentYear,
  getDaysInMonth
) => {
  const schedule = {};

  // Get the number of days in the current month
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  // Initialize schedule for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      '0'
    )}-${String(day).padStart(2, '0')}`;
    schedule[dateString] = [];
  }

  // Calculate target shifts per doctor for even distribution
  const targetShiftsPerDoctor = Math.floor(daysInMonth / doctors.length);
  const extraShifts = daysInMonth % doctors.length;

  // Keep track of assignments and last working days
  const assignedShifts = {};
  const lastWorkingDay = {};
  doctors.forEach((doctor) => {
    assignedShifts[doctor.name] = 0;
    lastWorkingDay[doctor.name] = -1;
  });

  // For each day in the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      '0'
    )}-${String(day).padStart(2, '0')}`;

    // Get eligible doctors who haven't worked the previous day
    let eligibleDoctors = doctors.filter((doctor) => {
      return lastWorkingDay[doctor.name] !== day - 1;
    });

    // Among eligible doctors, prioritize those with fewer shifts
    eligibleDoctors.sort((a, b) => {
      // Calculate max allowed shifts for each doctor
      const maxShiftsA =
        targetShiftsPerDoctor + (extraShifts > doctors.indexOf(a) ? 1 : 0);
      const maxShiftsB =
        targetShiftsPerDoctor + (extraShifts > doctors.indexOf(b) ? 1 : 0);

      // If one doctor has reached their limit but the other hasn't, prioritize the one who hasn't
      if (
        assignedShifts[a.name] >= maxShiftsA &&
        assignedShifts[b.name] < maxShiftsB
      )
        return 1;
      if (
        assignedShifts[b.name] >= maxShiftsB &&
        assignedShifts[a.name] < maxShiftsA
      )
        return -1;

      // Otherwise, prioritize the doctor with fewer shifts
      return assignedShifts[a.name] - assignedShifts[b.name];
    });

    // Select the most eligible doctor
    const selectedDoctor = eligibleDoctors[0];

    if (selectedDoctor) {
      schedule[dateString].push({
        doctor: selectedDoctor,
        shiftType: 'full-time',
      });

      // Update tracking
      lastWorkingDay[selectedDoctor.name] = day;
      assignedShifts[selectedDoctor.name]++;
    }
  }

  return schedule;
};
