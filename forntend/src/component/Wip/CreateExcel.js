// Import Data From Excel to database
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
const CreateExcel = () => {
    const [excelData, setExcelData] = useState([]);
    const [loading, setLoading] = useState(false);    
    // Function to handle file upload and reading the data
    const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    // When the file is successfully read
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });

      // Assume we're reading the first sheet
      const firstSheetName = workbook.SheetNames[0];
      let worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], { header: 1 });

      // Process headers (first row)
      const headers = worksheet[0];
      if (headers.length !== 7) {
        console.error('Header does not have exactly 7 columns.');
        alert('Chect Pettern Excel again !!!')
        return;
      }

      // Process data rows
      const dataFromSecondLine = worksheet.slice(1).map(row => {
      // Ensure each row has 7 columns
      const processedRow = row.slice(0, 7); // Truncate to 7 columns
        while (processedRow.length < 7) {
          processedRow.push("-"); // Add "-" for missing columns
        }

        // Replace any null, empty, or undefined values with "-"
        return processedRow.map(value => 
          value === "" || value === null || value === undefined ? "-" : value
        );
      });


      console.log('Processed Data:', dataFromSecondLine);
      setExcelData(dataFromSecondLine);
    };

    // Read the file as a binary string
    reader.readAsBinaryString(file);
  };

  // Function to send data to the backend
    const handleSubmit = () => {
        setLoading(true);
        axios.post('http://localhost:3030/api/bom/createExcel', excelData)
        .then(response => {
            alert('Data saved successfully');
            console.log('Data saved successfully', response.data);
            setLoading(false);  //Stop loading when data is successfully saved
        })
        .catch(error => {
            console.log('Error saving data', error);
        });
    };

  return (

        <div className="App">
            <div>
                <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                <div>
                <button onClick={handleSubmit} disabled={loading}>Upload and Save Data</button>
                </div>
            </div>
            {loading && <div className="loading">Loading...</div>}
        </div>
  );
};

export default CreateExcel;


//Set empty -->