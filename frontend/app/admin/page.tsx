"use client";

import React, { useState } from 'react';
import { login } from '@/app/lib/api';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) router.push('/admin/dashboard');
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await login(username, password);
      localStorage.setItem('admin_token', token);
      router.push('/admin/dashboard');
    } catch {
      setError('Invalid credentials. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-void flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-nebula-purple/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-[300px] h-[300px] bg-nebula-blue/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-nebula-pink/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-linear-to-br from-nebula-purple/15 to-nebula-blue/15 flex items-center justify-center border border-nebula-purple/10">
            <span className="text-3xl">🛸</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-starlight mb-2">
            Mission Control
          </h1>
          <p className="text-stardust-light text-sm">
            Authenticate to access the command center
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
          {error && (
            <div className="bg-rose/8 border border-rose/20 text-rose px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
              </svg>
              {error}
            </div>
          )}

          <div>
            <label className="block text-stardust-light text-xs font-heading tracking-wider uppercase mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="admin-input !py-3"
              placeholder="Enter username..."
              required
            />
          </div>

          <div>
            <label className="block text-stardust-light text-xs font-heading tracking-wider uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input !py-3"
              placeholder="Enter access code..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="medieval-btn w-full text-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Launch Mission Control'}
          </button>
        </form>

        <p className="text-center text-stardust-light/20 text-[10px] font-heading tracking-widest uppercase mt-6">
          Authorized personnel only
        </p>
      </div>
    </main>
  );
}
