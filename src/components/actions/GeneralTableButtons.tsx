// File: components/actions/GeneralTableButtons.tsx

interface GeneralTableButtonsProps {
  onAddNewRow: () => void;
  onSaveChanges: () => void; // Prop for the save handler
  isSaveDisabled: boolean;  // Prop to control the button's state
}

export default function GeneralTableButtons({ onAddNewRow, onSaveChanges, isSaveDisabled }: GeneralTableButtonsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button 
        id="saveChangesButton" 
        onClick={onSaveChanges} // Connect the onClick event
        disabled={isSaveDisabled} // Connect the disabled state
        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save Changes
      </button>
      <button 
        id="addNewRowButton" 
        onClick={onAddNewRow}
        className="px-6 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600"
      >
        Add New Row
      </button>
      <button id="deleteSelectedButton" className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 disabled:opacity-50" disabled>Delete Selected</button>
      <button id="manageColumnsButton" className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md shadow-md hover:bg-gray-600">Columns</button>
      <button id="refreshDataButton" className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md shadow-md hover:bg-gray-600">Refresh</button>
    </div>
  );
}