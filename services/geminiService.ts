
import { GoogleGenAI, Type, Modality, GenerateContentResponse, LiveServerMessage } from "@google/genai";

// Standard generation for marketing content (Fast Flash Lite)
export const generateMarketingContent = async (imageData: string, productName: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite-latest', // Fast responses as requested
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageData.split(',')[1]
          }
        },
        {
          text: `Analyze this product: "${productName}". 
          Generate:
          1. Video script in Tunisian Derja (Arabic script).
          2. Instagram caption in Tunisian Derja.
          3. Strong CTA.
          Return exactly in JSON format.`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scriptTunisian: { type: Type.STRING },
          caption: { type: Type.STRING },
          cta: { type: Type.STRING }
        },
        required: ["scriptTunisian", "caption", "cta"]
      }
    }
  });

  return JSON.parse(response.text);
};

// Search Grounding for Market Trends
export const getMarketTrends = async (productName: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `What are the current trending social media marketing strategies and hashtags in Tunisia for ${productName}?`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  return {
    text: response.text,
    links: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};

// Image Editing (Nano Banana Series)
export const editImage = async (base64Image: string, prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
        { text: prompt },
      ],
    },
  });
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  return null;
};

// High Quality Image Generation (Nano Banana Pro)
export const generateImage = async (prompt: string, size: "1K" | "2K" | "4K", aspectRatio: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: { aspectRatio: aspectRatio as any, imageSize: size as any }
    },
  });
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  return null;
};

// Veo Video Generation (Prompt or Image based)
export const generateVeoVideo = async (prompt: string, base64Image?: string, aspectRatio: "16:9" | "9:16" = "9:16") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: base64Image ? {
      imageBytes: base64Image.split(',')[1],
      mimeType: 'image/jpeg'
    } : undefined,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await videoResponse.blob();
  return URL.createObjectURL(blob);
};

// Live Support Utility (Live API)
export const setupLiveSession = async (callbacks: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: 'You are an expert Tunisian marketing consultant. Help the user with their e-commerce strategy in a mix of Tunisian Derja and English.',
    },
  });
};

// Existing Audio Utils
export const playAudioFromBase64 = async (base64Audio: string) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const bytes = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0));
  const dataInt16 = new Int16Array(bytes.buffer);
  const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
  buffer.getChannelData(0).set(Array.from(dataInt16).map(v => v / 32768.0));
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
};

export const generateTunisianVoice = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Read this Tunisian script naturally: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};
