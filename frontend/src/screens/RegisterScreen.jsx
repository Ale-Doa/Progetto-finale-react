import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

const RegisterScreen = ({ setUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Le password non corrispondono');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const data = await registerUser({ name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Si è verificato un errore durante la registrazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-screen">
      <Helmet>
        <title>Registrazione - Gym App</title>
        <meta name="description" content="Crea un nuovo account per accedere ai servizi della palestra" />
      </Helmet>
      
      <h1>Registrati</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            placeholder="Inserisci nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Indirizzo Email</label>
          <input
            type="email"
            id="email"
            placeholder="Inserisci email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Inserisci password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Conferma Password</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Conferma password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Caricamento...' : 'Registrati'}
        </button>
      </form>
    </div>
  );
};

export default RegisterScreen;