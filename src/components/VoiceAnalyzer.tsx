import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Square, Trash2, Loader2, Play, Pause, Brain, AlertCircle, CheckCircle, Clock, User, Smile, ShieldCheck, Sparkles, X, ExternalLink, BarChart2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { supabase } from '../supabase';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

interface VoiceAnalysis {
  id?: string;
  transcript: string;
  age_group: string;
  emotion: string;
  confidence: number;
  text_sentiment: string;
  tone_sentiment: string;
  insight: string;
  created_at?: string;
}

const AI_PROMPT = `Analyze the provided audio and return a JSON object with the following fields: 
"transcript" (string): Full transcription of the spoken words.
"age_group" (string): Estimated age group (Child, Teen, Young Adult, Adult, Senior).
"emotion" (string): Multiple detected emotions from voice comma-separated (e.g. "Happy, Calm" or "Sad, Frustrated").
"confidence" (number): Confidence score from 0 to 100.
"text_sentiment" (string): Sentiment of the written transcript (Yes for Positive, No for Negative, Neutral).
"tone_sentiment" (string): Sentiment of the voice tone (Yes for Positive, No for Negative, Neutral).
"insight" (string): A short message comparing words vs tone. If there is a mismatch, say "Your words sound [text_sentiment], but your voice suggests [emotion]. Consider checking in with yourself."

Important: Return ONLY the raw JSON object. Do not include any markdown or extra text.`;

export default function VoiceAnalyzer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<VoiceAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setResult(null);
      setError(null);
    } catch (err) {
      setError("Microphone access denied. Please enable permissions.");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const analyzeVoice = async () => {
    if (!audioBlob) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // 1. Convert Blob to Base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]);
        };
      });
      reader.readAsDataURL(audioBlob);
      const base64Data = await base64Promise;

      // 2. Call Gemini
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY; // Modified slightly to support vite's load
      if (!apiKey) {
        throw new Error("Gemini API Key is missing. Please configure it in the Secrets panel.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", 
        contents: [
          { text: AI_PROMPT },
          {
            inlineData: {
              mimeType: "audio/webm",
              data: base64Data
            }
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      if (!response.text) throw new Error("No response from AI");
      
      let analysis: VoiceAnalysis;
      try {
        let cleanText = response.text.trim();
        if (cleanText.includes("```json")) {
          cleanText = cleanText.split("```json")[1].split("```")[0].trim();
        } else if (cleanText.includes("```")) {
          cleanText = cleanText.split("```")[1].split("```")[0].trim();
        }
        
        // Sometimes AI adds trailing commas
        cleanText = cleanText.replace(/,\s*([\]}])/g, '$1');
        
        analysis = JSON.parse(cleanText);
      } catch (parseErr) {
        console.error("Parse Error. Raw text:", response.text);
        throw new Error("Could not understand AI response. Please try again.");
      }

      // 3. Save to Supabase
      const { error: sbError } = await supabase
        .from('voice_analysis')
        .insert([
          {
            user_id: user?.id,
            transcript: analysis.transcript,
            age_group: analysis.age_group,
            primary_emotion: analysis.emotion, // User updated schema in previous step, so we map it appropriately
            confidence: analysis.confidence,
            text_sentiment: analysis.text_sentiment,
            tone_sentiment: analysis.tone_sentiment,
            insight: analysis.insight
          }
        ]);

      if (sbError) {
        console.warn("Supabase Save Warning:", sbError.message);
        // We continue even if DB save fails so the user sees the result
      }
      
      setResult(analysis);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Analysis failed. Please try again with a clearer recording.");
      } else {
        setError("Analysis failed. Please try again with a clearer recording.");
      }
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <button onClick={onClose} className="absolute top-8 right-8 z-20 p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-900">
           <X size={24} />
        </button>

        <div className="p-10 md:p-14 overflow-y-auto custom-scrollbar">
          <header className="mb-10 text-center">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4"
            >
              <Sparkles size={14} /> AI Voice Analyzer
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2 italic">How are you <span className="text-pink-600">really</span> feeling?</h2>
            <p className="text-slate-500 font-bold">Speak your heart out. Our AI will analyze your voice tone and sentiment.</p>
          </header>

          <div className="flex flex-col items-center gap-10">
            {/* Recorder UI */}
            <div className="relative">
              <AnimatePresence>
                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute -inset-10 z-0 bg-pink-100 rounded-full animate-ping opacity-20"
                  />
                )}
                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1.2 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute -inset-20 z-0 bg-pink-50 rounded-full animate-pulse opacity-40 blur-3xl"
                  />
                )}
              </AnimatePresence>

              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isAnalyzing}
                className={cn(
                  "relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-2xl",
                  isRecording 
                    ? "bg-rose-500 text-white hover:scale-105" 
                    : "bg-slate-900 text-white hover:scale-110 active:scale-95"
                )}
              >
                {isRecording ? <Square size={40} /> : <Mic size={48} />}
              </button>

              <div className="absolute top-0 -right-20 text-slate-400 font-black tabular-nums">
                {isRecording && formatTime(recordingTime)}
              </div>
            </div>

            {isRecording && (
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-1 h-8 items-center">
                   {[...Array(8)].map((_, i) => (
                     <motion.div
                       key={`wav-bar-${i}`}
                       animate={{ 
                         height: [8, Math.random() * 24 + 8, 8] 
                       }}
                       transition={{ 
                         repeat: Infinity, 
                         duration: 0.5,
                         delay: i * 0.1 
                       }}
                       className="w-1 bg-pink-400 rounded-full"
                     />
                   ))}
                </div>
                <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em] animate-pulse">Listening...</p>
              </div>
            )}

            {!isRecording && audioBlob && !isAnalyzing && !result && (
              <div className="w-full flex flex-col gap-4">
                <div className="flex flex-col gap-4 bg-slate-50 p-4 rounded-3xl border-2 border-slate-100">
                  <div className="flex items-center gap-4 italic">
                    <div className="bg-white p-3 rounded-2xl text-pink-600 shadow-sm"><CheckCircle size={20} /></div>
                    <div>
                      <p className="text-sm font-black text-slate-900 leading-none mb-1">Recording Captured</p>
                      <p className="text-xs text-slate-500 font-bold">Ready for AI deep analysis</p>
                    </div>
                  </div>
                  <div className="w-full px-2">
                    <audio 
                      controls 
                      src={URL.createObjectURL(audioBlob)} 
                      className="w-full h-10 outline-none" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => { setAudioBlob(null); setRecordingTime(0); }} className="px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                    <Trash2 size={16} /> Discard
                  </button>
                  <button onClick={analyzeVoice} className="px-6 py-4 bg-pink-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-pink-600/20 hover:bg-pink-700 transition-colors">
                    <Brain size={18} /> Analyze Now
                  </button>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex flex-col items-center gap-6 text-center py-10 w-full bg-pink-50/50 rounded-[2.5rem] border-2 border-dashed border-pink-200">
                <div className="relative">
                  <Loader2 size={64} className="text-pink-600 animate-spin" />
                  <motion.div 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 bg-pink-400 rounded-full blur-2xl -z-10"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-black text-slate-900 tracking-tight">Processing your voice...</p>
                  <p className="text-sm text-slate-500 font-bold">Calculating emotional frequencies & text sentiment</p>
                </div>
              </div>
            )}

            {error && (
              <div className="w-full bg-rose-50 border-2 border-rose-100 p-6 rounded-[2rem] flex items-start gap-4">
                <AlertCircle size={24} className="text-rose-500 flex-shrink-0 mt-1" />
                <div className="flex-1 space-y-2">
                  <p className="text-rose-900 font-bold text-sm leading-relaxed">{error}</p>
                  {error.includes("Microphone access denied") && (
                    <div className="text-sm text-rose-700 bg-white/50 p-4 rounded-xl border border-rose-100">
                      <p className="mb-2 font-medium">To use the voice analyzer, you need to allow microphone access in your browser settings.</p>
                      <a 
                        href="https://support.google.com/chrome/answer/2693767" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-rose-600 hover:text-rose-800 transition-colors underline underline-offset-2"
                      >
                        Learn how to enable microphone <ExternalLink size={14} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Results Display */}
            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full space-y-6 pb-4"
                >
                  <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/20 blur-[100px]" />
                    <div className="relative z-10 flex items-center gap-4 mb-6">
                      <div className="bg-white/10 p-3 rounded-2xl text-blue-400"><Clock size={20} /></div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">{new Date().toLocaleString()}</p>
                    </div>
                    <div className="relative z-10">
                      <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Transcript</p>
                      <p className="text-lg md:text-xl font-medium leading-relaxed italic">"{result.transcript}"</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <ResultCard icon={Smile} label="Voice Emotion" value={result.emotion} color="pink" />
                    <ResultCard icon={BarChart2} label="Confidence" value={`${result.confidence}%`} color="green" />
                    <ResultCard icon={User} label="Age Group" value={result.age_group} color="blue" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <SentimentCard label="Text Sentiment" value={result.text_sentiment} />
                     <SentimentCard label="Voice Sentiment" value={result.tone_sentiment} />
                  </div>

                  <div className="bg-slate-50 border-2 border-slate-100 p-8 rounded-[2.5rem] relative group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-white p-3 rounded-2xl text-slate-800 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform"><AlertCircle size={20} /></div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">AI Insight Message</p>
                    </div>
                    <p className="text-slate-800 font-black text-lg leading-snug">{result.insight}</p>
                  </div>

                  <div className="flex items-center gap-2 bg-green-50 border border-green-100 p-4 rounded-2xl justify-center">
                    <ShieldCheck size={16} className="text-green-600" />
                    <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">Securely Saved to voice_analysis table</p>
                  </div>
                  
                  <button onClick={() => { setResult(null); setAudioBlob(null); }} className="w-full py-5 bg-white border-2 border-slate-100 rounded-3xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors">
                    Start New Analysis
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ResultCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: 'blue' | 'pink' | 'green' }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    pink: "bg-pink-50 text-pink-600",
    green: "bg-green-50 text-green-600"
  };

  return (
    <div className="bg-white border-2 border-slate-100 p-6 rounded-[2rem] flex flex-col items-center text-center group hover:border-slate-200 transition-all">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm", colors[color])}>
        <Icon size={24} />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  );
}

function SentimentCard({ label, value }: { label: string; value: string }) {
  // Map Positive/Negative to Yes/No
  const isPositive = value?.toLowerCase().includes('positive') || value?.toLowerCase() === 'yes';
  const isNegative = value?.toLowerCase().includes('negative') || value?.toLowerCase() === 'no';
  
  const displayValue = isPositive ? 'Yes' : isNegative ? 'No' : 'Neutral';

  return (
    <div className="bg-slate-50 border-2 border-slate-50 p-5 rounded-3xl flex flex-col gap-2">
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
       <div className="flex items-center gap-2">
         <div className={cn(
           "w-3 h-3 rounded-full",
           isPositive ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" : 
           isNegative ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]" : "bg-slate-400"
         )} />
         <div>
           <p className="font-black text-slate-800 leading-none">{displayValue}</p>
         </div>
       </div>
    </div>
  );
}
