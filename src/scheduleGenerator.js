export const generateSchedule = (
  doctors,
  currentMonth,
  currentYear,
  getDaysInMonth
) => {
  const schedule = {};

  // Get the number of days in the current month
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  // Calculate the ideal distribution of shifts
  const targetShiftsPerDoctor = Math.floor(daysInMonth / doctors.length);
  const extraShifts = daysInMonth % doctors.length;

  // Track assignments and rest periods for each doctor
  const assignedShifts = {};
  const lastWorkingDay = {};

  // Initialize tracking objects for each doctor
  doctors.forEach(doctor => {
    assignedShifts[doctor.name] = 0;
    lastWorkingDay[doctor.name] = -1; // -1 indicates no previous shift
  });

  // Initialize the schedule with empty arrays for each day
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    schedule[dateString] = [];
  }

  // Assign shifts for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Find doctors who are eligible to work today:
    // 1. Must not have worked yesterday (consecutive day restriction)
    // 2. Must not have the current day in their unavailable days array
    let eligibleDoctors = doctors.filter(doctor => {
      const hasWorkedYesterday = lastWorkingDay[doctor.name] === day - 1;
      const isUnavailable = doctor.unavailableDays &&
                           doctor.unavailableDays.includes(day);

      return !hasWorkedYesterday && !isUnavailable;
    });

    // Sort eligible doctors by their current workload and assignment limits
    eligibleDoctors.sort((a, b) => {
      // Calculate maximum allowed shifts for each doctor
      const maxShiftsA = targetShiftsPerDoctor + (extraShifts > doctors.indexOf(a) ? 1 : 0);
      const maxShiftsB = targetShiftsPerDoctor + (extraShifts > doctors.indexOf(b) ? 1 : 0);

      // Check if either doctor has reached their shift limit
      const aReachedLimit = assignedShifts[a.name] >= maxShiftsA;
      const bReachedLimit = assignedShifts[b.name] >= maxShiftsB;

      if (aReachedLimit && !bReachedLimit) return 1;
      if (!aReachedLimit && bReachedLimit) return -1;

      // If neither has reached their limit (or both have),
      // prioritize the doctor with fewer shifts
      return assignedShifts[a.name] - assignedShifts[b.name];
    });

    // Assign the most eligible doctor to this day
    const selectedDoctor = eligibleDoctors[0];

    if (selectedDoctor) {
      // Add the assignment to the schedule
      schedule[dateString].push({
        doctor: selectedDoctor
      });

      // Update tracking information
      lastWorkingDay[selectedDoctor.name] = day;
      assignedShifts[selectedDoctor.name]++;
    } else {
      // If no eligible doctors are found, we might want to implement
      // a fallback strategy or raise an alert
      console.warn(`No eligible doctor found for ${dateString}`);
    }
  }

  // For debugging and verification, log the final distribution
  console.log('Final shift distribution:', assignedShifts);

  return schedule;
};