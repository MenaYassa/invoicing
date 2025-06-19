// File: components/datagrid/FilterRow.tsx

'use client';

import { useState } from 'react';

// Define the props this component will accept
interface FilterRowProps {
  columns: string[];
  onApplyFilters: (filters: { [key: string]: string }) => void;
  onResetFilters: () => void;
}

export default function FilterRow({ columns, onApplyFilters, onResetFilters }: FilterRowProps) {
  // This component now has its own state to manage the input values
  const [filterValues, setFilterValues] = useState<{ [key: string]: string }>({});

  const handleInputChange = (columnName: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [columnName]: value }));
  };

  const handleApply = () => {
    // When "Apply" is clicked, pass the current filter values up to the parent page
    onApplyFilters(filterValues);
  };

  const handleReset = () => {
    setFilterValues({});
    onResetFilters();
  };

  return (
    <tr id="filterRow">
      {columns.map((columnName) => (
        <th key={columnName} className="p-1 bg-slate-50">
          <input
            type="text"
            placeholder={`Filter ${columnName}...`}
            value={filterValues[columnName] || ''}
            onChange={(e) => handleInputChange(columnName, e.target.value)}
            className="w-full px-2 py-1 border border-slate-300 rounded-md text-sm font-normal"
          />
        </th>
      ))}
      {/* Cells for the action buttons */}
      <th className="p-1 bg-slate-50 flex items-center gap-2">
        <button onClick={handleApply} className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Apply</button>
        <button onClick={handleReset} className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600">Reset</button>
      </th>
    </tr>
  );
}