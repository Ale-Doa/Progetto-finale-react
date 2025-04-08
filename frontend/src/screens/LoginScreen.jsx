import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

const LoginScreen = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Si è verificato un errore durante il login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <Helmet>
        <title>Accedi - Gym App</title>
        <meta name="description" content="Accedi al tuo account per gestire prenotazioni e abbonamento" />
      </Helmet>
      
      <h1>Accedi</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={submitHandler}>
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
        <button type="submit" disabled={loading}>
          {loading ? 'Caricamento...' : 'Accedi'}
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;