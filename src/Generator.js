import React, { useState, useEffect } from 'react';

function Solar() {
  const [imageSrc, setImageSrc] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    if (selectedOption === '24' || selectedOption === '48') {
      fetch(`http://localhost:5000/generators?time=${selectedOption}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob();
        })
        .then(blob => {
          const imageUrl = URL.createObjectURL(blob);
          setImageSrc(imageUrl);
        })
        .catch(error => {
          console.error('Error fetching image:', error);
        });
    }
  }, [selectedOption]);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value); 
  };


  return (
    <div>
      <h1>Graph for Generator</h1>
      <div>
        <label htmlFor="timeOptions">Select Time:</label>
        <select id="timeOptions" value={selectedOption} onChange={handleSelectChange}>
          <option value="">Select</option>
          <option value="24">24 Hours</option>
          <option value="48">48 Hours</option>
        </select>
      </div>
      {imageSrc && <img src={imageSrc} alt="Graph" />}
    </div>
  );
}

export default Solar;
