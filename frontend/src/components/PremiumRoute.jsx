import { Navigate } from 'react-router-dom';

const PremiumRoute = ({ user, children }) => {
  if (!user || !['premium1', 'premium3', 'premium6', 'premium12'].includes(user.membershipType)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PremiumRoute;