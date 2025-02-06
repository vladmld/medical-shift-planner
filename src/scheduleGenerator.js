// src/scheduleGenerator.js

export const generateSchedule = (doctors, currentMonth, currentYear, getDaysInMonth) => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const schedule = {};

    const fullTimeDoctors = doctors.filter(doctor => doctor.type === 'full-time');
    const partTimeDoctors = doctors.filter(doctor => doctor.type === 'part-time');

    let fullTimeIndex = 0;
    let partTimeIndex = 0;

    for (let day = 1; day <= daysInMonth; day++) {
        const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const isDayUnavailable = doctors.some(doctor =>
            doctor.unavailableDays.includes(day.toString())
        );

        if (isDayUnavailable) {
            schedule[dateString] = null;
            continue;
        }

        if (partTimeDoctors.length > 0) {
            let partTimeDoctor = partTimeDoctors[partTimeIndex % partTimeDoctors.length];
            let attempts = 0;
            while (partTimeDoctor.unavailableDays.includes(day.toString()) && attempts < partTimeDoctors.length) {
                partTimeIndex = (partTimeIndex + 1);
                partTimeDoctor = partTimeDoctors[partTimeIndex % partTimeDoctors.length];
                attempts++;
            }
            if (!partTimeDoctor.unavailableDays.includes(day.toString())) {
                schedule[dateString] = { doctor: partTimeDoctor, shiftType: 'part-time' };
                partTimeIndex = (partTimeIndex + 1);
                continue;
            }
        }

        if (fullTimeDoctors.length > 0) {
            let fullTimeDoctor = fullTimeDoctors[fullTimeIndex % fullTimeDoctors.length];
            let attempts = 0;
            while (fullTimeDoctor.unavailableDays.includes(day.toString()) && attempts < fullTimeDoctors.length) {
                fullTimeIndex = (fullTimeIndex + 1);
                fullTimeDoctor = fullTimeDoctors[fullTimeIndex % fullTimeDoctors.length];
                attempts++;
            }
            if (!fullTimeDoctor.unavailableDays.includes(day.toString())) {
                schedule[dateString] = { doctor: fullTimeDoctor, shiftType: 'full-time' };
                fullTimeIndex = (fullTimeIndex + 1);
            } else {
                schedule[dateString] = null;
            }
        } else {
            schedule[dateString] = null;
        }
    }

    return schedule;
};