/**
 * Helpers per la validazione dei dati
 */

/**
 * Valida un indirizzo email
 * @param {string} email - L'email da validare
 * @returns {boolean} - True se l'email è valida, false altrimenti
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Verifica se una password rispetta i requisiti minimi di sicurezza
 * @param {string} password - La password da verificare
 * @returns {boolean} - True se la password è valida, false altrimenti
 */
const isStrongPassword = (password) => {
  // Almeno 8 caratteri, una lettera maiuscola, una minuscola e un numero
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Verifica se un time slot è valido
 * @param {string} timeSlot - Il time slot da verificare
 * @param {Array} validTimeSlots - Array di time slot validi
 * @returns {boolean} - True se il time slot è valido, false altrimenti
 */
const isValidTimeSlot = (timeSlot, validTimeSlots) => {
  return validTimeSlots.includes(timeSlot);
};

module.exports = {
  isValidEmail,
  isStrongPassword,
  isValidTimeSlot
};