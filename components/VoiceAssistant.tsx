import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Mic, 
  MicOff, 
  X, 
  Volume2, 
  VolumeX, 
  Send, 
  Calendar, 
  Check, 
  AlertCircle,
  Sparkles,
  Keyboard,
  ChevronDown
} from 'lucide-react';
import { auth, googleSignIn, googleSignOut, bookGoogleCalendarConsultation } from './googleCalendar';
import { User } from 'firebase/auth';
import { useLanguage } from './LanguageContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isPending?: boolean;
}

export const VoiceAssistant: React.FC = () => {
  const { language } = useLanguage();
  const languageRef = useRef(language);

  // UI States
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessagesState] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I am Eleanor, your bespoke design consultant from The Elegant Company. I'm here to guide you through planning your custom furniture or built-in commission, and can secure a real consultation on your Google Calendar when you're ready. Would you like to tell me about the project you have in mind?",
      timestamp: new Date()
    }
  ]);

  // Synchronize language when toggled (for speech recognition and other UI labels)
  useEffect(() => {
    languageRef.current = language;
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === 'af' ? 'af-ZA' : 'en-ZA';
    }
  }, [language]);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [isListening, setIsListeningState] = useState(false);
  const [isSpeaking, setIsSpeakingState] = useState(false);
  const [isThinking, setIsThinkingState] = useState(false);
  const [textInput, setTextInputState] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [oauthToken, setOauthTokenState] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [muteVoice, setMuteVoice] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingDetails, setBookingDetailsState] = useState<any | null>(null);

  // Mirrored Refs to prevent stale closures and excessive dependency re-triggers
  const messagesRef = useRef<Message[]>(messages);
  const setMessages = (newMsgs: Message[] | ((prev: Message[]) => Message[])) => {
    if (typeof newMsgs === 'function') {
      setMessagesState(prev => {
        const next = newMsgs(prev);
        messagesRef.current = next;
        return next;
      });
    } else {
      messagesRef.current = newMsgs;
      setMessagesState(newMsgs);
    }
  };

  const textInputRef = useRef(textInput);
  const setTextInput = (val: string) => {
    textInputRef.current = val;
    setTextInputState(val);
  };

  const isListeningRef = useRef(isListening);
  const setIsListening = (val: boolean) => {
    isListeningRef.current = val;
    setIsListeningState(val);
  };

  const isSpeakingRef = useRef(isSpeaking);
  const setIsSpeaking = (val: boolean) => {
    isSpeakingRef.current = val;
    setIsSpeakingState(val);
  };

  const isThinkingRef = useRef(isThinking);
  const setIsThinking = (val: boolean) => {
    isThinkingRef.current = val;
    setIsThinkingState(val);
  };

  const oauthTokenRef = useRef<string | null>(oauthToken);
  const setOauthToken = (val: string | null) => {
    oauthTokenRef.current = val;
    setOauthTokenState(val);
  };

  const bookingDetailsRef = useRef<any | null>(bookingDetails);
  const setBookingDetails = (val: any | null) => {
    bookingDetailsRef.current = val;
    setBookingDetailsState(val);
  };

  // Recognition and Audio Refs
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Mic analysis refs for dynamic input visualization
  const micStreamRef = useRef<MediaStream | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const micAnalyserRef = useRef<AnalyserNode | null>(null);

  // Initialize Speech Recognition & Firebase Auth (ONCE on mount)
  useEffect(() => {
    // 1. Setup Auth Listener
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      // Try to recover token if available
      import('./googleCalendar').then((cal) => {
        const token = cal.getAccessToken();
        if (token) setOauthToken(token);
      });
    });

    // 2. Setup Speech Recognition gracefully
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      const rec = new SpeechRecognitionClass();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = languageRef.current === 'af' ? 'af-ZA' : 'en-ZA'; // Dynamic South African vibe

      rec.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
        startMicVisualization();
      };

      rec.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setTextInput(transcript);
      };

      rec.onend = () => {
        setIsListening(false);
        stopMicVisualization();
        // Trigger auto-submit if text exists
        if (textInputRef.current.trim()) {
          handleSubmitText(textInputRef.current);
        }
      };

      rec.onerror = (event: any) => {
        console.error('Speech Recognition Error:', event.error);
        setIsListening(false);
        stopMicVisualization();
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission denied.');
          setInputMode('text');
        } else if (event.error === 'no-speech') {
          // Silent timeout, ignore
        } else {
          setSpeechError(`Speech recognition issue: ${event.error}`);
        }
      };

      recognitionRef.current = rec;
    } else {
      setInputMode('text'); // Speech recognition not supported
    }

    // 3. Setup Audio Player
    audioRef.current = new Audio();
    audioRef.current.crossOrigin = "anonymous";
    
    const handleAudioPlay = () => {
      setIsSpeaking(true);
      setupAudioContext();
    };
    
    const handleAudioEnded = () => {
      setIsSpeaking(false);
    };

    const handleAudioError = (e: any) => {
      console.error("Audio playback error:", e);
      setIsSpeaking(false);
    };

    audioRef.current.addEventListener('play', handleAudioPlay);
    audioRef.current.addEventListener('ended', handleAudioEnded);
    audioRef.current.addEventListener('error', handleAudioError);

    return () => {
      unsubscribe();
      if (recognitionRef.current) {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop();
      }
      if (audioRef.current) {
        audioRef.current.removeEventListener('play', handleAudioPlay);
        audioRef.current.removeEventListener('ended', handleAudioEnded);
        audioRef.current.removeEventListener('error', handleAudioError);
        audioRef.current.pause();
        audioRef.current = null;
      }
      stopMicVisualization();

      // Disconnect audio player nodes explicitly to prevent memory leaks
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.disconnect();
        } catch (e) {
          console.warn("Error disconnecting sourceNode:", e);
        }
        sourceNodeRef.current = null;
      }
      if (analyserRef.current) {
        try {
          analyserRef.current.disconnect();
        } catch (e) {
          console.warn("Error disconnecting analyser:", e);
        }
        analyserRef.current = null;
      }

      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }

      // Ensure animation loop is stopped on unmount
      isAnimatingRef.current = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, []);

  // Dedicated Canvas Animation Loop control based on panel visibility state
  useEffect(() => {
    if (isOpen) {
      isAnimatingRef.current = true;
      // Small timeout to allow canvas to mount and refs to resolve
      const timeoutId = setTimeout(() => {
        startCanvasAnimation();
      }, 50);
      return () => {
        clearTimeout(timeoutId);
        isAnimatingRef.current = false;
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
          animationFrameId.current = null;
        }
      };
    } else {
      isAnimatingRef.current = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    }
  }, [isOpen]);

  // Auto Scroll Chat on New Message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Micro-interaction AudioContext setup
  const setupAudioContext = () => {
    if (audioCtxRef.current) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    try {
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;

      if (audioRef.current) {
        const source = ctx.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(ctx.destination);

        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
        sourceNodeRef.current = source;
      }
    } catch (err) {
      console.warn("Failed to initialize AudioContext visualizer:", err);
    }
  };

  // Mic live visualization setup (captures audio purely for frequency data without echo feedback)
  const startMicVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      micSourceRef.current = source;
      micAnalyserRef.current = analyser;
    } catch (err) {
      console.warn("Could not initiate mic dynamic stream visualization:", err);
    }
  };

  const stopMicVisualization = () => {
    if (micSourceRef.current) {
      try {
        micSourceRef.current.disconnect();
      } catch (e) {
        console.warn("Error disconnecting micSourceRef:", e);
      }
      micSourceRef.current = null;
    }
    if (micAnalyserRef.current) {
      try {
        micAnalyserRef.current.disconnect();
      } catch (e) {
        console.warn("Error disconnecting micAnalyserRef:", e);
      }
      micAnalyserRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
  };

  // Connect Google Calendar
  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setOauthToken(res.accessToken);
        
        // If we were waiting to book, run it now
        if (bookingDetails) {
          executeGoogleBooking(bookingDetails, res.accessToken);
        }
      }
    } catch (error) {
      console.error("Calendar login failure:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await googleSignOut();
    setUser(null);
    setOauthToken(null);
    setBookingDetails(null);
  };

  // Trigger speech listening
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (audioRef.current) {
        audioRef.current.pause(); // Mute Eleanor if user interrupts
        setIsSpeaking(false);
      }
      
      // Warm up AudioContext for browser gesture rules
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass && !audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      setSpeechError(null);
      setTextInput('');
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error("Speech Recognition start failed:", err);
        setSpeechError("Could not access speech module.");
      }
    }
  };

  // TTS Voice Synthesis
  const speakText = async (textToSpeak: string) => {
    if (muteVoice) return;
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSpeak })
      });

      if (!response.ok) {
        throw new Error('TTS server failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(e => {
          console.warn("Autoplay blocked or playback issue. Speech requires user click.", e);
          setIsSpeaking(false);
        });
      }
    } catch (err) {
      console.error("TTS voice synthesis failed:", err);
      setIsSpeaking(false);
    }
  };

  // Submit Text Input/Transcription to Gemini Chat API
  const handleSubmitText = async (customText?: string) => {
    const textToSend = customText || textInputRef.current;
    if (!textToSend.trim() || isThinkingRef.current) return;

    // Append User Message
    const userMsgId = Math.random().toString();
    const newUserMessage: Message = {
      id: userMsgId,
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };
    
    const updatedMessages = [...messagesRef.current, newUserMessage];
    setMessages(updatedMessages);
    setTextInput('');
    setIsThinking(true);
    setSpeechError(null);

    // Stop Eleanor speech immediately on user submit
    if (audioRef.current) {
      audioRef.current.pause();
      setIsSpeaking(false);
    }

    try {
      // Build conversation history payload from synchronized array
      const historyPayload = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyPayload })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Consultant network error');
      }

      const data = await response.json();
      
      // Create Eleanor Assistant Response
      const assistantMsgId = Math.random().toString();
      const newAssistantMessage: Message = {
        id: assistantMsgId,
        role: 'assistant',
        content: data.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newAssistantMessage]);
      setIsThinking(false);

      // Speak back response
      speakText(data.content);

      // Check for calendar booking tool requests
      if (data.functionCall && data.functionCall.name === 'bookConsultation') {
        const args = data.functionCall.args;
        setBookingDetails(args);

        // If authenticated, execute booking directly
        if (oauthTokenRef.current) {
          executeGoogleBooking(args, oauthTokenRef.current);
        }
      }

    } catch (err: any) {
      console.error("Failed chat communication:", err);
      setIsThinking(false);
      setSpeechError(err.message || "Failed to reach Eleanor. Ensure GEMINI_API_KEY is active.");
      
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        role: 'assistant',
        content: "I apologize, but I am having trouble connecting to my design center right now. Please check if your Gemini API key is configured correctly in the Settings secrets panel.",
        timestamp: new Date()
      }]);
    }
  };

  // Perform Google Calendar Booking
  const executeGoogleBooking = async (args: any, token: string) => {
    setIsBooking(true);
    try {
      const result = await bookGoogleCalendarConsultation(args, token);
      
      if (result.success) {
        // Report success back to Gemini to finalize consultation speech
        const systemMessage = `[SYSTEM: Tool 'bookConsultation' executed successfully. Google Calendar event created with ID: ${result.eventId}. Please confirm the booking details to the client elegantly.]`;
        
        // Push successful indicator and update messages
        setBookingDetails(null);
        await handleSubmitText(systemMessage);
      } else {
        throw new Error(result.error || 'Calendar API rejection');
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        role: 'assistant',
        content: `I've prepared your booking details, but encountered an error placing it on Google Calendar: "${err.message || 'API request failure'}". Please sign in again or use our standard Contact form below.`,
        timestamp: new Date()
      }]);
    } finally {
      setIsBooking(false);
    }
  };

  // Canvas Waveform Animator
  const startCanvasAnimation = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rotation = 0;
    let particlePulse = 0;

    const render = () => {
      if (!isAnimatingRef.current || !canvasRef.current) {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
          animationFrameId.current = null;
        }
        return;
      }

      const width = canvas.width;
      const height = canvas.height;
      
      // Clear canvas with soft transparency for premium friction trail
      ctx.fillStyle = 'rgba(26, 26, 26, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Centered coordinate details
      const cx = width / 2;
      const cy = height / 2;
      const baseRadius = 55;

      // Check current mode to draw proper luxury waveform orb
      if (isSpeakingRef.current && analyserRef.current) {
        // A. Eleanor Voice Output - Active Golden Circular Waveform
        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        // Draw multiple layered organic fluid loops
        for (let layer = 0; layer < 3; layer++) {
          ctx.beginPath();
          ctx.strokeStyle = layer === 0 ? 'rgba(197, 160, 89, 0.9)' : layer === 1 ? 'rgba(197, 160, 89, 0.4)' : 'rgba(230, 210, 160, 0.15)';
          ctx.lineWidth = layer === 0 ? 3 : layer === 1 ? 2 : 4;
          
          const offsetAngle = layer * (Math.PI / 3);

          for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * Math.PI * 2 + offsetAngle;
            const dataIndex = Math.floor((i % 32) * (bufferLength / 32));
            const value = dataArray[dataIndex] / 255;
            
            // Push radius outward synchronously with voice volume frequency
            const r = baseRadius + value * 22 * (1.2 - layer * 0.3);
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.closePath();
          ctx.stroke();
        }

        // Draw center gold energy core
        ctx.beginPath();
        ctx.fillStyle = 'rgba(197, 160, 89, 0.08)';
        ctx.arc(cx, cy, baseRadius - 5, 0, Math.PI * 2);
        ctx.fill();

      } else if (isListeningRef.current && micAnalyserRef.current) {
        // B. User Speaking Input - Active Audio Mic Waveform
        const analyser = micAnalyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)'; // Elite glowing warm coral-red for listening active indication
        ctx.lineWidth = 2.5;

        for (let i = 0; i <= 64; i++) {
          const angle = (i / 64) * Math.PI * 2;
          const dataIndex = Math.floor((i % 32) * (bufferLength / 32));
          const value = dataArray[dataIndex] / 255;
          
          const r = baseRadius + value * 25;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = 'rgba(239, 68, 68, 0.06)';
        ctx.arc(cx, cy, baseRadius - 10, 0, Math.PI * 2);
        ctx.fill();

      } else if (isThinkingRef.current) {
        // C. Thinking / Processing State - Smooth orbit tracks
        rotation += 0.06;
        ctx.lineWidth = 1.5;

        // Draw double nested orbiting gold particles
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(197, 160, 89, 0.35)';
        ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Orbit particle 1
        const ox1 = cx + Math.cos(rotation) * baseRadius;
        const oy1 = cy + Math.sin(rotation) * baseRadius;
        ctx.beginPath();
        ctx.fillStyle = '#c5a059';
        ctx.arc(ox1, oy1, 5, 0, Math.PI * 2);
        ctx.fill();

        // Orbit particle 2 (opposite direction, wider track)
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(197, 160, 89, 0.15)';
        ctx.arc(cx, cy, baseRadius + 15, 0, Math.PI * 2);
        ctx.stroke();

        const ox2 = cx + Math.cos(-rotation * 0.7) * (baseRadius + 15);
        const oy2 = cy + Math.sin(-rotation * 0.7) * (baseRadius + 15);
        ctx.beginPath();
        ctx.fillStyle = 'rgba(197, 160, 89, 0.75)';
        ctx.arc(ox2, oy2, 4, 0, Math.PI * 2);
        ctx.fill();

      } else {
        // D. IDLE - Slow beautiful breathing luxury golden ring
        particlePulse += 0.025;
        const breathingRadius = baseRadius + Math.sin(particlePulse) * 4;

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(197, 160, 89, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.arc(cx, cy, breathingRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Subtly layered glow
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(197, 160, 89, 0.18)';
        ctx.lineWidth = 6;
        ctx.arc(cx, cy, breathingRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Micro gold node center dot
        ctx.beginPath();
        ctx.fillStyle = '#c5a059';
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();
  };

  return (
    <>
      {/* 1. FLOATING BRANDED ORB BUTTON (Bottom Right Launcher) */}
      <div className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end">
        <AnimatePresence>
          {(!isOpen) && (
            <motion.button
              id="eleanor-floating-launcher"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 5 }}
              onClick={() => setIsOpen(true)}
              className="group relative flex items-center gap-3 bg-[#0a0a0a] border border-[#c5a059]/40 hover:border-[#c5a059] text-white px-5 py-3.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.5)] cursor-pointer select-none overflow-hidden transition-all duration-300 active:scale-95"
            >
              {/* Gold light sheen shimmer animation inside launcher */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              
              <div className="relative">
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0a0a0a] animate-pulse"></span>
                <MessageSquare size={16} className="text-[#c5a059] group-hover:scale-110 transition-transform duration-300" />
              </div>

              <div className="flex flex-col items-start leading-none text-left">
                <span className="text-[10px] font-sans tracking-[0.18em] uppercase font-bold text-gray-400">
                  {language === 'af' ? 'Praat Met' : 'Speak With'}
                </span>
                <span className="text-xs font-serif font-semibold text-[#c5a059] tracking-wide mt-1.5">Eleanor</span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* 2. CHAT MODAL INTERFACE PANEL (Sophisticated sliding cards with glassmorphism) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="eleanor-consultant-sidebar"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 180 }}
            className="fixed bottom-6 right-6 z-[9995] w-full max-w-[400px] h-[640px] max-h-[calc(100vh-48px)] bg-[#141414]/98 backdrop-blur-xl border border-stone-800/80 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col font-sans"
          >
            {/* Elegant Header section */}
            <div className="p-5 border-b border-stone-900 flex items-center justify-between select-none bg-stone-950/60">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full bg-[#1c1c1c] border border-[#c5a059]/40 flex items-center justify-center">
                  <span className="text-xs font-serif text-[#c5a059] font-semibold">E</span>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-[#141414] animate-pulse"></span>
                </div>
                <div>
                  <h3 className="text-sm font-serif font-semibold text-white tracking-wide leading-none">Eleanor</h3>
                  <p className="text-[10px] font-sans text-[#c5a059]/80 tracking-widest uppercase mt-1">
                    {language === 'af' ? 'Unieke Ontwerpkonsultant' : 'Bespoke Design Consultant'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Sign-in status widget */}
                {user ? (
                  <div className="flex items-center gap-2">
                     <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold font-sans">
                       {language === 'af' ? 'Kalender-sinchronisasie' : 'Calendar Sync'}
                     </span>
                    <button 
                      onClick={handleSignOut}
                       title={language === 'af' ? 'Ontkoppel Kalender' : 'Disconnect Calendar'}
                      className="text-stone-500 hover:text-red-400 transition-colors duration-300 text-[10px] uppercase tracking-wider cursor-pointer font-sans underline"
                    >
                       {language === 'af' ? 'Ontkoppel' : 'Disconnect'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isSigningIn}
                    className="flex items-center gap-1.5 text-[9px] text-[#c5a059] bg-[#c5a059]/10 hover:bg-[#c5a059]/20 border border-[#c5a059]/20 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold font-sans transition-all duration-300 cursor-pointer disabled:opacity-50"
                  >
                    <Calendar size={10} />
                     {isSigningIn 
                       ? (language === 'af' ? "Besig met sinchronisering..." : "Syncing...") 
                       : (language === 'af' ? "Koppel Kalender" : "Sync Calendar")}
                  </button>
                )}

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-stone-400 hover:text-white transition-colors duration-300 p-1 rounded-full hover:bg-stone-900 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* A. Dynamic Soundwave Visualizer Section */}
            <div className="relative h-[160px] shrink-0 bg-stone-950/40 border-b border-stone-900 flex flex-col items-center justify-center overflow-hidden">
              <canvas 
                ref={canvasRef} 
                width={360} 
                height={150} 
                className="w-full h-full object-contain pointer-events-none"
              />
              
              {/* Dynamic Overlay State text label */}
              <div className="absolute bottom-3 left-0 right-0 text-center select-none">
                <span className="text-[10px] font-sans tracking-[0.2em] uppercase font-light text-stone-400">
                  {isSpeaking 
                    ? (language === 'af' ? "Eleanor praat tans..." : "Eleanor is speaking...") 
                    : isListening 
                      ? (language === 'af' ? "Luister na u stem..." : "Listening to your voice...") 
                      : isThinking 
                        ? (language === 'af' ? "Raadpleeg meester-houtwerkswinkel..." : "Consulting master woodcraft workshop...") 
                        : (language === 'af' ? "Eleanor is aandagtig" : "Eleanor is attentive")}
                </span>
              </div>
            </div>

            {/* B. Conversation History Panel */}
            <div className="flex-grow overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-stone-800 bg-[#121212]/40">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#c5a059] text-white rounded-tr-none shadow-[0_4px_12px_rgba(197,160,89,0.12)]' 
                      : 'bg-stone-900 text-stone-200 rounded-tl-none border border-stone-800/60 shadow-[0_4px_12px_rgba(0,0,0,0.1)]'
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[9px] text-stone-500 font-sans tracking-wide mt-1.5 px-1 uppercase font-light">
                    {msg.role === 'user' ? (language === 'af' ? 'Jy' : 'You') : 'Eleanor'} &bull; {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              ))}

              {/* Booking Prompt Highlight overlay */}
              {bookingDetails && (
                <div className="p-4 bg-[#c5a059]/10 border border-[#c5a059]/30 rounded-xl space-y-3 shadow-md">
                  <div className="flex items-start gap-2.5">
                    <Calendar className="text-[#c5a059] shrink-0 mt-0.5" size={16} />
                    <div>
                      <h4 className="text-xs font-serif font-bold text-white tracking-wide">
                        {language === 'af' ? "Bespreek Kalender-konsultasie" : "Secure Calendar Callback Appointment"}
                      </h4>
                      <p className="text-[11px] text-stone-300 mt-1 leading-relaxed">
                        {language === 'af' ? "Eleanor het u konsultasiebesonderhede saamgestel:" : "Eleanor has compiled your consultation details:"} 
                        <span className="block italic text-[#c5a059] font-medium mt-1">
                          {bookingDetails.projectType} {language === 'af' ? "konsultasie op" : "consultation on"} {new Date(bookingDetails.dateTime).toLocaleDateString(language === 'af' ? 'af-ZA' : 'en-ZA', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  {!user ? (
                    <button
                      onClick={handleGoogleSignIn}
                      disabled={isSigningIn}
                      className="w-full py-2 bg-[#c5a059] hover:bg-[#b48f48] text-white text-[10px] uppercase tracking-widest font-bold font-sans rounded-md transition-all duration-300 cursor-pointer shadow-md text-center"
                    >
                      {isSigningIn 
                        ? (language === 'af' ? "U word aangemeld..." : "Signing you in...") 
                        : (language === 'af' ? "Koppel Google Kalender om te Bespreek" : "Connect Google Calendar to Book")}
                    </button>
                  ) : (
                    <button
                      onClick={() => executeGoogleBooking(bookingDetails, oauthToken!)}
                      disabled={isBooking}
                      className="w-full py-2 bg-[#c5a059] hover:bg-[#b48f48] text-white text-[10px] uppercase tracking-widest font-bold font-sans rounded-md transition-all duration-300 cursor-pointer shadow-md text-center flex items-center justify-center gap-1.5"
                    >
                      {isBooking ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>{language === 'af' ? "Bespreking word gedoen..." : "Securing Appointment..."}</span>
                        </>
                      ) : (
                        language === 'af' ? "Bevestig Kalender-bespreking" : "Confirm Calendar Slot Now"
                      )}
                    </button>
                  )}
                </div>
              )}

              {isThinking && (
                <div className="flex items-center gap-2 text-stone-500 text-xs italic px-1 animate-pulse">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#c5a059] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#c5a059] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#c5a059] rounded-full animate-bounce"></span>
                  </div>
                  <span>
                    {language === 'af' ? "Eleanor hersien houtnerf-opsies..." : "Eleanor is reviewing wood grains..."}
                  </span>
                </div>
              )}

              {speechError && (
                <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-300 text-xs rounded-lg flex items-start gap-2 animate-fade-in shadow-inner">
                  <AlertCircle className="shrink-0 mt-0.5 text-red-400" size={14} />
                  <span>{speechError}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* C. Interactive Input Console Footer bar */}
            <div className="p-4 border-t border-stone-900 bg-stone-950/60 space-y-3 shrink-0 select-none">
              <div className="flex items-center justify-between">
                {/* Settings triggers */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setMuteVoice(prev => !prev)}
                    title={muteVoice 
                      ? (language === 'af' ? "Ontdemp Eleanor se stem" : "Unmute Eleanor Voice") 
                      : (language === 'af' ? "Demp Eleanor se stem" : "Mute Eleanor Voice")}
                    className={`p-2 rounded-lg border transition-all duration-300 cursor-pointer ${
                      muteVoice 
                        ? 'border-stone-800 bg-stone-900/40 text-stone-500 hover:text-stone-300' 
                        : 'border-[#c5a059]/20 bg-[#c5a059]/5 text-[#c5a059] hover:bg-[#c5a059]/10'
                     }`}
                  >
                    {muteVoice ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>

                  <button
                    onClick={() => setInputMode(prev => prev === 'voice' ? 'text' : 'voice')}
                    title={inputMode === 'voice' 
                      ? (language === 'af' ? "Skakel oor na sleutelbord" : "Switch to typing keyboard") 
                      : (language === 'af' ? "Skakel oor na spraak" : "Switch to speech voice")}
                    className={`p-2 rounded-lg border transition-all duration-300 cursor-pointer ${
                      inputMode === 'text' 
                        ? 'border-[#c5a059]/20 bg-[#c5a059]/5 text-[#c5a059]' 
                        : 'border-stone-800 bg-stone-900/40 text-stone-400 hover:text-white'
                    }`}
                  >
                    {inputMode === 'voice' ? <Keyboard size={14} /> : <Mic size={14} />}
                  </button>
                </div>

                {/* Micro instructions */}
                <span className="text-[10px] text-stone-500 font-sans tracking-wide uppercase font-light">
                  {inputMode === 'voice' 
                    ? (language === 'af' ? "Tik op mikrofoon en praat" : "Tap Mic and talk") 
                    : (language === 'af' ? "Tik u navraag" : "Type your inquiry")}
                </span>
              </div>

              {inputMode === 'voice' ? (
                /* VOICE INPUT VIEW */
                <div className="flex flex-col items-center justify-center py-2 bg-stone-900/40 rounded-xl border border-stone-800/50">
                  <button
                    onClick={toggleListening}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg cursor-pointer transform ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110' 
                        : 'bg-[#c5a059] hover:bg-[#b48f48] text-white hover:shadow-[#c5a059]/20 active:scale-95'
                    }`}
                  >
                    {isListening ? <MicOff size={22} className="text-white" /> : <Mic size={22} className="text-white" />}
                  </button>
                  
                  {/* Interim Real-time Transcription label */}
                  {textInput && (
                    <p className="text-xs text-stone-300 px-4 mt-3 text-center line-clamp-2 italic font-light font-sans max-w-[280px]">
                      “{textInput}”
                    </p>
                  )}
                </div>
              ) : (
                /* TEXT KEYBOARD INPUT VIEW */
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitText();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={language === 'af' ? "Vertel Eleanor van u ruimte..." : "Tell Eleanor about your space..."}
                    disabled={isThinking}
                    className="flex-grow p-3 bg-stone-900 border border-stone-800 text-white rounded-lg text-sm focus:border-[#c5a059] outline-none disabled:opacity-50 font-sans"
                  />
                  <button
                    type="submit"
                    disabled={isThinking || !textInput.trim()}
                    className="p-3 bg-[#c5a059] hover:bg-[#b48f48] disabled:bg-stone-800 disabled:text-stone-600 text-white rounded-lg transition-all duration-300 cursor-pointer shadow-md"
                  >
                    <Send size={15} />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Embedded CSS Shimmer animation helper */}
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </>
  );
};
