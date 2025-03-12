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
      <h1>Welcome to Our Gym</h1>
      
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
      
      <p>
        Join our premium membership to access booking features and reserve your spot in our gym sessions.
      </p>
      <div className="membership-plans">
        <h2>Membership Plans</h2>
        <div className="plans-container">
          <div className="plan">
            <h3>Basic</h3>
            <p>Access to gym facilities during non-peak hours</p>
            <p>No booking required</p>
          </div>
          <div className="plan">
            <h3>Premium 1 Month</h3>
            <p>Full access to gym facilities</p>
            <p>Booking system access</p>
            <p>1 month duration</p>
          </div>
          <div className="plan">
            <h3>Premium 3 Months</h3>
            <p>Full access to gym facilities</p>
            <p>Booking system access</p>
            <p>3 months duration</p>
          </div>
          <div className="plan">
            <h3>Premium 6 Months</h3>
            <p>Full access to gym facilities</p>
            <p>Booking system access</p>
            <p>6 months duration</p>
          </div>
          <div className="plan">
            <h3>Premium 12 Months</h3>
            <p>Full access to gym facilities</p>
            <p>Booking system access</p>
            <p>12 months duration</p>
            <p>Best value!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;