import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    userType: 'consumers' // Default value for user type
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioChange = (e) => {
    setFormData({ ...formData, userType: e.target.value });
  };

  const [loading,setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password, confirmPassword, userType } = formData;

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
    } else {
      try {
        setLoading(true);
        const response = await axios.post('http://localhost:5000/register', {
          username,
          password,
          userType
        });

        if (response.status === 200) {
          setLoading(false);
          toast.success('Registered successfully!',{autoClose:2000});
          setFormData({
            username: '',
            password: '',
            confirmPassword: '',
            userType: 'consumers'
          });
        } else {
          setLoading(false);
          toast.error('Error registering user');
        }
      } catch (error) {
        setLoading(false);
        console.error('Error registering:', error);
        toast.error('Error registering user');
      }
    }
  };

  return (
    <div className="register-container">
    <h1 className="register-title">Register</h1>
    <form onSubmit={handleSubmit} className="register-form">
     <div className="reginput-group">
       <label htmlFor="username" className="reginput-label">Username:</label>
       <input type="text" id="username" name="username" autoComplete='off' value={formData.username} onChange={handleInputChange} className="reginput-field"/>
     </div>
     <div className="reginput-group">
       <label htmlFor="password" className="reginput-label">Password:</label>
       <input type="password" id="password" name="password" autoComplete='off' value={formData.password} onChange={handleInputChange} className="reginput-field"/>
     </div>
     <div className="reginput-group">
       <label htmlFor="confirmPassword" className="reginput-label">Confirm Password:</label>
       <input type="password" id="confirmPassword" name="confirmPassword" autoComplete='off' value={formData.confirmPassword} onChange={handleInputChange} className="reginput-field"/>
     </div>
     <div >
       <label ><h3 className='reguser'>User Type</h3></label>
       <div className="regradio-group">
         <label>
           <input type="radio" name="userType" value="consumers" checked={formData.userType === 'consumers'} onChange={handleRadioChange} className="regradio-input"/> Consumers
         </label>
         <label>
           <input type="radio" name="userType" value="toplevel" checked={formData.userType === 'toplevel'} onChange={handleRadioChange} className="regradio-input"/> Toplevel
         </label>
         <label>
           <input type="radio" name="userType" value="middleman" checked={formData.userType === 'middleman'} onChange={handleRadioChange} className="regradio-input"/> Middleman
         </label>
       </div>
     </div>
     <button type="submit" className="register-button">Register</button>
    </form>
    {loading && (
        <div className="spinner-container">
          <ClipLoader color="#FF4F4F" />
        </div>
      )}
   </div>
  );
};

export default RegisterForm;