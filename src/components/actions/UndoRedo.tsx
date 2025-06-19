// File: components/actions/UndoRedo.tsx

'use client';

// Define the "props" this component will accept from its parent
interface UndoRedoProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export default function UndoRedo({ canUndo, canRedo, onUndo, onRedo }: UndoRedoProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        id="undoButton"
        title="Undo (Ctrl+Z)"
        onClick={onUndo}
        disabled={!canUndo}
        className="px-4 py-2 bg-gray-200 text-slate-700 font-semibold rounded-md shadow-sm hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i className="fas fa-undo mr-2"></i>
        <span>Undo</span>
      </button>
      <button
        id="redoButton"
        title="Redo (Ctrl+Y)"
        onClick={onRedo}
        disabled={!canRedo}
        className="px-4 py-2 bg-gray-200 text-slate-700 font-semibold rounded-md shadow-sm hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i className="fas fa-redo mr-2"></i>
        <span>Redo</span>
      </button>
    </div>
  );
}