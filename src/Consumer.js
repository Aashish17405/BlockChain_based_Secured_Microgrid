import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function Consumer() {
  const [billAmount, setBillAmount] = useState(null);

  useEffect(() => {
    const fetchBillAmount = async () => {
      try {
        const response = await fetch(`http://localhost:5005/bill`);
        const data = await response.json();
        console.log('Data received from API:', data);
        setBillAmount(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    

    fetchBillAmount();
  }, []);

  const [graphImage, setGraphImage] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/generate_bar_graph`)
      .then(response => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error('Network response was not ok.');
      })
      .then(blob => {
        const objectURL = URL.createObjectURL(blob);
        setGraphImage(objectURL);
      })
      .catch(error => {
        console.error('Error fetching graph:', error);
      });
  }, []);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/get_table_data')
      .then(response => response.json())
      .then(data => setTableData(data.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>Graph for your house Load</h1>
      <div>
        {billAmount !== null && <p>Bill Amount for last hour: ₹{billAmount}</p>}
        {graphImage && (<img src={graphImage} alt="Bar Graph" />)}
      </div>
      <div>
        <h1>Last 15 days Load Info</h1>
        <TableContainer component={Paper} style={{ maxHeight: 'none', overflow: 'auto' }}>
          <Table aria-label="your table">
            <TableHead>
              <TableRow>
                {tableData.length > 0 &&
                  tableData[0].map((header, index) => (
                    <TableCell key={`header-${index}`} align="center">
                      {header}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.slice(1).map((row, rowIndex) => (
                <TableRow key={`row-${rowIndex}`}>
                  {row.map((cellData, colIndex) => (
                    <TableCell key={`cell-${rowIndex}-${colIndex}`} align="center">
                      {cellData}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default Consumer;