import React from 'react';

function Calendar({ currentMonth, currentYear, getDaysInMonth }) {
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
  return (
    <div>
      <h2>Calendar</h2>
      <div className="calendar-grid">
        {/* Days of the week headings (Monday first) */}
        <div className="day-header">Mon</div>
        <div className="day-header">Tue</div>
        <div className="day-header">Wed</div>
        <div className="day-header">Thu</div>
        <div className="day-header">Fri</div>
        <div className="day-header">Sat</div>
        <div className="day-header">Sun</div>

        {/* Generate calendar days */}
        {generateCalendarDays(currentMonth, currentYear).map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${day.isCurrentMonth ? '' : 'other-month'}`}
          >
            {day.day}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;