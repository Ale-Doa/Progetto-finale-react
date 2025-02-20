import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('/auth/register', { name, email, password });
      alert('Registrazione avvenuta con successo!');
      window.location.href = '/login';
    } catch (error) {
      setError('Errore durante la registrazione');
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
          onChange={(event) => setName(event.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
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