
import React, { useState, useEffect } from 'react';
import { AppState, ProductData, GeneratedContent } from './types';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ImageLab from './components/ImageLab';
import VideoLab from './components/VideoLab';
import MarketResearch from './components/MarketResearch';
import LiveConcierge from './components/LiveConcierge';
import * as gemini from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [results, setResults] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const checkApiKey = async () => {
    if (!(window as any).aistudio?.hasSelectedApiKey()) {
      await (window as any).aistudio?.openSelectKey();
    }
  };

  const handleProcessProduct = async (data: ProductData) => {
    setProduct(data);
    setIsGenerating(true);
    setAppState(AppState.GENERATING);
    try {
      const content = await gemini.generateMarketingContent(data.image, data.name);
      const audio = await gemini.generateTunisianVoice(content.scriptTunisian);
      setResults({ ...content, audioData: audio });
      setAppState(AppState.RESULTS);
    } catch (error) {
      console.error(error);
      alert("Error generating content.");
      setAppState(AppState.DASHBOARD);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadScript = () => {
    if (!results) return;
    const element = document.createElement("a");
    const file = new Blob([results.scriptTunisian], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${product?.name.replace(/\s+/g, '_').toLowerCase() || 'tunisian'}_script.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renderNav = () => (
    <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl mb-8 overflow-x-auto no-scrollbar">
      {[
        { state: AppState.DASHBOARD, label: 'Create', icon: '✨' },
        { state: AppState.RESULTS, label: 'Results', icon: '📝', disabled: !results },
        { state: AppState.IMAGE_LAB, label: 'Image Lab', icon: '🎨' },
        { state: AppState.VIDEO_LAB, label: 'Video Lab', icon: '🎬' },
        { state: AppState.MARKET_RESEARCH, label: 'Trends', icon: '📈' },
        { state: AppState.LIVE_SUPPORT, label: 'AI Support', icon: '🎙️' },
      ].map((item) => (
        <button
          key={item.state}
          disabled={item.disabled}
          onClick={() => setAppState(item.state)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            appState === item.state ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
          } ${item.disabled ? 'opacity-20 cursor-not-allowed' : ''}`}
        >
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen pb-20">
      {appState === AppState.LANDING ? (
        <LandingPage onStart={() => setAppState(AppState.DASHBOARD)} />
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setAppState(AppState.LANDING)}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">C</div>
              <h1 className="text-xl font-bold tracking-tight">ContentFlyer AI</h1>
            </div>
            <button onClick={() => setAppState(AppState.LANDING)} className="text-sm font-medium text-gray-400 hover:text-white">Sign Out</button>
          </header>

          {renderNav()}

          {appState === AppState.DASHBOARD && <Dashboard onProcess={handleProcessProduct} />}
          
          {appState === AppState.GENERATING && (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
              <h2 className="text-2xl font-bold">Crafting Content...</h2>
            </div>
          )}

          {appState === AppState.RESULTS && results && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="glass rounded-3xl p-6 relative overflow-hidden aspect-[9/16] flex items-center justify-center">
                 <img src={product?.image} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm" />
                 <div className="relative z-10 text-center px-4">
                    <div className="w-24 h-24 rounded-full border-2 border-white/20 overflow-hidden mx-auto mb-4">
                      <img src="https://picsum.photos/seed/tunis/200" />
                    </div>
                    <button 
                      onClick={() => gemini.playAudioFromBase64(results.audioData!)}
                      className="bg-blue-600 p-4 rounded-full shadow-lg mb-4"
                    >
                      <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </button>
                    <p className="text-sm font-arabic" dir="rtl">{results.scriptTunisian}</p>
                 </div>
              </div>
              <div className="space-y-6">
                 <div className="glass p-6 rounded-2xl">
                    <h3 className="text-xs font-bold text-green-400 mb-2 uppercase tracking-wider">Video Script (Tunisian Derja)</h3>
                    <p className="text-sm text-gray-300 mb-4 font-arabic text-right leading-relaxed" dir="rtl">{results.scriptTunisian}</p>
                    <div className="grid grid-cols-2 gap-2">
                       <button onClick={() => {
                          navigator.clipboard.writeText(results.scriptTunisian);
                          alert("Script copied to clipboard!");
                       }} className="py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs transition-colors">Copy Script</button>
                       <button onClick={downloadScript} className="py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs transition-colors">Download .txt</button>
                    </div>
                 </div>

                 <div className="glass p-6 rounded-2xl">
                    <h3 className="text-xs font-bold text-blue-400 mb-2 uppercase">Caption</h3>
                    <p className="text-sm text-gray-300 mb-4">{results.caption}</p>
                    <button onClick={() => {
                       navigator.clipboard.writeText(results.caption);
                       alert("Caption copied to clipboard!");
                    }} className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs transition-colors">Copy Caption</button>
                 </div>
                 
                 <div className="glass p-6 rounded-2xl">
                    <h3 className="text-xs font-bold text-purple-400 mb-2 uppercase">CTA</h3>
                    <p className="font-bold">{results.cta}</p>
                 </div>
                 
                 <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-2xl shadow-xl">
                    <h4 className="font-bold mb-2">Next Step?</h4>
                    <p className="text-xs mb-4 opacity-80">Use the Image Lab to edit your photo or Video Lab to generate a high-end cinematic ad.</p>
                    <div className="grid grid-cols-2 gap-2">
                       <button onClick={() => setAppState(AppState.IMAGE_LAB)} className="bg-white/10 hover:bg-white/20 py-2 rounded-lg text-xs font-bold transition-all">Image Lab</button>
                       <button onClick={() => setAppState(AppState.VIDEO_LAB)} className="bg-white/10 hover:bg-white/20 py-2 rounded-lg text-xs font-bold transition-all">Video Lab</button>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {appState === AppState.IMAGE_LAB && <ImageLab initialImage={product?.image || ""} />}
          {appState === AppState.VIDEO_LAB && <VideoLab initialImage={product?.image || ""} checkKey={checkApiKey} />}
          {appState === AppState.MARKET_RESEARCH && <MarketResearch product={product?.name || "E-commerce in Tunisia"} />}
          {appState === AppState.LIVE_SUPPORT && <LiveConcierge />}
        </div>
      )}
    </div>
  );
};

export default App;
