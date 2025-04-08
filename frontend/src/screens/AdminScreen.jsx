import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  getAllUsers, 
  updateUserMembership, 
  getAllAnnouncements, 
  createAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement, 
  getAllBookings
} from '../services/api';

const membershipTypes = ['basic', 'premium1', 'premium3', 'premium6', 'premium12', 'admin'];

const calculateExpirationDate = (user) => {
  if (!user.membershipStartDate || user.membershipType === 'basic') {
    return 'N/A';
  }
  
  const startDate = new Date(user.membershipStartDate);
  let expirationDate = new Date(startDate);
  
  if (user.membershipType === 'premium1') {
    expirationDate.setMonth(startDate.getMonth() + 1); 
  } else if (user.membershipType === 'premium3') {
    expirationDate.setMonth(startDate.getMonth() + 3); 
  } else if (user.membershipType === 'premium6') {
    expirationDate.setMonth(startDate.getMonth() + 6); 
  } else if (user.membershipType === 'premium12') {
    expirationDate.setMonth(startDate.getMonth() + 12); 
  }
  
  return expirationDate.toLocaleDateString();
};

const AdminScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [membershipType, setMembershipType] = useState('');
  const [membershipStartDate, setMembershipStartDate] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  
  const [allBookings, setAllBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  
  useEffect(() => {
    fetchUsers();
    fetchAnnouncements();
    
    if (activeTab === 'bookings') {
      fetchAllBookings();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      const filteredUsers = data.filter(user => user.membershipType !== 'admin');
      setUsers(filteredUsers);
    } catch (err) {
      setError(err.response?.data?.message || 'Impossibile recuperare gli utenti');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await getAllAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Impossibile recuperare gli annunci');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setMembershipType(user.membershipType);
    if (user.membershipStartDate) {
      const date = new Date(user.membershipStartDate);
      setMembershipStartDate(date.toISOString().split('T')[0]);
    } else {
      setMembershipStartDate('');
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await updateUserMembership(editingUser._id, {
        membershipType,
        membershipStartDate: membershipStartDate || new Date().toISOString()
      });
      setSuccess('Abbonamento utente aggiornato con successo!');
      fetchUsers();
      setEditingUser(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Impossibile aggiornare l\'abbonamento');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setError('');
    setSuccess('');
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await createAnnouncement(newAnnouncement);
      setSuccess('Annuncio creato con successo!');
      fetchAnnouncements();
      setNewAnnouncement({ title: '', content: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Impossibile creare l\'annuncio');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAnnouncement = (announcement) => {
    setEditingAnnouncement(announcement);
  };

  const handleUpdateAnnouncement = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await updateAnnouncement(editingAnnouncement._id, editingAnnouncement);
      setSuccess('Annuncio aggiornato con successo!');
      fetchAnnouncements();
      setEditingAnnouncement(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Impossibile aggiornare l\'annuncio');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo annuncio?')) {
      setLoading(true);
      setError('');
      setSuccess('');
      
      try {
        await deleteAnnouncement(id);
        setSuccess('Annuncio eliminato con successo!');
        fetchAnnouncements();
      } catch (err) {
        setError(err.response?.data?.message || 'Impossibile eliminare l\'annuncio');
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchAllBookings = async () => {
    setLoading(true);
    try {
      const data = await getAllBookings();
      setAllBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const filterBookingsByDate = () => {
    if (!selectedDate) return allBookings;
    
    const filterDate = new Date(selectedDate);
    filterDate.setHours(0, 0, 0, 0);
    
    return allBookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === filterDate.getTime();
    });
  };

  return (
    <div className="admin-screen">
      <Helmet>
        <title>Pannello Amministrazione - Gym App</title>
        <meta name="description" content="Gestisci utenti, prenotazioni e annunci della palestra" />
      </Helmet>
      
      <h1>Pannello di Amministrazione</h1>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          Gestione Utenti
        </button>
        <button 
          className={activeTab === 'announcements' ? 'active' : ''} 
          onClick={() => setActiveTab('announcements')}
        >
          Gestione Annunci
        </button>
        <button 
          className={activeTab === 'bookings' ? 'active' : ''} 
          onClick={() => setActiveTab('bookings')}
        >
          Gestione Prenotazioni
        </button>
      </div>
      
      {activeTab === 'users' && (
        <div className="users-management">
          <h2>Gestione Utenti</h2>
          {loading ? (
            <div>Caricamento in corso...</div>
          ) : (
            <div className="users-list">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Abbonamento</th>
                    <th>Data Inizio</th>
                    <th>Data Scadenza</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.membershipType}</td>
                      <td>{user.membershipStartDate ? new Date(user.membershipStartDate).toLocaleDateString() : 'N/A'}</td>
                      <td>{calculateExpirationDate(user)}</td>
                      <td>
                        <button onClick={() => handleEdit(user)}>Modifica</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {editingUser && (
            <div className="edit-user-form">
              <h3>Modifica Abbonamento</h3>
              <div className="form-group">
                <label>Utente: {editingUser.name}</label>
              </div>
              <div className="form-group">
                <label htmlFor="membershipType">Tipo Abbonamento</label>
                <select
                  id="membershipType"
                  value={membershipType}
                  onChange={(e) => setMembershipType(e.target.value)}
                >
                  {membershipTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="membershipStartDate">Data Inizio</label>
                <input
                  type="date"
                  id="membershipStartDate"
                  value={membershipStartDate}
                  onChange={(e) => setMembershipStartDate(e.target.value)}
                />
              </div>
              <div className="form-actions">
                <button onClick={handleUpdate} disabled={loading}>
                  {loading ? 'Aggiornamento...' : 'Aggiorna'}
                </button>
                <button onClick={handleCancel}>Annulla</button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'announcements' && (
        <div className="announcements-management">
          <h2>Gestione Annunci</h2>
          
          <div className="create-announcement">
            <h3>Crea Nuovo Annuncio</h3>
            <form onSubmit={handleCreateAnnouncement}>
              <div className="form-group">
                <label htmlFor="title">Titolo</label>
                <input
                  type="text"
                  id="title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="content">Contenuto</label>
                <textarea
                  id="content"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                  required
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Creazione...' : 'Crea Annuncio'}
              </button>
            </form>
          </div>
          
          <div className="announcements-list">
            <h3>Annunci Esistenti</h3>
            {loading ? (
              <div>Caricamento in corso...</div>
            ) : announcements.length === 0 ? (
              <p>Nessun annuncio disponibile.</p>
            ) : (
              <div>
                {announcements.map(announcement => (
                  <div key={announcement._id} className="announcement-item">
                    {editingAnnouncement && editingAnnouncement._id === announcement._id ? (
                      <div className="edit-announcement-form">
                        <div className="form-group">
                          <label htmlFor={`edit-title-${announcement._id}`}>Titolo</label>
                          <input
                            type="text"
                            id={`edit-title-${announcement._id}`}
                            value={editingAnnouncement.title}
                            onChange={(e) => setEditingAnnouncement({
                              ...editingAnnouncement,
                              title: e.target.value
                            })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor={`edit-content-${announcement._id}`}>Contenuto</label>
                          <textarea
                            id={`edit-content-${announcement._id}`}
                            value={editingAnnouncement.content}
                            onChange={(e) => setEditingAnnouncement({
                              ...editingAnnouncement,
                              content: e.target.value
                            })}
                            required
                          />
                        </div>
                        <div className="form-actions">
                          <button onClick={handleUpdateAnnouncement} disabled={loading}>
                            {loading ? 'Aggiornamento...' : 'Aggiorna'}
                          </button>
                          <button onClick={() => setEditingAnnouncement(null)}>Annulla</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4>{announcement.title}</h4>
                        <p>{announcement.content}</p>
                        <small>Creato il: {new Date(announcement.createdAt).toLocaleDateString()}</small>
                        <div className="announcement-actions">
                          <button onClick={() => handleEditAnnouncement(announcement)}>Modifica</button>
                          <button onClick={() => handleDeleteAnnouncement(announcement._id)}>Elimina</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'bookings' && (
        <div className="bookings-management">
          <h2>Gestione Prenotazioni</h2>
          
          <div className="filter-bookings">
            <label htmlFor="date-filter">Filtra per data:</label>
            <input
              type="date"
              id="date-filter"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          
          {loading ? (
            <div>Caricamento in corso...</div>
          ) : (
            <div className="bookings-list">
              <h3>Prenotazioni {selectedDate ? `per il ${new Date(selectedDate).toLocaleDateString()}` : ''}</h3>
              {filterBookingsByDate().length === 0 ? (
                <p>Nessuna prenotazione trovata.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Utente</th>
                      <th>Email</th>
                      <th>Data</th>
                      <th>Fascia Oraria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterBookingsByDate().map(booking => (
                      <tr key={booking._id}>
                        <td>{booking.user?.name || 'Utente sconosciuto'}</td>
                        <td>{booking.user?.email || 'Email sconosciuta'}</td>
                        <td>{new Date(booking.date).toLocaleDateString()}</td>
                        <td>{booking.timeSlot}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminScreen;