import React from 'react';

const Pagination = ({ entriesPerPage, totalEntries, currentPage, paginate }) => {
    const pageNumbers = [];

    // Calculate total number of pages
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    // Generate page numbers to display
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul style={{ display: 'flex', listStyle: 'none', padding: 0, margin: '20px 0' }}>
                {pageNumbers.map(number => (
                    <li key={number} style={{ marginRight: '10px' }} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                        <button onClick={() => paginate(number)} style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }} className="page-link">
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination;
