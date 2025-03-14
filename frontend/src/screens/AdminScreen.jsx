import { useState, useEffect } from 'react';
import { getAllUsers, updateUserMembership, getAllAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../services/api';

// Membership types available
const membershipTypes = ['basic', 'premium1', 'premium3', 'premium6', 'premium12', 'admin'];

// Function to calculate expiration date based on membership type
const calculateExpirationDate = (user) => {
  if (!user.membershipStartDate || user.membershipType === 'basic') {
    return 'N/A';
  }
  
  const startDate = new Date(user.membershipStartDate);
  let expirationDate = new Date(startDate);
  
  if (user.membershipType === 'premium1') {
    expirationDate.setMonth(startDate.getMonth() + 1); // 1 month
  } else if (user.membershipType === 'premium3') {
    expirationDate.setMonth(startDate.getMonth() + 3); // 3 months
  } else if (user.membershipType === 'premium6') {
    expirationDate.setMonth(startDate.getMonth() + 6); // 6 months
  } else if (user.membershipType === 'premium12') {
    expirationDate.setMonth(startDate.getMonth() + 12); // 12 months
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

  useEffect(() => {
    fetchUsers();
    fetchAnnouncements();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      // Filtra gli utenti per escludere quelli con membershipType 'admin'
      const filteredUsers = data.filter(user => user.membershipType !== 'admin');
      setUsers(filteredUsers);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
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
      setError(err.response?.data?.message || 'Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setMembershipType(user.membershipType);
    // Format the date for the input field (YYYY-MM-DD)
    if (user.membershipStartDate) {
      const date = new Date(user.membershipStartDate);
      setMembershipStartDate(date.toISOString().split('T')[0]);
    } else {
      setMembershipStartDate('');
    }
    
    // Aggiungi scroll automatico alla sezione di modifica
    setTimeout(() => {
      const editSection = document.querySelector('.edit-user');
      if (editSection) {
        editSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCancel = () => {
    setEditingUser(null);
    setMembershipType('');
    setMembershipStartDate('');
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await updateUserMembership(editingUser._id, { 
        membershipType,
        membershipStartDate: membershipStartDate || undefined
      });
      setSuccess(`Membership updated for ${editingUser.name}`);
      fetchUsers();
      setEditingUser(null);
      setMembershipStartDate('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update membership');
    } finally {
      setLoading(false);
    }
  };

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (editingAnnouncement) {
        await updateAnnouncement(editingAnnouncement._id, {
          title: newAnnouncement.title,
          content: newAnnouncement.content,
          isActive: newAnnouncement.isActive,
        });
        setSuccess('Announcement updated successfully!');
      } else {
        await createAnnouncement({
          title: newAnnouncement.title,
          content: newAnnouncement.content,
        });
        setSuccess('Announcement created successfully!');
      }
      
      setNewAnnouncement({ title: '', content: '' });
      setEditingAnnouncement(null);
      fetchAnnouncements();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAnnouncement = (announcement) => {
    setEditingAnnouncement(announcement);
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content,
      isActive: announcement.isActive,
    });
  };

  const handleToggleAnnouncementStatus = async (announcement) => {
    setLoading(true);
    try {
      await updateAnnouncement(announcement._id, {
        isActive: !announcement.isActive,
      });
      fetchAnnouncements();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update announcement status');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setLoading(true);
      try {
        await deleteAnnouncement(id);
        setSuccess('Announcement deleted successfully!');
        fetchAnnouncements();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete announcement');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="admin-screen">
      <h1>Admin Dashboard</h1>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </button>
        <button 
          className={activeTab === 'announcements' ? 'active' : ''} 
          onClick={() => setActiveTab('announcements')}
        >
          Manage Announcements
        </button>
      </div>
      
      {activeTab === 'users' ? (
        <>
          <div className="users-list">
            <h2>All Users</h2>
            {loading && <div>Loading...</div>}
            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Membership</th>
                    <th>Start Date</th>
                    <th>Expiration Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.membershipType}</td>
                      <td>{user.membershipStartDate ? new Date(user.membershipStartDate).toLocaleDateString() : 'N/A'}</td>
                      <td>{calculateExpirationDate(user)}</td>
                      <td>
                        <button onClick={() => handleEdit(user)}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {editingUser && (
            <div className="edit-user">
              <h2>Edit User: {editingUser.name}</h2>
              <div className="form-group">
                <label htmlFor="membershipType">Membership Type</label>
                <select
                  id="membershipType"
                  value={membershipType}
                  onChange={(e) => setMembershipType(e.target.value)}
                >
                  {membershipTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="membershipStartDate">Start Date</label>
                <input
                  type="date"
                  id="membershipStartDate"
                  value={membershipStartDate}
                  onChange={(e) => setMembershipStartDate(e.target.value)}
                />
              </div>
              <div className="form-actions">
                <button onClick={handleUpdate} disabled={loading}>
                  {loading ? 'Updating...' : 'Update Membership'}
                </button>
                <button onClick={handleCancel} disabled={loading}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="announcements-management">
          <div className="announcement-form-container">
            <h2>{editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}</h2>
            <form onSubmit={handleAnnouncementSubmit} className="announcement-form">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  required
                  placeholder="Enter announcement title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                  required
                  rows="4"
                  placeholder="Enter announcement content"
                ></textarea>
              </div>
              {editingAnnouncement && (
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={newAnnouncement.isActive}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, isActive: e.target.checked})}
                    />
                    <span>Active</span>
                  </label>
                </div>
              )}
              <div className="form-actions">
                <button type="submit" disabled={loading} className="primary-button">
                  {loading ? 'Saving...' : editingAnnouncement ? 'Update Announcement' : 'Create Announcement'}
                </button>
                {editingAnnouncement && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditingAnnouncement(null);
                      setNewAnnouncement({ title: '', content: '' });
                    }}
                    className="secondary-button"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
          
          <h2>All Announcements</h2>
          {loading && <div className="loading">Loading...</div>}
          {announcements.length === 0 ? (
            <p className="no-data">No announcements found.</p>
          ) : (
            <div className="announcements-list">
              {announcements.map((announcement) => (
                <div key={announcement._id} className={`announcement-item ${!announcement.isActive ? 'inactive' : ''}`}>
                  <div className="announcement-header">
                    <h3>{announcement.title}</h3>
                    <div className="announcement-status">
                      {announcement.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  <p>{announcement.content}</p>
                  <div className="announcement-meta">
                    <small>Created by: {announcement.createdBy.name}</small>
                    <small>Date: {new Date(announcement.createdAt).toLocaleDateString()}</small>
                  </div>
                  <div className="announcement-actions">
                    <button onClick={() => handleEditAnnouncement(announcement)}>Edit</button>
                    <button onClick={() => handleToggleAnnouncementStatus(announcement)}>
                      {announcement.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleDeleteAnnouncement(announcement._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminScreen;