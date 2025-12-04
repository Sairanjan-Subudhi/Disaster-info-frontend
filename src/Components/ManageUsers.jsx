import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const res = await fetch(`${BASE_URL}/api/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    setError('Unauthorized access.');
                } else {
                    setError('Failed to fetch users.');
                }
                setLoading(false);
                return;
            }

            const data = await res.json();
            setUsers(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Server error.');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to ban this user?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${BASE_URL}/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setUsers(users.filter(user => user._id !== id));
            } else {
                alert('Failed to delete user.');
            }
        } catch (err) {
            console.error(err);
            alert('Error deleting user.');
        }
    };

    const handlePromote = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${BASE_URL}/api/users/${id}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role: 'admin' })
            });

            if (res.ok) {
                setUsers(users.map(user =>
                    user._id === id ? { ...user, role: 'admin' } : user
                ));
            } else {
                alert('Failed to promote user.');
            }
        } catch (err) {
            console.error(err);
            alert('Error promoting user.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-cyber-black flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-white/10 border-t-neon-blue rounded-full animate-spin shadow-[0_0_20px_rgba(0,240,255,0.5)]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-cyber-black flex items-center justify-center p-4">
                <div className="glass-panel p-8 text-center rounded-2xl border border-neon-red/50 shadow-[0_0_40px_rgba(255,0,60,0.2)]">
                    <h2 className="text-3xl font-bold text-neon-red mb-4 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,0,60,0.8)]">Access Denied</h2>
                    <p className="text-gray-300 font-medium mb-8">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-white/10 text-white font-bold border border-white/20 rounded-full hover:bg-white/20 hover:border-white/40 transition-all"
                    >
                        Return to Base
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cyber-black text-white pt-32 pb-12 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-white">Manage Users</span>
                    </h1>
                    <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full font-mono text-neon-blue shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                        Total Users: {users.length}
                    </div>
                </div>

                <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="p-4 font-bold uppercase tracking-widest text-xs text-gray-400">User</th>
                                    <th className="p-4 font-bold uppercase tracking-widest text-xs text-gray-400">Email</th>
                                    <th className="p-4 font-bold uppercase tracking-widest text-xs text-gray-400">Role</th>
                                    <th className="p-4 font-bold uppercase tracking-widest text-xs text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4 font-medium text-white">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg ${user.role === 'admin'
                                                    ? 'bg-neon-red text-black shadow-[0_0_10px_rgba(255,0,60,0.5)]'
                                                    : 'bg-neon-blue text-black shadow-[0_0_10px_rgba(0,240,255,0.5)]'
                                                    }`}>
                                                    {user.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <span className="group-hover:text-neon-blue transition-colors">{user.fullname || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-sm text-gray-400">
                                            {user.email}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${user.role === 'admin'
                                                ? 'bg-neon-red/10 text-neon-red border-neon-red/30 shadow-[0_0_10px_rgba(255,0,60,0.2)]'
                                                : 'bg-white/5 text-gray-400 border-white/10'
                                                }`}>
                                                {user.role || 'user'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            {user.role !== 'admin' && (
                                                <button
                                                    onClick={() => handlePromote(user._id)}
                                                    className="px-3 py-1 bg-neon-blue/10 text-neon-blue text-xs font-bold border border-neon-blue/30 rounded hover:bg-neon-blue/20 hover:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all"
                                                >
                                                    PROMOTE
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="px-3 py-1 bg-neon-red/10 text-neon-red text-xs font-bold border border-neon-red/30 rounded hover:bg-neon-red/20 hover:shadow-[0_0_10px_rgba(255,0,60,0.3)] transition-all"
                                            >
                                                BAN
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {users.length === 0 && (
                        <div className="p-12 text-center text-gray-500 font-medium">
                            No users found in the database.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
