// File: components/datagrid/Pagination.tsx

interface PaginationProps {
  currentPage: number;
  rowsPerPage: number;
  totalRows: number;
  // onPageChange: (page: number) => void; // Assuming we'll add this later for actual pagination
}

export default function Pagination({
  currentPage,
  rowsPerPage,
  totalRows,
}: PaginationProps) {
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  return (
    <div className="flex items-center gap-2">
      <button
        id="prevPageButton"
        className="px-3 py-1 border rounded-md bg-white hover:bg-slate-50 disabled:opacity-50"
        disabled={currentPage === 1}
      >
        {'<'} Previous
      </button>
      <span id="pageInfo" className="px-3 font-semibold text-slate-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        id="nextPageButton"
        className="px-3 py-1 border rounded-md bg-white hover:bg-slate-50 disabled:opacity-50"
        disabled={currentPage === totalPages || totalPages === 0}
      >
        Next {'>'}
      </button>
    </div>
  );
}
