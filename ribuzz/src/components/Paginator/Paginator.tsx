import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Paginator: React.FC<PaginatorProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  // Genera los números de página a mostrar
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center space-x-4 mt-4">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-600 text-gray-50 hover:filter hover:bg-white transition duration-300 p-2 disabled:opacity-50 hover:scale-110"
      >
        <FaChevronLeft className='hover:scale-110 transition duration-300' />
      </button>
      
      {/* Botones de número de página */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`px-3 py-1 rounded-lg text-white transition duration-300 hover:scale-110 ${
            page === currentPage
              ? 'bg-cyan-400'
              : 'bg-cyan-600 hover:bg-cyan-500'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-600 text-gray-50 hover:filter hover:bg-white transition duration-300 p-2 disabled:opacity-50 hover:scale-110"
      >
        <FaChevronRight className='hover:scale-110 transition duration-300' />
      </button>
    </div>
  );
};

export default Paginator;
