import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Solar from './Solar'; // Import the Solar component
import Load from './Load';
import Grid from './Grid';
import Battery from './Battery';
import Genset from './Generator';

const Organization = () => {
    const [inputValue, setInputValue] = useState('');
    const [isClicked, setIsClicked] = useState(false);
    const [cost, setCost] = useState(null); // State to store the cost value
    const [showSolarPage, setShowSolarPage] = useState(false); // State to toggle showing Solar page
    const [showBatteryPage, setShowBatteryPage] = useState(false);
    const [showGridPage, setShowGridPage] = useState(false);
    const [showLoadPage, setShowLoadPage] = useState(false);
    const [showGensetPage, setShowGensetPage] = useState(false);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async () => {
        setIsClicked(!isClicked);
    
        // Check if the input value is empty
        if (!inputValue) {
            // Show error toast for empty input field
            toast.error("Please enter a value for Genset cost");
            return; // Return to exit the function
        }
    
        if (isNaN(inputValue) || parseInt(inputValue) > 4) {
            // Show error toast if the input is not a number or greater than 4
            toast.error("Genset cost can't exceed 5rs");
            setInputValue(''); // Clear input field
        } else {
            try {
                await axios.post('http://localhost:5000/organization', { data: inputValue });
                // Handle success (optional)
                setInputValue('');
                console.log('List updated successfully');
                toast.success('Genset cost updated successfully!');
            } catch (error) {
                // Handle error (optional)
                setInputValue('');
                console.error('Error updating list:', error);
                toast.error('Error updating genset cost');
            }
        }
    };
    

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
    const handleRegisterButtonClick= ()=>{
        window.location.href='/register';
    }

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
            {cost !== null ? (
                <p>Cost from gen_cost endpoint: {cost}</p>
            ) : (
                <p>Loading cost...</p>
            )}
            <div className='buttoncontaineroo'>
                <button className="solaro" onClick={handleSolarButtonClick}>Solar Energy</button>
                <button className="batteryo" onClick={handleBatteryButtonClick}>Battery</button>
                <button className="grido" onClick={handleGridButtonClick}>Grid</button>
                <button className="generatoro" onClick={handleGensetButtonClick}>Generator</button>
                <button className="loado" onClick={handleLoadButtonClick}>Load</button>
                <button className="loado" onClick={handleRegisterButtonClick}>Register</button>
            </div>
            <div className='inputoo'>
                <label>Update the cost of Genset:</label><br></br>
                <input type="text" value={inputValue} onChange={handleInputChange} className="inputField" />
                <button className={ isClicked?"bottonoo":"botton"} onClick={handleSubmit}>Update List</button>
            </div>
            {showSolarPage && <Solar />}
            {showLoadPage && <Load />}
            {showBatteryPage && <Battery />}
            {showGridPage && <Grid />}
            {showGensetPage && <Genset />}
        </div>
    );
}
 
export default Organization;