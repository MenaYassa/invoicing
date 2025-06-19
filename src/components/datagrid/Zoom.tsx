    export default function Zoom() {
  return (
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-700">Zoom:</span>
        <button id="zoomOutButton" className="px-3 py-1 border rounded-md ...">-</button>
        <span id="zoomLevel" className="px-3 w-16 text-center font-semibold text-slate-600">100%</span>
        <button id="zoomInButton" className="px-3 py-1 border rounded-md ...">+</button>
      </div>
  );
}
