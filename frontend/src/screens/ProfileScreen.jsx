import { useState, useEffect } from 'react';
import { getUserProfile } from '../services/api';

const ProfileScreen = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Use the user data if available, otherwise fetch from API
        if (user) {
          setProfile(user);
          setLoading(false);
        } else {
          const data = await getUserProfile();
          setProfile(data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

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
        return 'Admin account';
      default:
        return 'Basic membership (no expiration)';
    }

    return `${membershipType} (Valid until: ${endDate.toLocaleDateString()})`;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div>No profile data available</div>;

  return (
    <div className="profile-screen">
      <h1>My Profile</h1>
      <div className="profile-info">
        <div className="info-group">
          <label>Name:</label>
          <p>{profile.name}</p>
        </div>
        <div className="info-group">
          <label>Email:</label>
          <p>{profile.email}</p>
        </div>
        <div className="info-group">
          <label>Membership:</label>
          <p>{getMembershipInfo()}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;