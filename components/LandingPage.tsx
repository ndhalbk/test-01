
import React from 'react';
import { PLANS } from '../constants';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">C</div>
            <span className="text-xl font-bold tracking-tight">ContentFlyer AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#demo" className="hover:text-white transition-colors">Try Demo</a>
          </div>
          <button 
            onClick={onStart}
            className="bg-white text-black px-5 py-2 rounded-full font-semibold text-sm hover:bg-gray-200 transition-all shadow-lg"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 text-center relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full -z-10"></div>
        <div className="max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            100% Tunisian AI Content
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-[1.1]">
            From one image to <br />
            <span className="gradient-text">Viral Video Content</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            ContentFlyer transforms your product photos into high-converting Tunisian scripts, captions, and AI-powered UGC videos. Sell more, post less.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group"
            >
              Start Free Demo
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </button>
            <a href="#pricing" className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg glass hover:bg-white/5 transition-all text-gray-300">
              View Pricing
            </a>
          </div>

          <div className="mt-20 relative glass rounded-[2.5rem] p-4 max-w-5xl mx-auto border border-white/10 shadow-2xl">
            <img src="https://picsum.photos/seed/dashboard/1200/800" className="rounded-[2rem] w-full" alt="Platform Dashboard" />
            <div className="absolute -bottom-10 -right-10 md:-right-20 glass p-6 rounded-3xl shadow-2xl border border-white/10 hidden md:block">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                </div>
                <div>
                  <div className="text-sm font-bold">+245% Sales</div>
                  <div className="text-xs text-gray-400">Weekly ROI</div>
                </div>
              </div>
              <div className="text-[10px] text-gray-500">Based on 120+ Tunisian merchants</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: "Tunisian Script AI",
              desc: "Algorithms trained specifically on Tunisian slang and consumer behavior to generate scripts that truly resonate.",
              icon: "🧠"
            },
            {
              title: "One-Click Video",
              desc: "No camera? No problem. Our AI Avatars talk about your product in a natural Tunisian dialect automatically.",
              icon: "🎬"
            },
            {
              title: "Smart Scheduler",
              desc: "Connect your IG/FB accounts and let ContentFlyer post at the peak engagement hours for Tunisia.",
              icon: "🚀"
            }
          ].map((f, i) => (
            <div key={i} className="glass p-10 rounded-[2.5rem] hover:border-blue-500/30 transition-all hover:-translate-y-2 group">
              <div className="text-4xl mb-6 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">{f.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
              <p className="text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Choose Your Plan</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Scale your e-commerce content production without scaling your costs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLANS.map((plan) => (
              <div 
                key={plan.id} 
                className={`glass p-10 rounded-[2.5rem] flex flex-col border ${plan.recommended ? 'border-blue-600/50 shadow-2xl shadow-blue-600/10' : 'border-white/5'}`}
              >
                {plan.recommended && <div className="text-center text-xs font-bold text-blue-400 mb-4 uppercase tracking-widest">Recommended</div>}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-6">{plan.price}<span className="text-sm font-normal text-gray-500">/mo</span></div>
                <div className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                      {feat}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={onStart}
                  className={`w-full py-4 rounded-2xl font-bold transition-all ${plan.recommended ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500' : 'bg-white/5 hover:bg-white/10 text-white'}`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">C</div>
              <span className="text-xl font-bold tracking-tight">ContentFlyer AI</span>
            </div>
            <p className="text-gray-500 text-sm">Made with ❤️ for Tunisian Merchants.</p>
          </div>
          <div className="flex gap-8 text-sm text-gray-400 font-medium">
             <a href="#" className="hover:text-white">Privacy</a>
             <a href="#" className="hover:text-white">Terms</a>
             <a href="#" className="hover:text-white">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
