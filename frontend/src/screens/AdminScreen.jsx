import { useState, useEffect } from 'react';
import { getAllUsers, updateUserMembership } from '../services/api';

const AdminScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [membershipType, setMembershipType] = useState('');
  const [membershipStartDate, setMembershipStartDate] = useState('');

  const membershipTypes = [
    'basic',
    'premium1',
    'premium3',
    'premium6',
    'premium12',
    'admin'
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
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

  // Calculate expiration date based on membership type and start date
  const calculateExpirationDate = (user) => {
    if (!user.membershipStartDate) return 'N/A';
    
    const membershipType = user.membershipType;
    const startDate = new Date(user.membershipStartDate);
    let endDate = new Date(startDate);
    
    switch (membershipType) {
      case 'premium1':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'premium3':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'premium6':
        endDate.setMonth(endDate.getMonth() + 6);
        break;
      case 'premium12':
        endDate.setMonth(endDate.getMonth() + 12);
        break;
      case 'admin':
        return 'Never (Admin)';
      default:
        return 'Never (Basic)';
    }
    
    return endDate.toLocaleDateString();
  };

  return (
    <div className="admin-screen">
      <h1>Admin Dashboard</h1>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
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
    </div>
  );
};

export default AdminScreen;