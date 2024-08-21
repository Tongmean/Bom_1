import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // AG Grid CSS
import 'ag-grid-community/styles/ag-theme-alpine.css'; // AG Grid theme
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const AgGridTableWip = () => {
    // Define column definitions with initial fields and search feature
    const columnDefs = [
        {
            headerName: 'NO.',
            field: 'No',
            filter: 'agTextColumnFilter', // Enable text filter for this column
            checkboxSelection: true, // Add checkboxes to select rows
            headerCheckboxSelection: true, // Checkbox for selecting all rows
        },
        {
            headerName: 'Code_Fg',
            field: 'Code_Fg',              // Mapping field must exact value
            filter: 'agTextColumnFilter', // Enable number filter for this column
        },
        {
            headerName: 'Name_Fg',
            field: 'Name_Fg',
            filter: 'agTextColumnFilter', // Enable text filter for this column
        },
        {
            headerName: 'Code_Dr',
            field: 'Code_Dr',
            filter: 'agTextColumnFilter', // Enable text filter for this column
        },
        {
            headerName: 'Name_Dr',
            field: 'Name_Dr',
            filter: 'agTextColumnFilter', // Enable text filter for this column
        },
        {
            headerName: 'Code_Wip',
            field: 'Code_Wip',
            filter: 'agTextColumnFilter', // Enable text filter for this column
        },
        {
            headerName: 'Name_Wip',
            field: 'Name_Wip',
            filter: 'agTextColumnFilter', // Enable text filter for this column
        },
        {
            headerName: 'Remark',
            field: 'Remark',
            filter: 'agTextColumnFilter', // Enable text filter for this column
        },
    ];
    // Define the initial row data (sample data)
    const [rowData, setRowData] = useState();
    //Loading page
    const [loading, setLoading] = useState(false);
    // AG Grid API and column API references for programmatic control
    const [gridApi, setGridApi] = useState(null);
    // const [gridColumnApi, setGridColumnApi] = useState(null);
    // Function to handle fetching data from an API
    const fetchData = async () => {
        try {
            // Simulate fetching data from an API
            const response = await fetch('http://localhost:3030/api/bom/'); // Replace with your actual API endpoint
            const apiData = await response.json();
    
            // Map API data fields to match table columns
            const mappedData = apiData.map(item => ({
                No: item.id,          // Assuming the API returns 'fullName' instead of 'name'
                Code_Fg: item.Code_Fg,            // Assuming the API returns 'userAge' instead of 'age'
                Name_Fg: item.Name_Fg,     // Assuming the API returns 'emailAddress' instead of 'email'
                Code_Dr: item.Code_Dr,           // Assuming the API returns 'userAge' instead of 'age'
                Name_Dr: item.Name_Dr,     // Assuming the API returns 'emailAddress' instead of 'email'
                Code_Wip: item.Code_Wip,            // Assuming the API returns 'userAge' instead of 'age'
                Name_Wip: item.Name_Wip,     // Assuming the API returns 'emailAddress' instead of 'email'
                Remark: item.Remark,     // Assuming the API returns 'emailAddress' instead of 'email'
             
                // Add more mappings if necessary based on your table columns and API response
            }));
    
            // Update the table data with the mapped data
            setRowData(mappedData);
    
        } catch (error) {
            console.error("Error fetching data from API:", error);
        } finally {
            setLoading(false); // Set loading to false after fetching data
        }
    };

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
                Code_Fg: 'Code_Fg',
                Name_Fg: 'Name_Fg',
                Code_Dr: 'Code_Dr',
                Name_Dr: 'Name_Dr',
                Code_Wip: 'Code_Wip',
                Name_Wip: 'Name_Wip',
                Remark: 'Remark'
            };
            // Map data to custom headers
            const mappedData = selectedRows.map(row => ({
                'Code_Fg': row.Code_Fg, // Adjust to match custom header
                'Name_Fg': row.Name_Fg, // Adjust to match custom header
                'Code_Dr': row.Code_Dr, // Adjust to match custom header
                'Name_Dr': row.Name_Dr, // Adjust to match custom header
                'Code_Wip': row.Code_Wip, // Adjust to match custom header
                'Name_Wip': row.Name_Wip, // Adjust to match custom header
                'Remark' : row.Remark
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
        // setGridColumnApi(params.columnApi);
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
            {/* Loading indicator */}
            {loading ? (
                <div>Loading data, please wait...</div> // You can replace this with a spinner or a more styled component
            ) : (
                <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                    <AgGridReact
                        columnDefs={columnDefs}
                        rowData={rowData}
                        rowSelection="multiple"
                        onGridReady={onGridReady}
                        domLayout='autoHeight'
                        pagination={true}
                        paginationPageSize={10}
                    />
                </div>
            )}
        
        </div>
    );
};

export default AgGridTableWip;
