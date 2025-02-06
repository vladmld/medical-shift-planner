import React, { useState, useEffect } from 'react';

function Calendar({
  currentMonth,
  currentYear,
  getDaysInMonth,
  doctors,
  schedule,
}) {
  const [calendarDays, setCalendarDays] = useState([]);
  const generateCalendarDays = (month, year) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDayOfMonth = new Date(year, month, 1);
    let startingDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

    // Adjust startingDayOfWeek to make Monday the first day (1)
    startingDayOfWeek = (startingDayOfWeek + 6) % 7;

    const calendarDays = [];

    // Add days from the *previous* month
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevMonth, prevMonthYear);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      calendarDays.push({
        day: daysInPrevMonth - i,
        month: prevMonth,
        year: prevMonthYear,
        isCurrentMonth: false,
        doctor: null,
      });
    }

    // Add days from the *current* month
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({
        day: i,
        month: month,
        year: year,
        isCurrentMonth: true,
        doctor: null,
      });
    }

    // Add days from the *next* month
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    let nextMonthDay = 1;
    while (calendarDays.length < 42) {
      calendarDays.push({
        day: nextMonthDay,
        month: nextMonth,
        year: nextMonthYear,
        isCurrentMonth: false,
        doctor: null,
      });
      nextMonthDay++;
    }

    return calendarDays;
  };

  useEffect(() => {
    setCalendarDays(generateCalendarDays(currentMonth, currentYear));
  }, [currentMonth, currentYear, getDaysInMonth]);

  return (
    <div>
      <h2>Calendar</h2>
      <div className='calendar-grid'>
        <div className='day-header'>Mon</div>
        <div className='day-header'>Tue</div>
        <div className='day-header'>Wed</div>
        <div className='day-header'>Thu</div>
        <div className='day-header'>Fri</div>
        <div className='day-header'>Sat</div>
        <div className='day-header'>Sun</div>

        {calendarDays.map((day, index) => {
          const dateString = `${day.year}-${String(day.month + 1).padStart(
            2,
            '0'
          )}-${String(day.day).padStart(2, '0')}`;
          const scheduleEntry = schedule ? schedule[dateString] : null;

          // Check for unavailable doctors *only if doctors is defined*
          const isUnavailable = doctors
            ? doctors.some(
                (doctor) =>
                  doctor.unavailableDays.includes(day.day.toString()) &&
                  day.isCurrentMonth
              )
            : false;

          return (
            <div
              key={index}
              className={`calendar-day ${
                day.isCurrentMonth ? '' : 'other-month'
              } ${isUnavailable ? 'unavailable' : ''}`}
            >
              <div className='day-number'>{day.day}</div>
              {scheduleEntry && scheduleEntry.doctor && (
                <div className={`shift ${scheduleEntry.shiftType}`}>
                  {scheduleEntry.doctor.name}
                </div>
              )}
              {/* Show "Unavailable" only if the day is unavailable AND there's no scheduled doctor */}
              {isUnavailable && !scheduleEntry && (
                <div className='shift'>Unavailable</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
