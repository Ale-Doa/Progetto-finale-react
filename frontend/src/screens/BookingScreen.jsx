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

  const timeSlots = [
    '8.30-10.00',
    '10.00-12.30',
    '14.00-15.30',
    '15.30-17.00',
    '17.00-18.30',
    '18.30-20.00',
    '20.00-21.30',
  ];

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    setLoading(true);
    try {
      const data = await getUserBookings();
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!date) {
      setError('Please select a date');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const data = await getBookingsByDate(date);
      setAvailableSlots(data);
      setTimeSlot(''); // Reset time slot when checking new availability
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check availability');
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!date || !timeSlot) {
      setError('Please select both date and time slot');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await createBooking({ date, timeSlot });
      setSuccess('Booking created successfully!');
      fetchUserBookings();
      setDate('');
      setTimeSlot('');
      setAvailableSlots([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setLoading(true);
      setError('');
      setSuccess('');
      
      try {
        await deleteBooking(id);
        setSuccess('Booking cancelled successfully!');
        fetchUserBookings();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to cancel booking');
      } finally {
        setLoading(false);
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get available time slots that aren't booked
  const getAvailableTimeSlots = () => {
    if (!availableSlots || availableSlots.length === 0) return [];
    return availableSlots.filter(slot => !slot.isBooked);
  };

  return (
    <div className="booking-screen">
      <h1>Gym Bookings</h1>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      <div className="booking-form">
        <h2>Make a New Booking</h2>
        <form onSubmit={handleBooking}>
          <div className="form-group">
            <label htmlFor="date">Date</label>
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
            Check Availability
          </button>
          
          {availableSlots.length > 0 && (
            <>
              <div className="form-group">
                <label htmlFor="timeSlot">Time Slot</label>
                <select
                  id="timeSlot"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  required
                >
                  <option value="">Select a time slot</option>
                  {availableSlots.map((slot) => (
                    !slot.isBooked && (
                      <option key={slot.timeSlot} value={slot.timeSlot}>
                        {slot.timeSlot}
                      </option>
                    )
                  ))}
                </select>
              </div>
              
              <button type="submit" disabled={loading || !timeSlot}>
                {loading ? 'Loading...' : 'Book Now'}
              </button>
            </>
          )}
        </form>
      </div>
      
      <div className="my-bookings">
        <h2>My Bookings</h2>
        {loading && <div>Loading...</div>}
        {bookings.length === 0 ? (
          <p>You have no bookings.</p>
        ) : (
          <ul className="bookings-list">
            {bookings.map((booking) => (
              <li key={booking._id} className="booking-item">
                <div className="booking-info">
                  <p className="booking-date">{formatDate(booking.date)}</p>
                  <p className="booking-time">Time: {booking.timeSlot}</p>
                </div>
                <button 
                  onClick={() => handleCancelBooking(booking._id)}
                  className="cancel-btn"
                  disabled={loading}
                >
                  Cancel
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