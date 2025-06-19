// File: components/datagrid/FilterRow.tsx

// Define the props that this component will accept
interface FilterRowProps {
  columns: string[]; // An array of column names
}

export default function FilterRow({ columns }: FilterRowProps) {
  return (
    <tr id="filterRow">
      {columns.map((columnName) => (
        <th key={columnName} className="p-1 bg-slate-50">
          <input
            type="text"
            placeholder={`Filter ${columnName}...`}
            className="w-full px-2 py-1 border border-slate-300 rounded-md text-sm font-normal"
            disabled // The filters will be disabled for now
          />
        </th>
      ))}
      {/* A blank cell for the scrollbar column if needed */}
      <th className="p-1 bg-slate-50"></th>
    </tr>
  );
}