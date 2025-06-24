import React, { useState } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Action', count: 25, color: 'bg-red-500' },
    { id: 2, name: 'Drama', count: 18, color: 'bg-blue-500' },
    { id: 3, name: 'Comedy', count: 22, color: 'bg-yellow-500' },
    { id: 4, name: 'Thriller', count: 15, color: 'bg-purple-500' },
    { id: 5, name: 'Sci-Fi', count: 12, color: 'bg-green-500' },
  ]);

  const handleAddCategory = () => {
    console.log('Add Category clicked');
    // TODO: Implement add category functionality
    alert('Add Category functionality will be implemented here');
  };

  const handleEditCategory = (categoryId: number) => {
    console.log('Edit Category clicked:', categoryId);
    // TODO: Implement edit category functionality
    alert(`Edit Category ${categoryId} functionality will be implemented here`);
  };

  const handleDeleteCategory = (categoryId: number) => {
    console.log('Delete Category clicked:', categoryId);
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
      alert(`Category ${categoryId} deleted successfully!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Categories Management</h1>
            <p className="text-blue-100">Manage movie categories and genres</p>
          </div>
          <div className="hidden md:block">
            <Tag className="w-16 h-16 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Tag className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{categories.length}</p>
              <p className="text-slate-400 text-sm">Total Categories</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Tag className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{categories.reduce((sum, cat) => sum + cat.count, 0)}</p>
              <p className="text-slate-400 text-sm">Total Movies</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Tag className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{categories.length}</p>
              <p className="text-slate-400 text-sm">Active Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">All Categories</h2>
            <button 
              onClick={handleAddCategory}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Category</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Movies Count</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Status</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                      <span className="text-white font-medium">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300">{category.count} movies</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditCategory(category.id)}
                        className="p-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
    </div>
  );
};

export default Categories; 