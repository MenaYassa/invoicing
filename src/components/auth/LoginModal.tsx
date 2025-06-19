// File: components/auth/LoginModal.tsx

'use client'; // This marks the component as a Client Component

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function LoginModal() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }
    // On successful login, the onAuthStateChange listener on the main page will handle the UI update.
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-200 z-[2000] flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
          Vinci Construction <br /> Invoicing System
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="emailInput"
              className="block text-slate-700 font-semibold mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="emailInput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="passwordInput"
              className="block text-slate-700 font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="passwordInput"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            id="loginButton"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition duration-150 disabled:bg-slate-400"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
          {error && (
            <p className="text-red-500 text-sm text-center mt-4">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}