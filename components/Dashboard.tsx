
import React, { useState, useRef } from 'react';
import { ProductData } from '../types';

interface DashboardProps {
  onProcess: (data: ProductData) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onProcess }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image) {
      alert("Please provide a product name and an image.");
      return;
    }
    onProcess({
      name,
      image,
      category: 'General'
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass p-10 rounded-[2.5rem] border border-white/5">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Create New Content</h2>
          <p className="text-gray-400">Upload your product photo and let our AI handle the rest.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">Product Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Handmade Leather Bag"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">Product Photo</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${image ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'}`}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              {image ? (
                <div className="text-center">
                  <img src={image} className="w-48 h-48 object-cover rounded-2xl shadow-2xl mb-4 mx-auto" alt="Preview" />
                  <p className="text-blue-400 text-sm font-bold">Image Selected</p>
                  <p className="text-gray-500 text-xs mt-1">Click to change</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                  </div>
                  <p className="font-bold text-gray-300">Drop your image here</p>
                  <p className="text-gray-500 text-sm">Supports JPG, PNG (Max 5MB)</p>
                </>
              )}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-blue-600 text-white rounded-[1.25rem] font-bold text-lg hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]"
          >
            Generate Content Pack
          </button>
        </form>

        <div className="mt-10 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tutorial</span>
          </div>
          <p className="text-sm text-gray-500 italic">
            "Pro Tip: Use a clear image with a neutral background for better AI Avatar integration."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
