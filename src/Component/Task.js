import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Plot from 'react-plotly.js';
import Pagination from './Pagination';

const Task = () => {
  // create State
  const [data, setData] = useState([]);
  const [checkRow, setcheckRow] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchData, setsearchData] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchData, data]);

  // Fetch data using axios
  const fetchData = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      if (Array.isArray(response.data)) {
        setData(response.data);
      } else if (response.data && Array.isArray(response.data.products)) {
        setData(response.data.products);
      } else {
        console.error('Data format is not as expected:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlebox = (id) => {
    let checkingRows = [...checkRow];
    if (checkingRows.includes(id)) {
      checkingRows = checkingRows.filter((rowId) => rowId !== id);
    } else {
      checkingRows.push(id);
    }
    setcheckRow(checkingRows);
  };

  const handleSearch = (e) => {
    setsearchData(e.target.value);
    setCurrentPage(1);
  };

  const filterData = () => {
    const filtered = data.filter((row) =>
      Object.values(row).some(
        (value) =>
          typeof value === 'string' && value.toLowerCase().includes(searchData.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  useEffect(() => {
    filterData();
  }, [searchData, data]);

  const lastRow = currentPage * rowsPerPage;
  const firstRow = lastRow - rowsPerPage;
  const currentRow = filteredData.slice(firstRow, lastRow);

  const page = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <input type="text" value={searchData} onChange={handleSearch} placeholder="Search" className="form-control mb-2" />
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th>Check</th>
            <th>User Id</th>
            <th>ID</th>
            <th>Value 1</th>
            <th>Value 2</th>
          </tr>
        </thead>
        <tbody>
          {currentRow.map((row) => (
            <tr key={row.id}>
              <td>
                <input
                  type="checkbox"
                  checked={checkRow.includes(row.id)}
                  onChange={() => handlebox(row.id)}
                />
              </td>
              <td>{row.userId}</td>
              <td>{row.id}</td>
              <td>{row.title}</td>
              <td>{row.body}</td>

            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        rowsPerPage={rowsPerPage}
        totalRows={filteredData.length}
        page={page}
        currentPage={currentPage}
      />
      <div>

        <Plot
          data={[
            {
              x: checkRow.map((id) => data.find((row) => row.id === id).title), // Change 'name' to 'title'
              y: checkRow.map((id) => data.find((row) => row.id === id).id), // Change 'value1' to 'id'
              type: 'bar',
            },
          ]}
          layout={{ width: 800, height: 400, title: 'Bar Chart' }}
        />

      </div>

      <Pagination />
    </div>
  );
};

export default Task;



