import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CountdownTimer from './CountdownTimer';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [role, setRole] = useState('');
  const [redirectURL, setRedirectURL] = useState('');


  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const lockoutStatus = localStorage.getItem('lockout');
    const unlockTime = localStorage.getItem('unlockTime');
    
    if (lockoutStatus === 'true' && unlockTime) {
      const unlockTimeInt = parseInt(unlockTime, 10);

      if (unlockTimeInt > Date.now()) {
        const remainingTime = unlockTimeInt - Date.now();
        setIsDisabled(true);

        // Set a timeout to unlock after the remaining time
        setTimeout(() => {
          setIsDisabled(false);
          clearLockout(); // Remove lockout information
        }, remainingTime);

        // Set the remaining time in state
        setRemainingTime(remainingTime);
      } else {
        // If the unlock time has already passed, remove the lockout
        setIsDisabled(false);
        clearLockout(); // Remove lockout information
      }
    }
  }, []);

  const clearLockout = () => {
    localStorage.removeItem('lockout');
    localStorage.removeItem('unlockTime');
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (failedAttempts >= 2) {
      setIsDisabled(true);
      localStorage.setItem('lockout', 'true');
      localStorage.setItem('unlockTime', Date.now() + 30000); // Set unlock time 30 seconds from now

      // Set a timeout to unlock after 30 seconds
      setTimeout(() => {
        setIsDisabled(false);
        clearLockout(); // Remove lockout information
      }, 30000);
    }

    if (!username || !password) {
      toast.warning('Please fill in both username and password fields.', { autoClose: 3000 });
      return;
    }

    if (localStorage.getItem('access_token') !== null) {
      toast.error('Please logout before logging in.', { autoClose: 2000 });
      return;
    }

    const { latitude, longitude } = await getUserGeolocation();

    if (otpSent) {
      verifyOTP();
    } else {
      try {
        setLoading(true);

        const response = await axios.post('http://127.0.0.1:5000/login', {
          username,
          password,
          latitude,
          longitude,
        });

        if (response.status === 200) {
          setOtpSent(true);
          sendOTP();
          setAccessToken(response.data.access_token);
          setRole(response.data.role);
          setRedirectURL(response.data.redirect_url);
        }
      } catch (error) {
        setUsername('');
        setPassword('');
        setLoading(false);
        setFailedAttempts((prevAttempts) => prevAttempts + 1);

        if (failedAttempts >= 2) {
          setIsDisabled(true);
          localStorage.setItem('lockout', 'true');

          // Set a timeout to unlock after 30 seconds
          setTimeout(() => {
            setIsDisabled(false);
            localStorage.removeItem('lockout');
          }, 30000);
        }

        toast.error('Invalid username or password', { autoClose: 2000 });
        console.error('Error during login:', error);
      }
    }
  };

  const getUserGeolocation = () => {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            resolve({ latitude, longitude });
          },
          (error) => {
            console.error('Error getting geolocation:', error);
            resolve({ latitude: null, longitude: null });
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        resolve({ latitude: null, longitude: null });
      }
    });
  };

  const sendOTP = async () => {
    try {
      setLoading(true);

      const response = await axios.post('http://127.0.0.1:5000/send_otp');

      if (response.status === 200) {
        setOtpSent(true);
        setVerificationStatus('');
        toast.success('OTP sent to your phone. Please enter it for verification.', { autoClose: 3000 });
      } else {
        console.log('Failed to send OTP');
        setVerificationStatus('Failed to send OTP');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Error sending OTP', { autoClose: 2000 });
      console.error('Error sending OTP:', error);
      setVerificationStatus('Error sending OTP');
    }
  };

  const verifyOTP = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:5000/verify_otp', {
        otp,
      });
      if (response.status === 200) {
        toast.success('OTP verification successful! Redirecting...', { autoClose: 1000 });
        setIsLoggedIn(true);
        setFailedAttempts(0);
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('role', role);
        setIsLoggedIn(true);
        setTimeout(() => {
          window.location.href = redirectURL;
        }, 1500);
      } else {
        toast.error('OTP verification failed', { autoClose: 2000 });
        console.log('OTP verification failed');
        setVerificationStatus('OTP verification failed');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('OTP verification failed', { autoClose: 2000 });
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    
    <div className="login-box">
      <h2 className="log">Send OTP</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input type="text" id="username" name="username" className="form-input" autoComplete="off" value={username} onChange={(e) => setUsername(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input type="password" id="password" name="password" className="form-input" autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
        {otpSent && (
          <div>
            <label htmlFor="otp" className="form-label">
              Enter OTP
            </label>
            <input type="text" id="otp" name="otp" className="form-input" autoComplete="off" value={otp} onChange={(e) => setOtp(e.target.value)}/>
          </div>
        )}
        <div className="button-container">
          <input type="submit" value={otpSent ? 'Verify OTP' : 'Login'} disabled={isDisabled} />
        </div>
      </form>
      {isDisabled && <CountdownTimer initialSeconds={Boolean(remainingTime)? Math.round(remainingTime / 1000):30} />}

      {loading && (
        <div className="spinner-container">
          <ClipLoader color="#FF4F4F" />
        </div>
      )}

      {verificationStatus && <p>{verificationStatus}</p>}
    </div>
  );
};
export default Login;