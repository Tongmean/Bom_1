import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // AG Grid CSS
import 'ag-grid-community/styles/ag-theme-alpine.css'; // AG Grid theme
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const AgGridTable = () => {
    // Define column definitions with initial fields and search feature
    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: 'Name',
            field: 'name',
            filter: 'agTextColumnFilter', // Enable text filter for this column
            checkboxSelection: true, // Add checkboxes to select rows
            headerCheckboxSelection: true, // Checkbox for selecting all rows
        },
        {
            headerName: 'Code',
            field: 'code',
            filter: 'agTextColumnFilter', // Enable number filter for this column
        },
        {
            headerName: 'Email',
            field: 'email',
            filter: 'agTextColumnFilter', // Enable text filter for this column
        },
    ]);

    // Define the initial row data (sample data)
    const [rowData, setRowData] = useState([
        { name: 'John Doe', age: 28, email: 'john@example.com' },
        { name: 'Jane Smith', age: 34, email: 'jane@example.com' },
        { name: 'Sam Green', age: 22, email: 'sam@example.com' },
    ]);

    // AG Grid API and column API references for programmatic control
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);

    // Function to handle fetching data from an API
    const fetchData = async () => {
        try {
            // Simulate fetching data from an API
            const response = await fetch('http://localhost:3030/api/bom/'); // Replace with your actual API endpoint
            const apiData = await response.json();
    
            // Map API data fields to match table columns
            const mappedData = apiData.map(item => ({
                name: item.id,          // Assuming the API returns 'fullName' instead of 'name'
                code: item.Name_Wip,            // Assuming the API returns 'userAge' instead of 'age'
                email: item.Name_Dr,     // Assuming the API returns 'emailAddress' instead of 'email'
                // Add more mappings if necessary based on your table columns and API response
            }));
    
            // Update the table data with the mapped data
            setRowData(mappedData);
    
        } catch (error) {
            console.error("Error fetching data from API:", error);
        }
    };

    // // Simulated API fetch function
    // const fetchSampleData = async () => {
    //     return [
    //         { fullName: 'Alice Johnson', userAge: 30, emailAddress: 'alice@example.com' },
    //         { fullName: 'Bob Brown', userAge: 45, emailAddress: 'bob@example.com' },
    //     ];
    // };

    // Export selected rows to Excel file
    const exportToExcel = () => {
        try {
            // Ensure gridApi and getSelectedRows method are available
            if (!gridApi) {
                throw new Error("Grid API is not available.");
            }
    
            // Get the selected rows from the grid
            const selectedRows = gridApi.getSelectedRows();
    
            // Check if there are selected rows
            if (selectedRows.length === 0) {
                alert('No rows selected for export.');
                return;
            }
            
        // Define custom headers and map row data accordingly
            const customHeaders = {
                name: 'id',             
                code: 'Name_Wip',
                email: 'Name_Dr'
            };
            // Map data to custom headers
            const mappedData = selectedRows.map(row => ({
                'id': row.name, // Adjust to match custom header
                'Name_Wip': row.code, // Adjust to match custom header
                'Name_Dr': row.email // Adjust to match custom header
            }));

            // Convert the mapped data to a worksheet
            const worksheet = XLSX.utils.json_to_sheet(mappedData, { header: Object.values(customHeaders) });

            // Create a new workbook and append the worksheet
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'SelectedData');
    
            // Write the workbook to a buffer
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
            // Create a Blob from the buffer and trigger download
            const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(file, 'SelectedData.xlsx');
    
        } catch (error) {
            console.error("Error exporting data to Excel:", error);
        }
    };
    

    // Handle AG Grid ready event to store API references
    const onGridReady = params => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
    };

    // Example useEffect to fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div>
                <button onClick={exportToExcel} style={{ marginBottom: '10px' }}>
                    Export Selected Rows to Excel
                </button>
            </div>
            {/* AG Grid table container with scrolling enabled */}
            <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                <AgGridReact
                    columnDefs={columnDefs} // Define the columns
                    rowData={rowData} // Provide the row data
                    rowSelection="multiple" // Allow multiple row selection
                    onGridReady={onGridReady} // AG Grid ready callback
                    domLayout='autoHeight' // Enable automatic height adjustment
                    pagination={true} // Enable pagination if needed
                    paginationPageSize={10} // Set page size for pagination
                />
            </div>
         
    </div>
    );
};

export default AgGridTable;
