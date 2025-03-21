import { Navigate } from 'react-router-dom';

const AdminRoute = ({ user, children }) => {
  if (!user || user.membershipType !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;