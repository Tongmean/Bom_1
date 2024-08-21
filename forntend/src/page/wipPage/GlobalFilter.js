import React from 'react';

export const GlobalFilter = ({ filter, setFilter }) => {
  return (
    <span>
      Search:{' '}
      <input
        value={filter || ''}
        onChange={e => setFilter(e.target.value)}
        placeholder="Search all columns..."
        style={{ marginBottom: '10px', padding: '5px' }}
      />
    </span>
  );
};
