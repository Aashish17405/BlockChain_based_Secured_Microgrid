import React, { useState } from 'react';
import axios from 'axios';
import CountdownTimer from './CountdownTimer';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';


const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [loading,setLoading] = useState(false);

  const getUserGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          // console.log(latitude,longitude);
          sendLoginRequest(latitude, longitude);
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          sendLoginRequest(null, null); // Send login request with null geolocation data
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      sendLoginRequest(null, null); // Send login request with null geolocation data
    }
  };

  const sendLoginRequest = async (latitude, longitude) => {
    if (isDisabled) {
      return;
    }
    if (!username || !password) {
      toast.warning('Please fill in both username and password fields.',{autoClose:3000});
      return;
    }
    if (localStorage.getItem('access_token') !== null) {
      toast.error('Please logout before logging in.',{autoClose:2000});
      return;
    }
    try {
      setLoading(true);
      const userIP = await axios.get('https://api.ipify.org?format=json'); // Get user's IP address from an external API
      const response = await axios.post('http://127.0.0.1:5000/login', {
        username,
        password,
        userIP: userIP.data.ip,
        latitude,
        longitude,
      });
      if (response.status === 200) {
        setLoading(false);
        setUsername('');
        setPassword('');
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('role', response.data.role);
        setIsLoggedIn(true);
        toast.success('Logged in! Redirecting...',{autoClose:800});
        const redirectURL = response.data.redirect_url;
        setTimeout(() => {
          window.location.href = redirectURL;
        }, 1500);
        setFailedAttempts(0);
      }
    } catch (error) {
      setLoading(false);
      setUsername('');
      setPassword('');
      setFailedAttempts((prevAttempts) => prevAttempts + 1);
      if (failedAttempts >= 2) {
        setIsDisabled(true);
        setTimeout(() => setIsDisabled(false), 30000);
      }
      toast.error('Invalid username or password');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    getUserGeolocation();
  };

  return (
    <div className="login-box">
      <h2 className="log">Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input type="text" id="username" name="username" className="form-input" autoComplete="off" value={username} onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input type="password" id="password" name="password" className="form-input" autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="button-container">
          <input type="submit" value="Login" disabled={isDisabled} />
        </div>
      </form>
      {isDisabled && <CountdownTimer initialSeconds={30} />}
      
      {loading && (
        <div className="spinner-container">
          <ClipLoader color="#FF4F4F" />
        </div>
      )}
    </div>
  );
};

export default Login;
