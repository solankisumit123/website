import React, { useState, FormEvent, ChangeEvent } from 'react';
import { getApiUrl } from '../config/base';
import { Movie, DownloadLink } from '../types';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';

interface AddQualityFormProps {
  movie: Movie;
  onQualityAdded: () => void;
  setError: (error: string) => void;
  setSuccessMessage: (message: string) => void;
}

const AddQualityForm: React.FC<AddQualityFormProps> = ({ movie, onQualityAdded, setError, setSuccessMessage }) => {
  const [quality, setQuality] = useState<string>('480p');
  const [url, setUrl] = useState('');
  const [size, setSize] = useState('');
  const [audio, setAudio] = useState('');
  const [format, setFormat] = useState('');
  const [mirrors, setMirrors] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [deletingQuality, setDeletingQuality] = useState<string | null>(null);

  const resetForm = () => {
    setQuality('480p');
    setUrl('');
    setSize('');
    setAudio('');
    setFormat('');
    setMirrors(['']);
    setLoading(false);
  };

  const handleMirrorChange = (index: number, value: string) => {
    const newMirrors = [...mirrors];
    newMirrors[index] = value;
    setMirrors(newMirrors);
  };

  const addMirror = () => setMirrors([...mirrors, '']);
  const removeMirror = (index: number) => {
    if (mirrors.length > 1) {
      setMirrors(mirrors.filter((_, i) => i !== index));
    } else {
      setMirrors(['']);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    const newLink: DownloadLink = { quality, url, size, audio, format, mirrors: mirrors.filter(m => m) };

    if (!newLink.quality || !newLink.url || !newLink.size || !newLink.audio || !newLink.format) {
      setError("Please fill in all fields for the new quality.");
      setLoading(false);
      return;
    }
    
    if (movie.downloadLinks.some((link: DownloadLink) => link.quality === newLink.quality)) {
      setError(`Quality '${newLink.quality}' already exists for this movie.`);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(getApiUrl(`/movies/${movie._id}/quality`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLink),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add quality');
      }

      const responseData = await res.json();
      setSuccessMessage(`Quality ${newLink.quality} added successfully! You can add another quality.`);
      resetForm();
      onQualityAdded();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuality = async (qualityToDelete: string) => {
    if (!confirm(`Are you sure you want to delete ${qualityToDelete} quality?`)) {
      return;
    }

    setDeletingQuality(qualityToDelete);
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch(getApiUrl(`/movies/${movie._id}/quality/${qualityToDelete}`), {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete quality');
      }

      setSuccessMessage(`Quality ${qualityToDelete} deleted successfully!`);
      onQualityAdded();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setDeletingQuality(null);
    }
  };

  const qualityOptions = ['480p', '720p', '1080p', '2k', '4k'];
  const availableQualities = qualityOptions.filter(q => !movie.downloadLinks.some((link: DownloadLink) => link.quality === q));

  if (availableQualities.length === 0) {
    return (
        <div className="bg-slate-800 rounded-lg shadow-lg mb-8 p-4 text-center text-gray-400">
            All available quality slots have been filled for this movie.
        </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg mb-8">
      <button onClick={() => setIsVisible(!isVisible)} className='w-full flex justify-between items-center p-4'>
        <h2 className="text-2xl font-bold">Add New Quality</h2>
        {isVisible ? <ChevronUp /> : <ChevronDown />}
      </button>

      {isVisible && (
        <div className="p-4 pt-0">
          {/* Existing Qualities */}
          {movie.downloadLinks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-300">Existing Qualities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {movie.downloadLinks.map((link, index) => (
                  <div key={index} className="bg-slate-700 p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-blue-400">{link.quality}</span>
                      <div className="text-sm text-gray-400">
                        {link.size} • {link.format}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteQuality(link.quality)}
                      disabled={deletingQuality === link.quality}
                      className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={`Delete ${link.quality} quality`}
                    >
                      {deletingQuality === link.quality ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Quality</label>
                <select 
                  value={quality} 
                  onChange={e => setQuality(e.target.value)} 
                  className="form-select w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableQualities.map(q => <option key={q} value={q}>{q.toUpperCase()}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Download URL</label>
                <input 
                  type="text" 
                  value={url} 
                  onChange={e => setUrl(e.target.value)} 
                  placeholder="https://..."
                  className="form-input w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Size</label>
                <input 
                  type="text" 
                  value={size} 
                  onChange={e => setSize(e.target.value)} 
                  placeholder="e.g., 2.5GB"
                  className="form-input w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Audio</label>
                <input 
                  type="text" 
                  value={audio} 
                  onChange={e => setAudio(e.target.value)} 
                  placeholder="e.g., English"
                  className="form-input w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2 font-medium">Format</label>
                <input 
                  type="text" 
                  value={format} 
                  onChange={e => setFormat(e.target.value)} 
                  placeholder="e.g., MKV"
                  className="form-input w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-gray-300 font-medium">Mirror Links (Optional)</label>
              {mirrors.map((mirror, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={mirror}
                    onChange={(e) => handleMirrorChange(index, e.target.value)}
                    placeholder={`Mirror Link ${index + 1}`}
                    className="form-input flex-grow p-2 bg-slate-600 border border-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" onClick={() => removeMirror(index)} className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                onClick={addMirror} 
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={16} /> Add Mirror
              </button>
            </div>

            <div className="text-right">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                {loading ? 'Adding...' : 'Add Quality'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddQualityForm; 