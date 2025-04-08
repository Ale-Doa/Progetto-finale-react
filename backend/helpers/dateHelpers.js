const isWeekendOrHoliday = (date) => {
  const day = date.getDay();
  
  if (day === 0 || day === 6) {
    return true;
  }
  
  const holidays = [
    '01-01',
    '01-06',
    '04-25',
    '05-01',
    '06-02',
    '08-15',
    '11-01',
    '12-08',
    '12-25',
    '12-26',
  ];
  
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dayOfMonth = String(date.getDate()).padStart(2, '0');
  const dateString = `${month}-${dayOfMonth}`;
  
  return holidays.includes(dateString);
};

const calculateExpiryDate = (startDate, membershipType) => {
  const expiryDate = new Date(startDate);
  
  switch (membershipType) {
    case 'premium1':
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      break;
    case 'premium3':
      expiryDate.setMonth(expiryDate.getMonth() + 3);
      break;
    case 'premium6':
      expiryDate.setMonth(expiryDate.getMonth() + 6);
      break;
    case 'premium12':
      expiryDate.setMonth(expiryDate.getMonth() + 12);
      break;
    default:
      return null;
  }
  
  return expiryDate;
};

const isMembershipExpired = (startDate, membershipType) => {
  const expiryDate = calculateExpiryDate(startDate, membershipType);
  
  if (!expiryDate) return false;
  
  const today = new Date();
  return today > expiryDate;
};

module.exports = {
  isWeekendOrHoliday,
  calculateExpiryDate,
  isMembershipExpired
};