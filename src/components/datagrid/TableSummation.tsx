// File: components/datagrid/TableSummation.tsx

interface TableSummationProps {
  totalLE: number;
  totalEuro: number;
}

export default function TableSummation({ totalLE, totalEuro }: TableSummationProps) {
  return (
    <div className="flex items-center gap-4 font-semibold text-slate-700">
      <span>
        Total Price LE: <span className="text-blue-600">{totalLE.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </span>
      <span>
        Total Price Euro: <span className="text-green-700">{totalEuro.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </span>
    </div>
  );
}
