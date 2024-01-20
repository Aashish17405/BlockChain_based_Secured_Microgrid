import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';
import Footer from './Footer';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    username: '',
    position: '',
    aadhar: '',
    feedback: ''
  });
  const[loading,setLoading]=useState(false);
  const [aadharError, setAadharError] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'aadhar' && value.length === 12 && !isNaN(value)) {
      setAadharError(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isFormValid = Object.values(formData).every(value => value !== '');

    if (isFormValid) {
      if (formData.aadhar.length === 12 && !isNaN(formData.aadhar)) {
        try {
          setLoading(true);
          await axios.post('http://localhost:5000/api/add-feedback', formData);
          toast.success('Response Submitted!');
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error('Error submitting form:', error);
          toast.error('Error submitting the form.');
        }
      } else {
        setLoading(false);
        setAadharError(true); 
        toast.warning('Aadhar ID should be exactly 12 digits and contain only numbers.',{autoClose:5000});
      }
    } else {
      setLoading(false);
      toast.warning('Please fill in all the fields before submitting.',{autoClose:5000});
    }
  };

  return (
    <div>
      <div className='content'>
      <div className="contact-form">
        <h2>Fill the form</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="contact-form label">Username</label>
            <input type="text" id="username" name="username" autoComplete='off' className="contact-form input" onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="position" className="contact-form label">Position</label>
            <input type="text" id="position" name="position" autoComplete='off' className="contact-form input" onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="aadhar" className="contact-form label">Aadhar ID</label>
            <input type="text" id="aadhar" name="aadhar" autoComplete='off' className={`contact-form input ${aadharError ? 'error' : ''}`} maxLength={12} onChange={handleInputChange}/>
          </div>
          <div className="feed">
            <label htmlFor="feedback" className="contact-form label">Feedback</label>
            <textarea id="feedback" name="feedback" autoComplete='off' className="contact-form textarea" onChange={handleInputChange}></textarea>
          </div>
          <button type="submit" className="contact-form button">Submit</button>
        </form>
        {loading && (
          <div className="spinner-container">
            <ClipLoader color="#FF4F4F" />
          </div>
        )}
      </div>
      
      </div>
      <Footer/>
    </div>
  );
};

export default ContactUs;
