import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Invia la richiesta di registrazione al backend
      await register({ name, email, password }); // Usa la funzione register
      alert('Registrazione avvenuta con successo!');
      navigate('/login'); // Reindirizza alla pagina di login
    } catch (error) {
      setError('Errore durante la registrazione');
      console.error('Errore durante la registrazione:', error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="register">
      <h2>Registrati</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Registrati</button>
      </form>
      <p>
        Hai già un account?{' '}
        <a href="/login">Accedi</a>
      </p>
    </div>
  );
};

export default Register;