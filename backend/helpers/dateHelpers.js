/**
 * Helpers per la gestione delle date
 */

/**
 * Verifica se una data è un weekend o un giorno festivo
 * @param {Date} date - La data da verificare
 * @returns {boolean} - True se è weekend o festivo, false altrimenti
 */
const isWeekendOrHoliday = (date) => {
  const day = date.getDay();
  
  // 0 = domenica, 6 = sabato
  if (day === 0 || day === 6) {
    return true;
  }
  
  // Elenco delle festività italiane (esempio)
  const holidays = [
    '01-01', // Capodanno
    '01-06', // Epifania
    '04-25', // Festa della Liberazione
    '05-01', // Festa del Lavoro
    '06-02', // Festa della Repubblica
    '08-15', // Ferragosto
    '11-01', // Tutti i Santi
    '12-08', // Immacolata Concezione
    '12-25', // Natale
    '12-26', // Santo Stefano
  ];
  
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dayOfMonth = String(date.getDate()).padStart(2, '0');
  const dateString = `${month}-${dayOfMonth}`;
  
  return holidays.includes(dateString);
};

/**
 * Calcola la data di scadenza di un abbonamento
 * @param {Date} startDate - Data di inizio abbonamento
 * @param {string} membershipType - Tipo di abbonamento (premium1, premium3, ecc.)
 * @returns {Date} - Data di scadenza
 */
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
      // Per abbonamenti basic o admin, non c'è scadenza
      return null;
  }
  
  return expiryDate;
};

/**
 * Verifica se un abbonamento è scaduto
 * @param {Date} startDate - Data di inizio abbonamento
 * @param {string} membershipType - Tipo di abbonamento
 * @returns {boolean} - True se l'abbonamento è scaduto, false altrimenti
 */
const isMembershipExpired = (startDate, membershipType) => {
  const expiryDate = calculateExpiryDate(startDate, membershipType);
  
  // Se non c'è data di scadenza (basic o admin), l'abbonamento non scade
  if (!expiryDate) return false;
  
  const today = new Date();
  return today > expiryDate;
};

module.exports = {
  isWeekendOrHoliday,
  calculateExpiryDate,
  isMembershipExpired
};