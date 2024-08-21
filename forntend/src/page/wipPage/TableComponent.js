import React, { useState } from 'react';
import { useTable, useFilters, usePagination } from 'react-table';
import { useExportToExcel } from './useExportToExcel';

// Default filter UI for each column
const DefaultColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter } }) => {
  return (
    <input
      value={filterValue || ''}
      onChange={e => setFilter(e.target.value || undefined)}
      placeholder={`Search ${preFilteredRows.length} records...`}
      style={{ width: '100%', padding: '5px' }}
    />
  );
};

const TableComponent = ({ columns, data }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  // Use useTable, useFilters, and usePagination hooks from react-table
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page, // Instead of rows, we'll use page, which contains only the rows for the active page
    prepareRow,
    setFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: { pageIndex: 0, pageSize: 50 }, // Start on page 0, show 50 rows per page
    },
    useFilters, // Use the useFilters hook for individual column filters
    usePagination // Use the usePagination hook to manage pagination
  );

  const exportToExcel = useExportToExcel();

  const handleCheckboxClick = (row) => {
    const isSelected = selectedRows.some(selectedRow => selectedRow.id === row.id);
    if (isSelected) {
      setSelectedRows(selectedRows.filter(selectedRow => selectedRow.id !== row.id));
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  };

  return (
    <div>
      <table {...getTableProps()} className='table table-hover'>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              <th>Select</th>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} scope='col'>
                  {column.render('Header')}
                  {/* Render the filter UI for each column */}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => { // Only render rows for the current page
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.some(selectedRow => selectedRow.id === row.id)}
                    onChange={() => handleCheckboxClick(row)}
                  />
                </td>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50, 100].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      <button onClick={() => exportToExcel(selectedRows, 'SelectedRows.xlsx')} disabled={!selectedRows.length}>
        Export Selected Rows to Excel
      </button>
    </div>
  );
};

export default TableComponent;
