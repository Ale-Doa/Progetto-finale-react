const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isStrongPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

const isValidTimeSlot = (timeSlot, validTimeSlots) => {
  return validTimeSlots.includes(timeSlot);
};

module.exports = {
  isValidEmail,
  isStrongPassword,
  isValidTimeSlot
};