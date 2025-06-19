// REPLACEMENT - The definitive, fully interactive TableGrid component.

'use client';

import FilterRow from './FilterRow';

// Define the shape of the sortConfig object
interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

// Define the props this component accepts
type TableRow = Record<string, string | number | boolean | null>;

interface TableGridProps {
  columns: string[];
  data: TableRow[];
  sortConfig: SortConfig;
  primaryKeyColumns: string[];
  lockedColumns: string[];
  onSort: (columnName: string) => void;
  onApplyFilters: (filters: { [key: string]: string }) => void;
  onResetFilters: () => void;
  onCellEdit: (rowIndex: number, columnId: string, value: string | number | boolean | null) => void;
}


export default function TableGrid({
  columns,
  data,
  sortConfig,
  primaryKeyColumns,
  lockedColumns,
  onSort,
  onApplyFilters,
  onResetFilters,
  onCellEdit
}: TableGridProps) {
  
  // This helper function determines which CSS class to apply for the sort arrow
  const getSortClass = (columnName: string) => {
    if (sortConfig.column !== columnName) {
      return ''; // No sorting on this column
    }
    return sortConfig.direction === 'asc' ? 'sort-asc' : 'sort-desc';
  };

  const handleCellBlur = (event: React.FocusEvent<HTMLTableCellElement>, rowIndex: number, columnId: string) => {
    onCellEdit(rowIndex, columnId, event.currentTarget.textContent);
  };

  if (columns.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center text-slate-500">
        <p>Select and load a table to view data.</p>
      </div>
    )
  }

  return (
    <div className="data-grid-container flex-grow overflow-auto border border-slate-300 rounded-t-md shadow-lg">
      <table id="dataGrid" className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-20">
          <tr>
            {/* The checkbox header for selection */}
            <th className="w-12 text-center px-6 py-3">
              <input type="checkbox" id="selectAllCheckbox" />
            </th>
            {columns.map((columnName) => (
              <th
                key={columnName}
                scope="col"
                // --- THIS IS THE FIX ---
                // The onClick and className are now correctly used here
                className={`px-6 py-3 sortable-header ${getSortClass(columnName)}`}
                onClick={() => onSort(columnName)}
              >
                {columnName.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
          <FilterRow
            columns={columns}
            onApplyFilters={onApplyFilters}
            onResetFilters={onResetFilters}
          />
        </thead>
<tbody>
  {data.length > 0 ? (
    data.map((row, rowIndex) => (
      <tr key={`${row[primaryKeyColumns[0]] ?? row._tempId}`} className={row._isNew ? 'bg-green-50' : ''}>
        <td className="text-center">
          <input
            type="checkbox"
            className="row-selector-checkbox"
            data-row-id={row[primaryKeyColumns[0]] ?? row._tempId}
            defaultChecked={Boolean(row._isSelected)}
          />
        </td>
        {columns.map(colName => {
          const isLocked = lockedColumns.includes(colName);
          const isPK = primaryKeyColumns.includes(colName);
          const isEditable = !isLocked && !(isPK && !row._isNew);

          return (
            <td
              key={colName}
              className={`px-6 py-4 border-b border-slate-200 ${!isEditable ? 'bg-slate-100 text-slate-500' : 'bg-white'}`}
              contentEditable={isEditable}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleCellBlur(e, rowIndex, colName)}
            >
              {String(row[colName] ?? '')}
            </td>
          );
        })}
      </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="text-center p-8 text-slate-500">
                No data found. You can add a new row using the button above.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}