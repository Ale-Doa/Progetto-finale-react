import { useState, useEffect } from 'react';
import { getUserProfile, deleteUserAccount } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ProfileScreen = ({ setUser }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Recupera sempre i dati più recenti del profilo dall'API
        const data = await getUserProfile();
        setProfile(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Impossibile caricare il profilo');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getMembershipInfo = () => {
    if (!profile) return null;

    const membershipType = profile.membershipType;
    const startDate = new Date(profile.membershipStartDate || Date.now());
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
        return 'Account amministratore';
      default:
        return 'Abbonamento base (nessuna scadenza)';
    }

    return `${membershipType} (Valido fino al: ${endDate.toLocaleDateString()})`;
  };

  if (loading) return <div>Caricamento in corso...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div>Nessun dato del profilo disponibile</div>;

  const handleDeleteAccount = async () => {
    if (window.confirm('Sei sicuro di voler eliminare il tuo account? Questa azione non può essere annullata.')) {
      setLoading(true);
      try {
        await deleteUserAccount();
        // Rimuovi le informazioni utente dal localStorage
        localStorage.removeItem('userInfo');
        // Aggiorna lo stato dell'utente nell'app
        setUser(null);
        // Reindirizza alla home page
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.message || `Errore durante l'eliminazione dell'account`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="profile-screen">
      <h1>Il Mio Profilo</h1>
      <div className="profile-info">
        <div className="info-group">
          <label>Nome:</label>
          <p>{profile.name}</p>
        </div>
        <div className="info-group">
          <label>Email:</label>
          <p>{profile.email}</p>
        </div>
        <div className="info-group">
          <label>Abbonamento:</label>
          <p>{getMembershipInfo()}</p>
        </div>
        
        <div className="delete-account-section">
          <h3>Area Pericolosa</h3>
          <p>Una volta eliminato il tuo account, non sarà possibile recuperarlo.</p>
          <button 
            className="delete-account-btn" 
            onClick={handleDeleteAccount}
          >
            Elimina Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;