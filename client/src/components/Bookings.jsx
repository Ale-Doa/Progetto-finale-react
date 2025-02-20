import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Bookings = ({ user }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get('/bookings', { params: { date } });
        setSlots(response.data.slots || []);
      } catch (error) {
        setError('Errore durante il caricamento degli slot');
      }
    };
    fetchSlots();
  }, [date]); // Aggiungiamo `date` come dipendenza per `useEffect`

  const handleBooking = async (slotName) => {
    try {
      await axios.post('/bookings/prenota', { date, slot: slotName });
      setSuccess('Prenotazione effettuata con successo');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Errore durante la prenotazione');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="bookings">
      <h2>Prenota un Allenamento</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <input
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        required
      />
      <div>
        {slots.map((slot) => (
          <div key={slot.name} className={`slot ${slot.isFull ? 'full' : 'available'}`}>
            <h3>{slot.name}</h3>
            <p>Posti disponibili: {slot.available}</p>
            {!slot.isFull && (
              <button onClick={() => handleBooking(slot.name)}>Prenota</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;