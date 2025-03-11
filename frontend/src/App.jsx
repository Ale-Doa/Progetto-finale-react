import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import BookingScreen from './screens/BookingScreen';
import AdminScreen from './screens/AdminScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import PremiumRoute from './components/PremiumRoute';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  return (
    <Router>
      <Header user={user} setUser={setUser} />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/login" element={<LoginScreen setUser={setUser} />} />
          <Route path="/register" element={<RegisterScreen setUser={setUser} />} />
          <Route path="/profile" element={
            <ProtectedRoute user={user}>
              <ProfileScreen user={user} setUser={setUser} />
            </ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <PremiumRoute user={user}>
              <BookingScreen user={user} />
            </PremiumRoute>
          } />
          <Route path="/admin" element={
            <AdminRoute user={user}>
              <AdminScreen />
            </AdminRoute>
          } />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
