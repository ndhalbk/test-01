
import React, { useState, useEffect, useRef } from 'react';
import * as gemini from '../services/geminiService';

export default function LiveConcierge() {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Standby');
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const nextStartTimeRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);

  const startLive = async () => {
    setStatus('Connecting...');
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    sessionRef.current = await gemini.setupLiveSession({
      onopen: () => {
        setIsActive(true);
        setStatus('Listening...');
        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        processor.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          const int16 = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
          const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
          sessionRef.current?.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
        };
        source.connect(processor);
        processor.connect(inputCtx.destination);
      },
      onmessage: async (msg: any) => {
        const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
        if (audioData && audioContextRef.current) {
          const bytes = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));
          const dataInt16 = new Int16Array(bytes.buffer);
          const buffer = audioContextRef.current.createBuffer(1, dataInt16.length, 24000);
          buffer.getChannelData(0).set(Array.from(dataInt16).map(v => v / 32768.0));
          const source = audioContextRef.current.createBufferSource();
          source.buffer = buffer;
          source.connect(audioContextRef.current.destination);
          
          const startTime = Math.max(nextStartTimeRef.current, audioContextRef.current.currentTime);
          source.start(startTime);
          nextStartTimeRef.current = startTime + buffer.duration;
        }
      },
      onclose: () => setIsActive(false),
      onerror: () => setStatus('Error')
    });
  };

  return (
    <div className="glass rounded-[2.5rem] p-10 flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-500">
      <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${isActive ? 'border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.5)] scale-110' : 'border-white/10'}`}>
         <div className={`w-24 h-24 rounded-full bg-blue-600/20 flex items-center justify-center ${isActive ? 'animate-pulse' : ''}`}>
           <span className="text-4xl">🎙️</span>
         </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Live Marketing Consultant</h2>
        <p className={`text-sm font-medium ${isActive ? 'text-green-400' : 'text-gray-500'}`}>{status}</p>
      </div>

      {!isActive ? (
        <button onClick={startLive} className="px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold shadow-xl shadow-blue-600/20">
          Start Consultation
        </button>
      ) : (
        <button onClick={() => window.location.reload()} className="px-10 py-4 bg-red-600 hover:bg-red-500 rounded-2xl font-bold">
          End Session
        </button>
      )}

      <div className="max-w-md text-center text-xs text-gray-500 leading-relaxed">
        Our consultant uses <strong>Gemini 2.5 Native Audio</strong> for ultra-low latency strategy sessions. Speak naturally in Tunisian Derja or English.
      </div>
    </div>
  );
}
