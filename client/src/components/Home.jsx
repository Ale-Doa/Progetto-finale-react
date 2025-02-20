import React from 'react';

const Home = ({ user }) => {
  return (
    <div className="home">
      <h1>Palestra Fitness</h1>
      <p>Benvenuto nel tuo centro fitness online!</p>
      {!user ? (
        <>
          <a href="/login" className="btn">
            Accedi
          </a>
          <a href="/register" className="btn">
            Registrati
          </a>
        </>
      ) : (
        <>
          <p>Ciao, {user?.name}! Sei già loggato.</p>
          <a href="/dashboard" className="btn">
            Vai alla Dashboard
          </a>
          <a href="/auth/logout" className="btn">
            Logout
          </a>
        </>
      )}
    </div>
  );
};

export default Home;