import React, { useState, useEffect } from 'react';
import Solar from './Solar'; // Import the Solar component
import Load from './Load';
import Grid from './Grid';
import Battery from './Battery';
import Genset from './Generator';

function Middleman() {
  const [cost, setCost] = useState(null); // State to store the cost value
  const [showSolarPage, setShowSolarPage] = useState(false); // State to toggle showing Solar page
  const [showBatteryPage, setShowBatteryPage] = useState(false);
  const [showGridPage, setShowGridPage] = useState(false);
  const [showLoadPage, setShowLoadPage] = useState(false);
  const [showGensetPage, setShowGensetPage] = useState(false);

  const handleSolarButtonClick = () => {
      setShowSolarPage(prevState => !prevState); // Toggle the state for showing/hiding Solar page
  };
  const handleLoadButtonClick = () => {
      setShowLoadPage(prevState => !prevState); // Set the state to show Solar page content
  };
  const handleBatteryButtonClick = () => {
      setShowBatteryPage(prevState => !prevState); // Set the state to show Solar page content
  };
  const handleGridButtonClick = () => {
      setShowGridPage(prevState => !prevState); // Set the state to show Solar page content
  };
  const handleGensetButtonClick = () => {
      setShowGensetPage(prevState => !prevState); // Set the state to show Solar page content
  };
  useEffect(() => {
    // Fetch data from your backend for 'gen_cost'
    fetch('http://localhost:5005/gen_cost') // Replace with your Flask server URL
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setCost(data); // Update the 'cost' state with the fetched data
      })
      .catch(error => {
        console.error('Error fetching cost data:', error);
      });
  }, []);

  return (
    <div>
      <h1>Generator Cost</h1>
      {cost !== null ? (
        <p>Cost from gen_cost endpoint: {cost}</p>
      ) : (
        <p>Loading cost...</p>
      )}
      <div className="buttonboxo">
           
        <button className="solaro" onClick={handleSolarButtonClick}>Solar Energy</button>
        <button className="batteryo" onClick={handleBatteryButtonClick}>Battery</button>
        <button className="grido" onClick={handleGridButtonClick}>Grid</button>
        <button className="generatoro" onClick={handleGensetButtonClick}>Generator</button>
        <button className="loado" onClick={handleLoadButtonClick}>Load</button>
           
       </div>
          {showSolarPage && <Solar />}
          {showLoadPage && <Load />}
          {showBatteryPage && <Battery />}
          {showGridPage && <Grid />}
          {showGensetPage && <Genset />}
    </div>
  );
}

export default Middleman;