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

    // Check if already logged in
    React.useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            router.push('/admin/dashboard');
        }
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
            setError('Invalid credentials. The castle gates remain sealed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-parchment-texture flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background accents */}
            <div className="absolute top-20 left-20 w-60 h-60 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-crimson/5 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <span className="text-5xl block mb-4">🏰</span>
                    <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-gold mb-2">
                        The Gatehouse
                    </h1>
                    <p className="text-iron-light text-sm">
                        Speak the words of passage to enter the admin chamber
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="scroll-card glass-card p-8 space-y-6">
                    {error && (
                        <div className="bg-crimson/10 border border-crimson/30 text-crimson px-4 py-3 rounded text-sm">
                            ⚠️ {error}
                        </div>
                    )}

                    <div>
                        <label className="block font-[family-name:var(--font-heading)] text-dark-wood text-sm tracking-wider uppercase mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-aged-paper/80 border border-gold/40 rounded text-dark-wood focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                            placeholder="Enter thy name..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-[family-name:var(--font-heading)] text-dark-wood text-sm tracking-wider uppercase mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-aged-paper/80 border border-gold/40 rounded text-dark-wood focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                            placeholder="Speak the secret word..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="medieval-btn w-full text-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? '⏳ Opening the gates...' : '⚔️ Enter the Castle'}
                    </button>
                </form>
            </div>
        </main>
    );
}
