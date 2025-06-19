// File: components/datagrid/TableFooter.tsx

import Pagination from "./Pagination";
import TableSummation from "./TableSummation";
import Zoom from "./Zoom";

interface TableFooterProps {
  totalLE: number;
  totalEuro: number;
  currentPage: number;
  rowsPerPage: number;
  totalRows: number;
  onPageChange: (newPage: number) => void;
}

export default function TableFooter({ totalLE, totalEuro, currentPage, totalRows, rowsPerPage, onPageChange }: TableFooterProps) {
  return (
    <div
      id="dataGridFooter"
      className="p-2 bg-slate-100 border-x border-b border-slate-300 rounded-b-md flex justify-between items-center text-sm"
    >
      <TableSummation totalLE={totalLE} totalEuro={totalEuro} />
      <Pagination
        currentPage={currentPage}
        totalRows={totalRows}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
      />
      <Zoom />
      {/* We can add the Zoom component here later if we decide to separate it */}
    </div>
  );
}
