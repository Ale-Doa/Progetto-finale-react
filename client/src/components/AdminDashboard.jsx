import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/admin/dashboard');
        setUsers(response.data.users || []);
      } catch (error) {
        setError('Errore durante il caricamento degli utenti');
      }
    };
    fetchUsers();
  }, []); // Specifica le dipendenze vuote per `useEffect`

  const handleUpdateMembership = async (userId, membershipType) => {
    try {
      await axios.post('/admin/update-membership', { userId, membershipType });
      setSuccess('Abbonamento aggiornato con successo');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Errore durante l\'aggiornamento dell\'abbonamento');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Dashboard Admin</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo di Abbonamento</th>
            <th>Data di Scadenza</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.membershipType}</td>
              <td>{u.subscriptionEndDate || 'N/A'}</td>
              <td>
                <select
                  value={u.membershipType}
                  onChange={(event) => handleUpdateMembership(u._id, event.target.value)}
                >
                  <option value="basic">Basic</option>
                  <option value="premium1">Premium 1 mese</option>
                  <option value="premium3">Premium 3 mesi</option>
                  <option value="premium6">Premium 6 mesi</option>
                  <option value="premium12">Premium 12 mesi</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <a href="/auth/logout" className="btn">
        Logout
      </a>
    </div>
  );
};

export default AdminDashboard;