
import React, { useState } from 'react';
import * as gemini from '../services/geminiService';

export default function VideoLab({ initialImage, checkKey }: { initialImage: string, checkKey: () => Promise<void> }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Animate this product cinematicly for a social media ad.');
  const [loading, setLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("9:16");

  const handleGenerate = async () => {
    await checkKey();
    setLoading(true);
    try {
      const res = await gemini.generateVeoVideo(prompt, initialImage, aspectRatio);
      setVideoUrl(res);
    } catch (e) {
      alert("Video generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-[2.5rem] p-8 space-y-8 animate-in fade-in slide-in-from-right-4">
      <div className="text-center max-w-xl mx-auto mb-8">
        <h2 className="text-3xl font-bold mb-2">Veo Cinematic Ads</h2>
        <p className="text-gray-400 text-sm">Transform your photo into a stunning video advertisement using Veo 3.1 AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className={`mx-auto bg-black/40 rounded-3xl overflow-hidden border border-white/5 ${aspectRatio === "9:16" ? "aspect-[9/16] w-64" : "aspect-[16/9] w-full"}`}>
            {videoUrl ? (
              <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-xl">🎬</div>
                <p className="text-xs text-gray-500 px-4 text-center">Your generated video will appear here</p>
              </div>
            )}
          </div>
          {videoUrl && <button onClick={() => window.open(videoUrl)} className="w-full py-2 bg-blue-600 rounded-xl text-xs font-bold">Open Full Video</button>}
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
            <h3 className="text-sm font-bold mb-4">Generation Settings</h3>
            <div className="space-y-4">
               <div>
                  <label className="block text-xs text-gray-500 mb-2 uppercase">Animation Prompt</label>
                  <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm h-24" />
               </div>
               <div>
                  <label className="block text-xs text-gray-500 mb-2 uppercase">Aspect Ratio</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setAspectRatio('9:16')} className={`py-2 rounded-lg text-xs font-bold ${aspectRatio === '9:16' ? 'bg-blue-600' : 'bg-white/5'}`}>9:16 (Vertical)</button>
                    <button onClick={() => setAspectRatio('16:9')} className={`py-2 rounded-lg text-xs font-bold ${aspectRatio === '16:9' ? 'bg-blue-600' : 'bg-white/5'}`}>16:9 (Landscape)</button>
                  </div>
               </div>
            </div>
          </div>

          <button 
            disabled={loading}
            onClick={handleGenerate}
            className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/20 disabled:opacity-50 relative overflow-hidden group"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Generating (approx 1 min)...</span>
              </div>
            ) : "Generate AI Video ad"}
          </button>
          
          <p className="text-[10px] text-gray-500 text-center italic">Video generation consumes credits. PRO accounts only.</p>
        </div>
      </div>
    </div>
  );
}
