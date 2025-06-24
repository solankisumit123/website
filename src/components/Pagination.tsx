import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, className = '' }) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Generate page numbers with smart pagination (show max 5 pages)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart pagination for more than 5 pages
      if (currentPage <= 3) {
        // Show first 5 pages
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        // Show last 5 pages
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show current page and 2 pages on each side
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`pagination ${className}`} style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      marginTop: '100px'
    }}>
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn"
        style={{
          backgroundColor: currentPage === 1 ? '#666' : '#f1c40f',
          border: 'none',
          color: 'white',
          fontWeight: 'bold',
          padding: '15px 30px',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'background 0.3s',
          opacity: currentPage === 1 ? 0.5 : 1
        }}
        onMouseEnter={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.backgroundColor = '#d4ac0d';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.backgroundColor = '#f1c40f';
          }
        }}
      >
        PREVIOUS
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => handlePageChange(number)}
          className={`page-number ${currentPage === number ? 'active' : ''}`}
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: currentPage === number ? '#cfcfcf' : 'transparent',
            border: 'none',
            color: '#333',
            fontSize: '16px',
            cursor: currentPage === number ? 'default' : 'pointer',
            borderRadius: '4px',
            transition: 'background 0.3s'
          }}
          onMouseEnter={(e) => {
            if (currentPage !== number) {
              e.currentTarget.style.backgroundColor = '#dcdcdc';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== number) {
              e.currentTarget.style.backgroundColor = currentPage === number ? '#cfcfcf' : 'transparent';
            }
          }}
        >
          {number}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn"
        style={{
          backgroundColor: currentPage === totalPages ? '#666' : '#f1c40f',
          border: 'none',
          color: 'white',
          fontWeight: 'bold',
          padding: '15px 30px',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'background 0.3s',
          opacity: currentPage === totalPages ? 0.5 : 1
        }}
        onMouseEnter={(e) => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.backgroundColor = '#d4ac0d';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.backgroundColor = '#f1c40f';
          }
        }}
      >
        NEXT
      </button>
    </div>
  );
};

export default Pagination; 