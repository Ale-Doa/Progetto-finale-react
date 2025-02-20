const { DateTime } = require('luxon');

const fixedHolidays = [
  { month: 1, day: 1 },
  { month: 1, day: 6 },
  { month: 4, day: 25 },
  { month: 5, day: 1 },
  { month: 6, day: 2 },
  { month: 8, day: 15 },
  { month: 11, day: 1 },
  { month: 12, day: 8 },
  { month: 12, day: 25 },
  { month: 12, day: 26 },
];

function calculateEaster(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor(a + 11 * h + 22 * l) / 451;
  const easterMonth = Math.floor((h + l - 7 * m + 114) / 31);
  const easterDay = ((h + l - 7 * m + 114) % 31) + 1;
  return DateTime.local(year, easterMonth, easterDay);
}

function getHolidaysForYear(year) {
  const holidays = [];
  fixedHolidays.forEach(({ month, day }) => {
    holidays.push(DateTime.local(year, month, day));
  });

  const easter = calculateEaster(year);
  holidays.push(easter); // Pasqua
  holidays.push(easter.plus({ days: 1 })); // Lunedì dell'Angelo

  return holidays;
}

function isHoliday(date) {
  const year = date.year;
  const holidays = getHolidaysForYear(year);
  const normalizedDate = DateTime.fromJSDate(date).startOf('day');
  return holidays.some((holiday) => holiday.startOf('day').equals(normalizedDate));
}

module.exports = { isHoliday };