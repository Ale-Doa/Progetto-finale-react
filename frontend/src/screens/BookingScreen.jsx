import { useState, useEffect } from 'react';
import { createBooking, getUserBookings, deleteBooking, getBookingsByDate } from '../services/api';

const BookingScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const MAX_BOOKINGS_PER_SLOT = 15;

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    setLoading(true);
    try {
      const data = await getUserBookings();
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Impossibile recuperare le prenotazioni');
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!date) {
      setError('Seleziona una data');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const data = await getBookingsByDate(date);
      setAvailableSlots(data);
      setTimeSlot(''); 
    } catch (err) {
      setError(err.response?.data?.message || 'Impossibile verificare la disponibilità');
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!date || !timeSlot) {
      setError('Seleziona sia la data che la fascia oraria');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await createBooking({ date, timeSlot });
      setSuccess('Prenotazione creata con successo!');
      fetchUserBookings();
      setDate('');
      setTimeSlot('');
      setAvailableSlots([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Impossibile creare la prenotazione');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Sei sicuro di voler cancellare questa prenotazione?')) {
      setLoading(true);
      setError('');
      setSuccess('');
      
      try {
        await deleteBooking(id);
        setSuccess('Prenotazione cancellata con successo!');
        fetchUserBookings();
      } catch (err) {
        console.error('Errore durante la cancellazione della prenotazione:', err);
        setError(err.response?.data?.message || 'Impossibile cancellare la prenotazione');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('it-IT', options);
  };

  return (
    <div className="booking-screen">
      <h1>Prenotazioni Palestra</h1>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      <div className="booking-form">
        <h2>Effettua una Nuova Prenotazione</h2>
        <form onSubmit={handleBooking}>
          <div className="form-group">
            <label htmlFor="date">Data</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]}
              required
            />
          </div>
          
          <button type="button" onClick={checkAvailability} disabled={loading || !date}>
            Verifica Disponibilità
          </button>
          
          {availableSlots.length > 0 && (
            <>
              <div className="form-group">
                <label htmlFor="timeSlot">Fascia Oraria</label>
                <select
                  id="timeSlot"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  required
                >
                  <option value="">Seleziona una fascia oraria</option>
                  {availableSlots.map((slot) => (
                    !slot.isBooked && (
                      <option key={slot.timeSlot} value={slot.timeSlot}>
                        {slot.timeSlot} - {MAX_BOOKINGS_PER_SLOT - (slot.bookingsCount || 0)} posti disponibili
                      </option>
                    )
                  ))}
                </select>
              </div>
              
              <button type="submit" disabled={loading || !timeSlot}>
                {loading ? 'Caricamento...' : 'Prenota Ora'}
              </button>
            </>
          )}
        </form>
      </div>
      
      <div className="my-bookings">
        <h2>Le Mie Prenotazioni</h2>
        {loading && <div>Caricamento in corso...</div>}
        {bookings.length === 0 ? (
          <p>Non hai prenotazioni.</p>
        ) : (
          <ul className="bookings-list">
            {bookings.map((booking) => (
              <li key={booking._id} className="booking-item">
                <div className="booking-details">
                  <strong>Data:</strong> {formatDate(booking.date)}
                  <br />
                  <strong>Orario:</strong> {booking.timeSlot}
                </div>
                <button 
                  className="cancel-btn" 
                  onClick={() => handleCancelBooking(booking._id)}
                  disabled={loading}
                >
                  Cancella
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BookingScreen;