// File: components/layout/Sidebar.tsx

'use client'; // This component is now interactive

import { useState, useEffect } from 'react';

// Define the props this component accepts
interface SidebarProps {
  onTableLoad: (schemaName: string, tableName: string) => void;
}

// Define the structure of a table object
interface Table {
  table_name: string;
}

export default function Sidebar({ onTableLoad }: SidebarProps) {
  const APP_ACCESSIBLE_SCHEMAS = ['Presented', 'Accepted', 'PresentedToNAT', 'BOQ'];
  
  // State variables to manage the UI
  const [selectedSchema, setSelectedSchema] = useState('');
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // This effect runs whenever the user selects a new schema
 useEffect(() => {
    if (!selectedSchema) {
      setTables([]);
      setSelectedTable('');
      return;
    }

    const fetchTables = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/tables/${selectedSchema}`);
        if (!response.ok) throw new Error('Failed to fetch tables.');
        const data: Table[] = await response.json();
        setTables(data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        setTables([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTables();
  }, [selectedSchema]); // The dependency array ensures this runs when selectedSchema changes

  const handleLoadClick = () => {
    if (!selectedSchema || !selectedTable) return;
    // In the next phase, this will trigger the data grid to load.
    onTableLoad(selectedSchema, selectedTable);
  };

  return (
    <aside
      id="tableOperationsSection"
      className="bg-slate-100 p-4 border-r border-slate-200 flex flex-col space-y-4"
      style={{ minWidth: '300px' }}
    >
      {/* Schema Selection */}
      <div>
        <label htmlFor="schemaSelector" className="block text-sm font-bold text-slate-700 mb-1">
          1. Select Schema
        </label>
        <select
          id="schemaSelector"
          value={selectedSchema}
          onChange={(e) => setSelectedSchema(e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-md shadow-sm"
        >
          <option value="">-- Select a schema --</option>
          {APP_ACCESSIBLE_SCHEMAS.map((schema) => (
            <option key={schema} value={schema}>{schema}</option>
          ))}
        </select>
      </div>

      {/* Table Selection */}
      <div>
        <label htmlFor="tableSelector" className="block text-sm font-bold text-slate-700 mb-1">
          2. Select Table
        </label>
        <select
          id="tableSelector"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-md shadow-sm"
          disabled={isLoading || !selectedSchema}
        >
          {isLoading ? (
            <option>Loading...</option>
          ) : (
            <>
              <option value="">-- Select a table --</option>
              {tables.map((table) => (
                <option key={table.table_name} value={table.table_name}>
                  {table.table_name}
                </option>
              ))}
            </>
          )}
        </select>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Load Button */}
      <div>
        <button
          id="loadSelectedTableButton"
          onClick={handleLoadClick}
          className="w-full py-3 bg-indigo-600 text-white font-bold rounded-md shadow-lg hover:bg-indigo-700 disabled:bg-slate-400"
          disabled={!selectedTable}
        >
          Load Selected Table
        </button>
      </div>
    </aside>
  );
}