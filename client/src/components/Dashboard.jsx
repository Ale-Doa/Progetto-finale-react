import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/bookings', {
          params: { date: new Date().toISOString().split('T')[0] },
        });
        setBookings(response.data.userBookings || []);
      } catch (error) {
        setError('Errore durante il caricamento delle prenotazioni');
      }
    };
    fetchBookings();
  }, []); // Specifica le dipendenze vuote per evitare warning

  const handleCancel = async (bookingId) => {
    try {
      await axios.post('/bookings/cancella', { id: bookingId });
      alert('Prenotazione cancellata con successo!');
      window.location.reload();
    } catch (error) {
      alert('Errore durante la cancellazione della prenotazione.');
    }
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p>Ciao, {user?.name}!</p>
      <p>Email: {user?.email}</p>
      <p>Abbonamento: {user?.membershipType}</p>

      <h3>Le mie prenotazioni:</h3>
      {bookings.length > 0 ? (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id}>
              Data: {booking.bookingDate}, Slot: {booking.slot}
              <button onClick={() => handleCancel(booking._id)}>Cancella</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Non hai alcuna prenotazione attiva.</p>
      )}

      <a href="/bookings" className="btn">
        Gestisci Prenotazioni
      </a>
      <a href="/auth/logout" className="btn">
        Logout
      </a>
    </div>
  );
};

export default Dashboard;