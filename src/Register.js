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
    <div className='content'>
      <div className="register-container">
      <h1 className="register-title">Register</h1>
      <form onSubmit={handleSubmit} className="register-form">
      <div className="reginput-group">
        <label htmlFor="username" className="reginput-label">Username</label><br></br>
        <input type="text" id="username" name="username" autoComplete='off' value={formData.username} onChange={handleInputChange} className="reginput-field"/>
      </div>
      <div className="reginput-group">
        <label htmlFor="password" className="reginput-label">Password</label><br></br>
        <input type="password" id="password" name="password" autoComplete='off' value={formData.password} onChange={handleInputChange} className="reginput-field"/>
      </div>
      <div className="reginput-group">
        <label htmlFor="confirmPassword" className="reginput-label">Confirm Password</label><br></br>
        <input type="password" id="confirmPassword" name="confirmPassword" autoComplete='off' value={formData.confirmPassword} onChange={handleInputChange} className="reginput-field"/>
      </div>
      <div >
        <label ><h3 className='reguser' style={{marginBottom:"0px"}}>User Type</h3></label>
        <div className="regradio-group">
          <label >
            <input type="radio" name="userType" value="consumers" onChange={handleRadioChange} className="regradio-input"/><br></br> Microgrid Consumers
          </label>
          <label>
            <input type="radio" name="userType" value="Power_System_Operators" checked={formData.userType === 'Power_System_Operators'} onChange={handleRadioChange} className="regradio-input"/> <br></br>Power System Operators
          </label>
          <label style={{marginRight:"15px"}}>
            <input type="radio" name="userType" value="Data_Analysts" checked={formData.userType === 'Data_Analysts'} onChange={handleRadioChange} className="regradio-input"/> <br></br>Data Analysts
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
    </div>
  );
};

export default RegisterForm;