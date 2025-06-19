// REPLACEMENT - The definitive, final version of app/page.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ActionBar from "@/components/actions/ActionBar";
import TableGrid from "@/components/datagrid/TableGrid";
import TableFooter from "@/components/datagrid/TableFooter";
import LoginModal from '@/components/auth/LoginModal';

// Define the structure of our state history snapshots
type TableRow = Record<string, string | number | boolean | null>;
type TableDataState = TableRow[];


// Define the shape of objects for the update payload
interface UpdatePayload {
  pkValue: string;
  changes: { [key: string]: unknown };
}

interface SortConfig {
    column: string;
    direction: 'asc' | 'desc';
}

export default function Home() {
// REPLACEMENT for the state management block

// --- STATE MANAGEMENT ---
const [session, setSession] = useState<Session | null>(null);
const [appIsLoading, setAppIsLoading] = useState(true);

const [tableData, setTableData] = useState<TableDataState>([]);
const [originalTableData, setOriginalTableData] = useState<TableDataState>([]);
const [columns, setColumns] = useState<string[]>([]);
const [primaryKey, setPrimaryKey] = useState<string>('Item_Code');
const [currentSchema, setCurrentSchema] = useState('');
const [currentTable, setCurrentTable] = useState('');
const [isLoadingData, setIsLoadingData] = useState(false);
const [aggregates, setAggregates] = useState({ total_le: 0, total_euro: 0 });
const [pagination, setPagination] = useState({ currentPage: 1, totalRows: 0, rowsPerPage: 50 });

const [undoStack, setUndoStack] = useState<TableDataState[]>([]);
const [redoStack, setRedoStack] = useState<TableDataState[]>([]);

const [sortConfig, setSortConfig] = useState<SortConfig>({ column: 'Item_Code', direction: 'asc' });
const [filters, setFilters] = useState<{ [key: string]: string }>({});
  
  // --- AUTHENTICATION & SESSION ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAppIsLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // --- HELPER FUNCTIONS ---
  const hasUnsavedChanges = () => {
    if (!tableData || !originalTableData) return false;
    return JSON.stringify(tableData) !== JSON.stringify(originalTableData);
  };
  

  
  // --- DATA & ACTION HANDLERS ---
// REPLACEMENT for the loadTableData function

const loadTableData = useCallback(async () => {
    // This function now reads its parameters from state, so it takes no arguments.
    if (!currentSchema || !currentTable) return;
    setIsLoadingData(true);

try {
    const filterQuery = encodeURIComponent(JSON.stringify(filters));
    const dataUrl = `/api/data/${currentSchema}/${currentTable}?page=${pagination.currentPage}&limit=${pagination.rowsPerPage}&sortBy=${sortConfig.column}&sortOrder=${sortConfig.direction}&filters=${filterQuery}`;
    const aggregatesUrl = `/api/aggregates/${currentSchema}/${currentTable}`;

    // Use Promise.all to make both network requests concurrently for better performance.
    const [dataResponse, aggregatesResponse] = await Promise.all([
        fetch(dataUrl),
        fetch(aggregatesUrl)
    ]);

    // Check if both requests were successful.
    if (!dataResponse.ok) throw new Error('Failed to fetch table data');
    if (!aggregatesResponse.ok) throw new Error('Failed to fetch table aggregates');

    // Parse the JSON from both responses.
    const dataResult = await dataResponse.json();
    const aggregatesResult = await aggregatesResponse.json();
    
    // Now, update all the state variables with the new data.
    const loadedData = (dataResult.data || []).map((row: TableRow) => ({ ...row, _isSelected: false }));
    
    if (loadedData.length > 0) {
        setColumns(Object.keys(loadedData[0]).filter(key => !key.startsWith('_')));
    } else {
        setColumns([]);
    }
    
    setTableData(loadedData);
    setOriginalTableData(JSON.parse(JSON.stringify(loadedData)));
    setPagination(prev => ({ ...prev, totalRows: dataResult.total_rows || 0, currentPage: dataResult.page_number || 1 }));
    setAggregates(aggregatesResult); // This will now update the footer totals.

} catch (error) {
        console.error("Failed to load table data:", error);
    } finally {
        setIsLoadingData(false);
    }
}, [currentSchema, currentTable, pagination.currentPage, pagination.rowsPerPage, sortConfig, filters]);


    useEffect(() => {
    // This effect runs whenever loadTableData is called (e.g., from the sidebar)
    // or when its dependencies (like sortConfig) change.
    loadTableData();
  }, [loadTableData]);


  // --- Handlers ---

  // --- Table Select Handler ---
    const handleTableSelect = (schemaName: string, tableName: string) => {
    setUndoStack([]);
    setRedoStack([]);
    setFilters({});
    setSortConfig({ column: 'Item_Code', direction: 'asc' });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    setCurrentSchema(schemaName);
    setCurrentTable(tableName);
  };

  // --- Pagination Handler ---
  const handlePageChange = (newPage: number) => {
    const totalPages = Math.ceil(pagination.totalRows / pagination.rowsPerPage);
    // Add boundary checks
    if (newPage >= 1 && newPage <= totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
      // The useEffect hook will automatically re-fetch the data for the new page
    }
  };

    // --- Filter Handlers ---
  const handleApplyFilters = (newFilters: { [key: string]: string }) => {
    // When applying filters, always reset to the first page
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    setFilters({});
  };


    // --- Sorting Handler ---
  const handleSort = (columnName: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.column === columnName && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ column: columnName, direction: direction });
  };


  const saveStateForUndo = () => {
    const newUndoStack = [...undoStack, JSON.parse(JSON.stringify(tableData))];
    if (newUndoStack.length > 50) newUndoStack.shift();
    setUndoStack(newUndoStack);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const newUndoStack = [...undoStack];
    const lastState = newUndoStack.pop();
    
    if (lastState) {
      setRedoStack([...redoStack, JSON.parse(JSON.stringify(tableData))]);
      setTableData(lastState);
      setUndoStack(newUndoStack);
    }
  };
    const handleRedo = () => {
    if (redoStack.length === 0) return;
    const newRedoStack = [...redoStack];
    const nextState = newRedoStack.pop();

    if (nextState) {
      setUndoStack([...undoStack, JSON.parse(JSON.stringify(tableData))]);
      setTableData(nextState);
      setRedoStack(newRedoStack);
    }
  };

  const handleAddNewRow = () => {
    saveStateForUndo();
    const newRow: TableRow = { _isNew: true, _tempId: `new_${Date.now()}`, _isSelected: false };
    columns.forEach(colName => {
      if (!newRow[colName]) newRow[colName] = null;
    });
    setTableData(prevData => [...prevData, newRow]);
  };

  const handleCellEdit = (rowIndex: number, columnName: string, newValue: unknown) => {
    const originalValue = tableData[rowIndex][columnName];
    const numericColumns = ["BOQ_Qty", "Unit_Price_LE", "Unit_Price_Euro", "Previous_Qty", "Cumulative_Qty"];
    let valueForComparison = newValue;
    if (numericColumns.includes(columnName)) {
      valueForComparison = String(newValue).replace(/,/g, '');
    }
    if (valueForComparison === String(originalValue ?? '')) return;

    saveStateForUndo();
    const newData = [...tableData];
    const newRow = { ...newData[rowIndex] };
    let finalValue = newValue;
    if (numericColumns.includes(columnName)) {
      const parsedNum = parseFloat(String(newValue).replace(/,/g, ''));
      finalValue = isNaN(parsedNum) ? null : parsedNum;
    }
    
    newRow[columnName] = finalValue as string | number | boolean | null;
    newData[rowIndex] = newRow;
    setTableData(newData);
  };

