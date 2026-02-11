
import React, { useState } from 'react';
import * as gemini from '../services/geminiService';

export default function ImageLab({ initialImage }: { initialImage: string }) {
  const [currentImage, setCurrentImage] = useState(initialImage);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'edit' | 'generate'>('edit');
  const [size, setSize] = useState<any>('1K');
  const [ratio, setRatio] = useState('1:1');

  const handleAction = async () => {
    setLoading(true);
    try {
      if (mode === 'edit') {
        const res = await gemini.editImage(currentImage, prompt);
        if (res) setCurrentImage(res);
      } else {
        const res = await gemini.generateImage(prompt, size, ratio);
        if (res) setCurrentImage(res);
      }
    } catch (e) {
      alert("Action failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-[2.5rem] p-8 space-y-8 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Image Lab</h2>
        <div className="flex bg-white/5 rounded-xl p-1">
          <button onClick={() => setMode('edit')} className={`px-4 py-2 rounded-lg text-xs font-bold ${mode === 'edit' ? 'bg-blue-600' : ''}`}>Edit</button>
          <button onClick={() => setMode('generate')} className={`px-4 py-2 rounded-lg text-xs font-bold ${mode === 'generate' ? 'bg-blue-600' : ''}`}>Generate</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-square bg-black/40 rounded-3xl overflow-hidden border border-white/5">
            {currentImage ? <img src={currentImage} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-600">No Image</div>}
          </div>
          <button onClick={() => {
             const link = document.createElement('a');
             link.href = currentImage;
             link.download = 'content-flyer-image.png';
             link.click();
          }} className="w-full py-2 bg-white/5 rounded-xl text-xs font-bold">Download Current</button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Prompt</label>
            <textarea 
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={mode === 'edit' ? "e.g. Add a retro filter to this photo" : "e.g. A product shot of a luxury watch on a marble table"}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm min-h-[100px]"
            />
          </div>

          {mode === 'generate' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Size</label>
                <select value={size} onChange={e => setSize(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-sm">
                  <option value="1K">1K (Standard)</option>
                  <option value="2K">2K (High)</option>
                  <option value="4K">4K (Ultra)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Ratio</label>
                <select value={ratio} onChange={e => setRatio(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-sm">
                  <option value="1:1">1:1</option>
                  <option value="9:16">9:16 (Story)</option>
                  <option value="16:9">16:9 (Cinema)</option>
                  <option value="4:3">4:3</option>
                </select>
              </div>
            </div>
          )}

          <button 
            disabled={loading}
            onClick={handleAction}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : (mode === 'edit' ? 'Apply Edit' : 'Generate From Scratch')}
          </button>
        </div>
      </div>
    </div>
  );
}
