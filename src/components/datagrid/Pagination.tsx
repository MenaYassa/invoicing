// File: components/datagrid/Pagination.tsx

'use client';

import { useState, useEffect } from 'react';

// Define the props this component accepts
interface PaginationProps {
  currentPage: number;
  totalRows: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
}

export default function Pagination({ currentPage, totalRows, rowsPerPage, onPageChange }: PaginationProps) {
  // The component now has its own state to manage the text in the input box
  const [jumpToPage, setJumpToPage] = useState(String(currentPage));
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  // This effect keeps the input box in sync if the page changes from the parent
  useEffect(() => {
    setJumpToPage(String(currentPage));
  }, [currentPage]);

  const handleJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const pageNumber = parseInt(jumpToPage, 10);
      if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
        onPageChange(pageNumber);
      } else {
        // Reset to current page if input is invalid
        setJumpToPage(String(currentPage));
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage <= 1}
        className="px-3 py-1 border rounded-md bg-white hover:bg-slate-50 disabled:opacity-50"
      >
        &lt; Previous
      </button>
      <span className="px-3 font-semibold text-slate-600">
        Page
        <input 
          type="text" 
          value={jumpToPage}
          onChange={(e) => setJumpToPage(e.target.value)}
          onKeyDown={handleJump}
          className="w-12 mx-2 text-center border border-slate-300 rounded-md"
        />
        of {totalPages}
      </span>
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage >= totalPages}
        className="px-3 py-1 border rounded-md bg-white hover:bg-slate-50 disabled:opacity-50"
      >
        Next &gt;
      </button>
    </div>
  );
}