// REPLACEMENT for the handleSaveChanges function

const handleSaveChanges = async () => {
    // Define the type for the updates array to fix the TypeScript error
    const updates: UpdatePayload[] = [];
    
    const changedRows = tableData.filter(row => 
        !row._isNew && 
        JSON.stringify(row) !== JSON.stringify(originalTableData.find(orig => orig[primaryKey] === row[primaryKey]))
    );
    const newRows = tableData.filter(row => row._isNew);

    changedRows.forEach(row => {
        const originalRow = originalTableData.find(orig => orig[primaryKey] === row[primaryKey]);
        const changes: { [key: string]: any } = {};
        columns.forEach(col => {
            if (originalRow && row[col] !== originalRow[col]) {
                changes[col] = row[col];
            }
        });
        if(Object.keys(changes).length > 0) {
            updates.push({ pkValue: String(row[primaryKey]), changes: changes });
        }
    });

    if (newRows.length === 0 && updates.length === 0) {
      alert("No changes to save.");
      return;
    }

    // Use the state variables for schema, table, and PK, not hardcoded strings
    const payload = {
      schemaName: currentSchema,
      tableName: currentTable,
      primaryKey: primaryKey,
      inserts: newRows,
      updates: updates,
      deletes: []
    };

    try {
      const token = session?.access_token;
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "An unknown error occurred during save.");
      }
      alert("Changes saved successfully!");
      // Call loadTableData with no arguments to reload the current view
      loadTableData();
    } catch (error: any) {
      alert(`Save failed: ${error.message}`);
    }
};

  const handleLogout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  // --- RENDER LOGIC ---
  if (appIsLoading) {
    return <p className="p-4 text-center">Loading Application...</p>;
  }

  if (!session) {
    return <LoginModal />;
  }
  
// REPLACEMENT for the final return block

return (
    <div id="mainContainer" className="flex flex-col h-screen">
      <Header user={session.user} onLogout={handleLogout} />
      <main className="flex flex-grow overflow-hidden">
        {/* CORRECTED: Pass the correct handler function to the Sidebar */}
        <Sidebar onTableLoad={handleTableSelect} />
        <div className="main-content-area flex-grow p-4 bg-white flex flex-col gap-4">
          <ActionBar 
            onSaveChanges={handleSaveChanges}
            onAddNewRow={handleAddNewRow}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={undoStack.length > 0}
            canRedo={redoStack.length > 0}
            isSaveDisabled={!hasUnsavedChanges()}
          />
          <div className="flex-grow flex flex-col min-h-0">
            {isLoadingData ? (
              <div className="flex-grow flex items-center justify-center">Loading data...</div>
            ) : (
              <>
                <TableGrid 
                  columns={columns} 
                  data={tableData}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  onApplyFilters={handleApplyFilters}
                  onResetFilters={handleResetFilters}
                  onCellEdit={handleCellEdit}
                  lockedColumns={['Monthly_Qty', 'Total_Price_LE', 'Total_Price_Euro']}
                  primaryKeyColumns={[primaryKey]}
                />
                <TableFooter 
                  totalLE={aggregates.total_le} 
                  totalEuro={aggregates.total_euro}
                  currentPage={pagination.currentPage}
                  rowsPerPage={pagination.rowsPerPage}
                  totalRows={pagination.totalRows}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
);
}