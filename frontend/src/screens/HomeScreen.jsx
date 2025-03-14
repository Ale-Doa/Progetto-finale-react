import { useState, useEffect } from 'react';
import { getAnnouncements } from '../services/api';

const HomeScreen = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const data = await getAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch announcements');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="home-screen">
      <h1>La nostra palestra</h1>
      
      {/* Announcements Section */}
      {error && <div className="error">{error}</div>}
      {loading ? (
        <div className="loading">Loading announcements...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : announcements.length > 0 ? (
        <div className="announcements-container">
          <h2>Announcements</h2>
          {announcements.map((announcement) => (
            <div key={announcement._id} className="announcement">
              <h3>{announcement.title}</h3>
              <p>{announcement.content}</p>
              <small>Posted on: {new Date(announcement.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      ) : null}
      
      {/* Informazioni sulla palestra */}
      <div className="gym-info">
        <div className="info-container">
          <div className="location-info">
            <h3>Dove Siamo</h3>
            <p>Via Manzoni 45, Cologno Monzese (MI)</p>
            <p>A soli 5 minuti dalla fermata della metropolitana</p>
          </div>
          <div className="hours-info">
            <h3>Orari di Apertura</h3>
            <ul>
              <li><strong>Lunedì - Venerdì:</strong> 06:00 - 23:00</li>
              <li><strong>Sabato:</strong> 08:00 - 20:00</li>
              <li><strong>Domenica:</strong> 09:00 - 18:00</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="membership-plans">
        <h2>Membership Plans</h2>
        <div className="plans-container">
          <div className="plan">
            <h3>Basic</h3>
            <p>Possibilità di accesso alla reception</p>
            <p>Nessuna prenotazione richiesta</p>
          </div>
          <div className="plan">
            <h3>Premium 1 Mese</h3>
            <p>Pieno accesso alla palestra </p>
            <p>Accesso al sistema di prenotazione</p>
            <p><strong>Costo: 55€</strong></p>
          </div>
          <div className="plan">
            <h3>Premium 3 mesi</h3>
            <p>Pieno accesso alla palestra </p>
            <p>Accesso al sistema di prenotazione</p>
            <p><strong>Costo: 150€</strong></p>
          </div>
          <div className="plan">
            <h3>Premium 6 mesi</h3>
            <p>Pieno accesso alla palestra </p>
            <p>Accesso al sistema di prenotazione</p>
            <p><strong>Costo: 280€</strong></p>
          </div>
          <div className="plan">
            <h3>Premium 12 mesi</h3>
            <p>Pieno accesso alla palestra </p>
            <p>Accesso al sistema di prenotazione</p>
            <p><strong>Costo: 540€</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;