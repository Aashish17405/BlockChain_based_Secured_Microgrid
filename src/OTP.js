import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OTP = () => {
 const [mobileNumber, setMobileNumber] = useState('');
 const [otp, setOTP] = useState('');
 const [sentOTP, setSentOTP] = useState(false);
 const [verificationStatus, setVerificationStatus] = useState('');
 const navigate = useNavigate();

 const handleMobileNumberChange = (event) => {
   setMobileNumber(event.target.value);
 };

 const handleOTPChange = (event) => {
   setOTP(event.target.value);
 };

 const sendOTP = async () => {
   try {
     const response = await fetch('http://127.0.0.1:5000/otp', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ mobile_number: mobileNumber }),
     });

     if (response.ok) {
       const data = await response.json();
       setSentOTP(true);
       setVerificationStatus(data.message);
     } else {
       console.log('Failed to send OTP');
     }
   } catch (error) {
     console.error('Error sending OTP:', error);
   }
 };

 const verifyOTP = async () => {
   try {
     const response = await fetch('http://127.0.0.1:5000/verify_otp', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         mobile_number: mobileNumber,
         otp: otp,
       }),
     });

     if (response.ok) {
       const data = await response.json();
       setVerificationStatus(data.message);
       navigate('/login', { state: { otpVerified: true } });
     } else {
       console.log('OTP verification failed');
     }
   } catch (error) {
     console.error('Error verifying OTP:', error);
   }
 };

 return (
   <div className="otp-verification-box">
     <h2 className="otp-title">OTP Verification</h2>
     {!sentOTP ? (
       <div>
         <label htmlFor="mobileNumber" className="form-label"> Enter Mobile Number: </label>
         <input type="text" id="mobileNumber" name="mobileNumber" className="form-input" autoComplete="off" value={mobileNumber} onChange={handleMobileNumberChange}required />
         <div className="button-container">
           <button onClick={sendOTP}>Send OTP</button>
         </div>
         {verificationStatus && <p>{verificationStatus}</p>}
       </div>
     ) : (
       <div>
         <label htmlFor="otp" className="form-label"> Enter OTP:</label>
         <input type="text" id="otp" name="otp" className="form-input" autoComplete="off" value={otp} onChange={handleOTPChange} required />
         <div className="button-container">
           <button onClick={verifyOTP}>Verify OTP</button>
         </div>
         {verificationStatus && <p>{verificationStatus}</p>}
       </div>
     )}
   </div>
 );
};

export default OTP;