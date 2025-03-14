import { Link, useNavigate } from 'react-router-dom';

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/login');
  };

  return (
    <header>
      <nav>
        <div className="logo">
          <Link to="/">Gym App</Link>
        </div>
        <ul className="nav-links">
          {user ? (
            <>
              <li>
                <Link to="/profile">
                  <img src="/assets/userImg.png" alt="Profile" className="profile-icon" />
                </Link>
              </li>
              {['premium1', 'premium3', 'premium6', 'premium12'].includes(user.membershipType) && (
                <li>
                  <Link to="/bookings">Bookings</Link>
                </li>
              )}
              {user.membershipType === 'admin' && (
                <li>
                  <Link to="/admin">Admin</Link>
                </li>
              )}
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;