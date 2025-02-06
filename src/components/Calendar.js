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
    let startingDayOfWeek = firstDayOfMonth.getDay();
    startingDayOfWeek = (startingDayOfWeek + 6) % 7;

    const calendarDays = [];

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

    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({
        day: i,
        month: month,
        year: year,
        isCurrentMonth: true,
        doctor: null,
      });
    }

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

          return (
            <div
              key={index}
              className={`calendar-day ${
                day.isCurrentMonth ? '' : 'other-month'
              }`}
            >
              <div className='day-number'>{day.day}</div>

              {scheduleEntry &&
                Array.isArray(scheduleEntry) &&
                scheduleEntry.map(
                  (entry, entryIndex) =>
                    entry.doctor && (
                      <div
                        key={entryIndex}
                        className={`shift ${entry.shiftType}`}
                      >
                        {entry.doctor.name}
                      </div>
                    )
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
