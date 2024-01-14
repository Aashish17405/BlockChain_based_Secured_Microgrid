import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import lg from './lpg.png';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('access_token') !== null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');

    if (confirmLogout) {
      if (localStorage.getItem('access_token') !== null) {
        // Get user's current location (latitude and longitude)
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            // Prepare data to be sent to the Flask backend
            const logoutData = {
              latitude,
              longitude,
              logoutTime: new Date().toISOString(), // You can format this date as needed
            };

            // Send the data to the Flask backend
            try {
              const response = await fetch('http://127.0.0.1:5000/logout', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify(logoutData),
              });

              if (response.ok) {
                // Clear local storage and update state
                localStorage.removeItem('access_token');
                localStorage.removeItem('role');
                setIsLoggedIn(false);
                navigate('/');
              } else {
                console.error('Failed to send logout data to the server.');
              }
            } catch (error) {
              console.error('Error sending logout data:', error);
            }
          });
        } else {
          console.error('Geolocation is not supported by your browser.');
        }
      }
    }
  };

  return (
    <div className='navbar'>
      <div className='links'>
        <Link to="/" className='hm'><img src={lg} style={{ width: '60px', height: '50px' }} alt="Grid smart Tech"/>GRID SMART TECH</Link>
        <Link to="/ContactUs" className='cu'>Contact Us</Link>
        <Link to="/About" className='ab'>About</Link>
        {isLoggedIn ? (
          <button onClick={handleLogout} className='abc'>Logout</button>
        ) : (
          <Link to="/login" className='ab'>Login</Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
