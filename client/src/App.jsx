import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Bookings from './components/Bookings';
import AdminDashboard from './components/AdminDashboard';
import Home from './components/Home';
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="app">
      <Routes>
        {/* Pagine pubbliche */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* Pagine private */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Login setUser={setUser} />}
        />
        <Route
          path="/bookings"
          element={user ? <Bookings user={user} /> : <Login setUser={setUser} />}
        />
        <Route
          path="/admin"
          element={
            user && user.membershipType === 'admin' ? (
              <AdminDashboard user={user} />
            ) : (
              <Login setUser={setUser} />
            )
          }
        />

        {/* Home Page */}
        <Route path="/" element={<Home user={user} />} />
      </Routes>
    </div>
  );
}

export default App;