import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the server
    axios.get('http://localhost:3030/api/bom/')
      .then((response) => {
        setData(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  return (
    <div>
      <h1>Fetched Data</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.Code_Fg}: {item.Name_Fg}</li>
        ))}
      </ul>
    </div>
  );
};

export default DataComponent;
