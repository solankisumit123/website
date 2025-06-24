import React, { useState } from 'react';
import { Users, Shield, UserPlus, Edit, Trash2, Eye, EyeOff, X, Save, Plus } from 'lucide-react';

// Admin users database - same as in AuthContext
const ADMIN_USERS = [
  {
    id: 1,
    username: 'Solanki@#$Sumit',
    password: 'SolankiSumit@#$7874',
    role: 'admin',
    name: 'Administrator',
    email: 'admin@moviehub.com',
    lastLogin: '2 hours ago',
    status: 'Active'
  }
];

interface NewUser {
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
  email: string;
  role: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState(ADMIN_USERS);
  const [showPasswords, setShowPasswords] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newUser, setNewUser] = useState<NewUser>({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    role: 'admin'
  });
  const [errors, setErrors] = useState<Partial<NewUser>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<NewUser> = {};

    // Username validation
    if (!newUser.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (newUser.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (users.some(u => u.username === newUser.username)) {
      newErrors.username = 'Username already exists';
    }

    // Password validation
    if (!newUser.password) {
      newErrors.password = 'Password is required';
    } else if (newUser.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newUser.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation
    if (newUser.password !== newUser.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Name validation
    if (!newUser.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    if (!newUser.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      newErrors.email = 'Please enter a valid email';
    } else if (users.some(u => u.email === newUser.email)) {
      newErrors.email = 'Email already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUser = () => {
    if (validateForm()) {
      const newAdminUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        username: newUser.username,
        password: newUser.password,
        role: newUser.role,
        name: newUser.name,
        email: newUser.email,
        lastLogin: 'Never',
        status: 'Active'
      };

      setUsers([...users, newAdminUser]);
      
      // Reset form
      setNewUser({
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        email: '',
        role: 'admin'
      });
      setShowAddForm(false);
      setErrors({});
      
      alert(`Admin user "${newUser.name}" created successfully!`);
    }
  };

  const handleEditUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setEditingUser(user);
      setNewUser({
        username: user.username,
        password: '',
        confirmPassword: '',
        name: user.name,
        email: user.email,
        role: user.role
      });
      setShowAddForm(true);
    }
  };

  const handleUpdateUser = () => {
    if (validateForm()) {
      const updatedUsers = users.map(user => 
        user.id === editingUser.id 
          ? {
              ...user,
              username: newUser.username,
              password: newUser.password || user.password,
              name: newUser.name,
              email: newUser.email,
              role: newUser.role
            }
          : user
      );
      
      setUsers(updatedUsers);
      setEditingUser(null);
      setNewUser({
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        email: '',
        role: 'admin'
      });
      setShowAddForm(false);
      setErrors({});
      
      alert(`Admin user "${newUser.name}" updated successfully!`);
    }
  };

  const handleDeleteUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    
    // Prevent deletion of the main admin user
    if (user?.username === 'Solanki@#$Sumit') {
      alert('Cannot delete the main administrator account. This is the only admin user.');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete admin user "${user?.name}"?`)) {
      setUsers(users.filter(user => user.id !== userId));
      alert(`User "${user?.name}" deleted successfully!`);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPasswords(!showPasswords);
  };

  const resetForm = () => {
    setNewUser({
      username: '',
      password: '',
      confirmPassword: '',
      name: '',
      email: '',
      role: 'admin'
    });
    setErrors({});
    setEditingUser(null);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Users Management</h1>
            <p className="text-indigo-100">Manage admin accounts and permissions</p>
          </div>
          <div className="hidden md:block">
            <Shield className="w-16 h-16 text-indigo-200" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{users.length}</p>
              <p className="text-slate-400 text-sm">Total Admin Users</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{users.filter(u => u.status === 'Active').length}</p>
              <p className="text-slate-400 text-sm">Active Users</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <Shield className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'admin').length}</p>
              <p className="text-slate-400 text-sm">Admin Role</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <UserPlus className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">10</p>
              <p className="text-slate-400 text-sm">Available Slots</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {editingUser ? `Edit Admin User: ${editingUser.name}` : 'Add New Admin User'}
            </h2>
            <button
              onClick={resetForm}
              className="p-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div>
              <label className="block text-slate-300 mb-2 font-medium">Username *</label>
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                className={`w-full p-3 bg-slate-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.username ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="Enter username"
              />
              {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
            </div>

            {/* Name */}
            <div>
              <label className="block text-slate-300 mb-2 font-medium">Full Name *</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                className={`w-full p-3 bg-slate-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="Enter full name"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-300 mb-2 font-medium">Email *</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className={`w-full p-3 bg-slate-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-slate-300 mb-2 font-medium">Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="admin">Administrator</option>
                <option value="manager">Manager</option>
                <option value="moderator">Moderator</option>
                <option value="editor">Content Editor</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-300 mb-2 font-medium">
                {editingUser ? 'New Password (leave blank to keep current)' : 'Password *'}
              </label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                className={`w-full p-3 bg-slate-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder={editingUser ? "Enter new password" : "Enter password"}
              />
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              {!editingUser && (
                <p className="text-slate-400 text-xs mt-1">
                  Must contain uppercase, lowercase, and number (min 6 characters)
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-slate-300 mb-2 font-medium">
                {editingUser ? 'Confirm New Password' : 'Confirm Password *'}
              </label>
              <input
                type="password"
                value={newUser.confirmPassword}
                onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                className={`w-full p-3 bg-slate-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={resetForm}
              className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={editingUser ? handleUpdateUser : handleAddUser}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {editingUser ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingUser ? 'Update User' : 'Add User'}
            </button>
          </div>
        </div>
      )}

      {/* Admin Users Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Admin Users</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={togglePasswordVisibility}
                className="bg-slate-700 text-white px-3 py-2 rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2"
              >
                {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPasswords ? 'Hide' : 'Show'} Passwords
              </button>
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Add Admin User
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">User</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Username</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Password</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Email</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Role</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Status</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Last Login</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{user.name.charAt(0)}</span>
                      </div>
                      <span className="text-white font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300 font-mono">{user.username}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300 font-mono">
                      {showPasswords ? user.password : '••••••••'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300">{user.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300 text-sm">{user.lastLogin}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditUser(user.id)}
                        className="p-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.username === 'Solanki@#$Sumit'}
                        className={`p-2 rounded-lg transition-colors ${
                          user.username === 'Solanki@#$Sumit' 
                            ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                        title={user.username === 'Solanki@#$Sumit' ? 'Cannot delete main admin' : 'Delete User'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-yellow-400 mb-2">Single Admin Account System</h3>
            <p className="text-slate-300 text-sm mb-3">
              This system uses a single administrator account for security. Important notes:
            </p>
            <ul className="text-slate-400 text-sm space-y-1">
              <li>• Only one admin account exists: <strong>Solanki@#$Sumit</strong></li>
              <li>• The main admin account cannot be deleted</li>
              <li>• Keep the credentials secure and private</li>
              <li>• Change the password regularly in production</li>
              <li>• Implement proper password hashing in production</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers; 