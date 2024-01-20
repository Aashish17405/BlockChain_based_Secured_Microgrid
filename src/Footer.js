import React from 'react';
import './css/index.css'
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Grid Smart Tech. All rights reserved. Reach Out: info@gridsmarttech.com</p>
      </div>
    </footer>
  );
};

export default Footer;