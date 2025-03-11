const HomeScreen = () => {
  return (
    <div className="home-screen">
      <h1>Welcome to Our Gym</h1>
      <p>
        Join our premium membership to access booking features and reserve your spot in our gym sessions.
      </p>
      <div className="membership-plans">
        <h2>Membership Plans</h2>
        <div className="plans-container">
          <div className="plan">
            <h3>Basic</h3>
            <p>Access to gym facilities during non-peak hours</p>
            <p>No booking required</p>
          </div>
          <div className="plan">
            <h3>Premium 1 Month</h3>
            <p>Full access to gym facilities</p>
            <p>Booking system access</p>
            <p>1 month duration</p>
          </div>
          <div className="plan">
            <h3>Premium 3 Months</h3>
            <p>Full access to gym facilities</p>
            <p>Booking system access</p>
            <p>3 months duration</p>
          </div>
          <div className="plan">
            <h3>Premium 6 Months</h3>
            <p>Full access to gym facilities</p>
            <p>Booking system access</p>
            <p>6 months duration</p>
          </div>
          <div className="plan">
            <h3>Premium 12 Months</h3>
            <p>Full access to gym facilities</p>
            <p>Booking system access</p>
            <p>12 months duration</p>
            <p>Best value!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;