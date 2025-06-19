// File: components/datagrid/TableGrid.tsx

import FilterRow from './FilterRow';

// Component now accepts real data
interface TableGridProps {
  columns: string[];
  data: any[];
  lockedColumns: string[]; // To know which cells to make read-only
  primaryKeyColumns: string[];
  onCellEdit: (rowIndex: number, columnId: string, value: any) => void;
}

export default function TableGrid({ columns, data, lockedColumns, primaryKeyColumns, onCellEdit }: TableGridProps) {

  const handleCellBlur = (event: React.FocusEvent<HTMLTableCellElement>, rowIndex: number, columnId: string) => {
    // When a cell loses focus, call the onCellEdit function passed from the parent
    onCellEdit(rowIndex, columnId, event.currentTarget.textContent);
  };  if (columns.length === 0) {
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
            {/* The headers are unchanged */}
            {columns.map((columnName) => (
              <th key={columnName} scope="col" className="px-6 py-3">{columnName.replace(/_/g, ' ')}</th>
            ))}
          </tr>
          {/* We will re-implement the filter row in a later step */}
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={row[primaryKeyColumns[0]] || row._tempId} className={row._isNew ? 'bg-green-50' : ''}>
                {columns.map((colName) => {
                  const isLocked = lockedColumns.includes(colName);
                  const isPK = primaryKeyColumns.includes(colName);
                  const isEditable = !isLocked && !(isPK && !row._isNew);

                  return (
                    <td
                      key={colName}
                      className={`px-6 py-4 border-b border-slate-200 ${!isEditable ? 'bg-slate-100 text-slate-500' : 'bg-white'}`}
                      contentEditable={isEditable}
                      suppressContentEditableWarning={true} // Suppresses React's warning for contentEditable
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
              <td colSpan={columns.length} className="text-center p-8 text-slate-500">
                No data found. You can add a new row using the button above.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}