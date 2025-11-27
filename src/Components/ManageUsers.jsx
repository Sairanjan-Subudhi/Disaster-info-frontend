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
            <div className="min-h-screen bg-neoWhite dark:bg-neoDark flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-neoBlack border-t-gBlue rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-neoWhite dark:bg-neoDark flex items-center justify-center p-4">
                <div className="bg-white border-4 border-neoBlack shadow-neo p-8 text-center">
                    <h2 className="text-2xl font-black text-gRed mb-4">ACCESS DENIED</h2>
                    <p className="text-neoBlack font-bold mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-neoBlack text-white font-bold border-2 border-neoBlack hover:bg-gray-800"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-neoWhite dark:bg-neoDark py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-black text-neoBlack dark:text-neoWhite uppercase tracking-tighter">
                        Manage Users
                    </h1>
                    <div className="bg-gYellow border-2 border-neoBlack px-4 py-2 font-bold shadow-neo-sm">
                        Total Users: {users.length}
                    </div>
                </div>

                <div className="bg-white dark:bg-neoDark border-4 border-neoBlack dark:border-neoWhite shadow-neo-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-neoBlack text-white border-b-4 border-neoBlack">
                                    <th className="p-4 font-black uppercase tracking-wide">User</th>
                                    <th className="p-4 font-black uppercase tracking-wide">Email</th>
                                    <th className="p-4 font-black uppercase tracking-wide">Role</th>
                                    <th className="p-4 font-black uppercase tracking-wide text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-neoBlack dark:divide-gray-700">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <td className="p-4 font-bold text-neoBlack dark:text-white">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full border-2 border-neoBlack flex items-center justify-center font-black text-xs ${user.role === 'admin' ? 'bg-gRed text-white' : 'bg-gBlue text-white'
                                                    }`}>
                                                    {user.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                {user.fullname || 'Unknown'}
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-sm text-gray-600 dark:text-gray-300">
                                            {user.email}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-black uppercase border-2 border-neoBlack ${user.role === 'admin'
                                                    ? 'bg-gRed text-white shadow-neo-sm'
                                                    : 'bg-gray-200 text-neoBlack'
                                                }`}>
                                                {user.role || 'user'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            {user.role !== 'admin' && (
                                                <button
                                                    onClick={() => handlePromote(user._id)}
                                                    className="px-3 py-1 bg-gBlue text-white text-xs font-bold border-2 border-neoBlack shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                                                >
                                                    PROMOTE
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="px-3 py-1 bg-white text-gRed text-xs font-bold border-2 border-neoBlack shadow-neo-sm hover:bg-gRed hover:text-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
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
                        <div className="p-8 text-center text-gray-500 font-bold">
                            No users found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
