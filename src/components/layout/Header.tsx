// File: components/layout/Header.tsx

'use client';

import { User } from "@supabase/supabase-js";

// Define the types for the props this component will receive
interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center z-[1000] relative">
      <h1 className="text-2xl font-bold text-slate-800">
        Vinci Construction Invoicing System
      </h1>
      <div className="flex items-center space-x-4">
        {/* Display the user's email if they are logged in */}
        {user && (
          <span
            id="currentUserDisplay"
            className="text-sm font-medium text-slate-600"
          >
            {user.email}
          </span>
        )}
        <button
          id="logoutButton"
          onClick={onLogout} // Attach the logout handler
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}