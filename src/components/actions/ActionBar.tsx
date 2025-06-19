// File: components/actions/ActionBar.tsx

import GeneralTableButtons from "./GeneralTableButtons";
import NextInvoiceButtons from "./NextInvoiceButtons";
import UndoRedo from "./UndoRedo";

interface ActionBarProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onAddNewRow: () => void;
  onSaveChanges: () => void;    // Add new prop
  isSaveDisabled: boolean;     // Add new prop
}

export default function ActionBar({ 
  onUndo, onRedo, canUndo, canRedo, 
  onAddNewRow, onSaveChanges, isSaveDisabled 
}: ActionBarProps) {
  return (
    <div id="dataGridHeader" className="p-4 bg-slate-50 border border-slate-300 rounded-t-md flex justify-between items-center gap-4 flex-wrap">
      <GeneralTableButtons 
        onAddNewRow={onAddNewRow}
        onSaveChanges={onSaveChanges}
        isSaveDisabled={isSaveDisabled}
      />
      <NextInvoiceButtons />
      <UndoRedo 
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
    </div>
  );
}