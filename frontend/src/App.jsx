import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import PremiumRoute from './components/PremiumRoute';

const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const LoginScreen = lazy(() => import('./screens/LoginScreen'));
const RegisterScreen = lazy(() => import('./screens/RegisterScreen'));
const BookingScreen = lazy(() => import('./screens/BookingScreen'));
const AdminScreen = lazy(() => import('./screens/AdminScreen'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));

const LoadingFallback = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Caricamento in corso...</p>
  </div>
);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <Header user={user} setUser={setUser} />
        <main className="container">
          <Suspense fallback={<LoadingFallback />}>
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
          </Suspense>
        </main>
      </Router>
    </HelmetProvider>
  );
}

export default App;
