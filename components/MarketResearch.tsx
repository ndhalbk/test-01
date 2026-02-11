
import React, { useState, useEffect } from 'react';
import * as gemini from '../services/geminiService';

export default function MarketResearch({ product }: { product: string }) {
  const [data, setData] = useState<{ text: string, links: any[] } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await gemini.getMarketTrends(product);
      setData(res as any);
      setLoading(false);
    };
    fetch();
  }, [product]);

  return (
    <div className="glass rounded-[2.5rem] p-8 space-y-6 animate-in fade-in slide-in-from-left-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <span className="text-blue-500">🌍</span> 
        Tunisian Market Trends for "{product}"
      </h2>

      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Searching Google for latest insights...</p>
        </div>
      ) : (
        <div className="space-y-8">
           <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
              {data?.text}
           </div>

           {data?.links && (
             <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase">Sources & Trends</h4>
                <div className="flex flex-wrap gap-2">
                  {data.links.map((link, i) => link.web && (
                    <a key={i} href={link.web.uri} target="_blank" className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs text-blue-400 hover:bg-white/10 transition-all">
                      {link.web.title || link.web.uri}
                    </a>
                  ))}
                </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
}
