import { useState, useEffect } from 'react';
import { FiUserCheck, FiUserX, FiUsers } from 'react-icons/fi';
import * as api from '../../api';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.getAllUsers();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (id, isApproved) => {
        try {
            await api.approveUser(id, isApproved);
            setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isApproved } : u));
            toast.success(`User ${isApproved ? 'approved' : 'unapproved'}`);
        } catch (err) {
            toast.error('Failed to update user');
        }
    };

    return (
        <div>
            <h1 className="font-display text-2xl font-bold text-fashion-dark mb-6">Buyer Management</h1>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-4 shadow-soft text-center">
                    <p className="text-2xl font-bold text-fashion-dark">{users.length}</p>
                    <p className="text-xs text-fashion-medium">Total Buyers</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-soft text-center">
                    <p className="text-2xl font-bold text-green-600">{users.filter((u) => u.isApproved).length}</p>
                    <p className="text-xs text-fashion-medium">Approved</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-soft text-center">
                    <p className="text-2xl font-bold text-yellow-600">{users.filter((u) => !u.isApproved).length}</p>
                    <p className="text-xs text-fashion-medium">Pending</p>
                </div>
            </div>

            {loading ? (
                <div className="bg-white rounded-2xl p-6 animate-pulse">
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-100 rounded-xl" />
                        ))}
                    </div>
                </div>
            ) : users.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl">
                    <FiUsers size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="font-display text-xl font-semibold mb-2">No buyers registered yet</h3>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left py-3 px-4 text-fashion-medium font-medium">Buyer</th>
                                    <th className="text-left py-3 px-4 text-fashion-medium font-medium">Company</th>
                                    <th className="text-left py-3 px-4 text-fashion-medium font-medium">Contact</th>
                                    <th className="text-left py-3 px-4 text-fashion-medium font-medium">GSTIN</th>
                                    <th className="text-left py-3 px-4 text-fashion-medium font-medium">Status</th>
                                    <th className="text-left py-3 px-4 text-fashion-medium font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-xs text-fashion-medium">{user.email}</p>
                                        </td>
                                        <td className="py-3 px-4">{user.company || '-'}</td>
                                        <td className="py-3 px-4">{user.phone || '-'}</td>
                                        <td className="py-3 px-4 font-mono text-xs">{user.gstin || '-'}</td>
                                        <td className="py-3 px-4">
                                            <span className={`badge text-[10px] ${user.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {user.isApproved ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            {user.isApproved ? (
                                                <button
                                                    onClick={() => handleApproval(user._id, false)}
                                                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium"
                                                >
                                                    <FiUserX size={14} /> Revoke
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleApproval(user._id, true)}
                                                    className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium"
                                                >
                                                    <FiUserCheck size={14} /> Approve
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
