import React from 'react';

const Pagination = ({ rowsPerPage, totalRows, page, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalRows / rowsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <ul className="pagination">
      {pageNumbers.map((number) => (
        <li key={number} className={number === currentPage ? 'page-item active' : 'page-item'}>
          <a onClick={() => page(number)} href="!#" className="page-link">
            {number}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Pagination;
