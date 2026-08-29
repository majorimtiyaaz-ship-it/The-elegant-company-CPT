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

  // Stop all speech synthesis and audio playback
  const stopAllAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsSpeaking(false);
  };

  // Browser Web Speech Synthesis fallback (100% reliable with zero external API key requirements)
  const speakWithBrowserSpeech = (textToSpeak: string) => {
    if (muteVoice || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSpeaking(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();

      // Clean text of system annotations, bracket instructions, and markdown
      const cleanText = textToSpeak
        .replace(/\[SYSTEM:[^\]]*\]/g, '')
        .replace(/[*_#`~]/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .trim();

      if (!cleanText) {
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.96; // Elegant, measured cadence
      utterance.pitch = 1.04; // Warm, hospitable tone

      // Select matching voice
      const voices = window.speechSynthesis.getVoices();
      if (languageRef.current === 'af') {
        const afVoice = voices.find(v => v.lang.startsWith('af') || v.name.toLowerCase().includes('afrikaans'));
        if (afVoice) utterance.voice = afVoice;
      } else {
        const preferredVoice = voices.find(v => 
          (v.name.includes('Samantha') || 
           v.name.includes('Karen') || 
           v.name.includes('Serena') || 
           v.name.includes('Victoria') || 
           v.name.includes('Google UK English Female') ||
           v.name.includes('Natural') ||
           (v.lang.startsWith('en') && v.name.toLowerCase().includes('female')))
        ) || voices.find(v => v.lang.startsWith('en'));
        
        if (preferredVoice) utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (e) => {
        console.warn("Speech synthesis notice:", e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Browser speech synthesis error:", e);
      setIsSpeaking(false);
    }
  };

  // TTS Voice Synthesis
  const speakText = async (textToSpeak: string) => {
    if (muteVoice) return;
    stopAllAudio();

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSpeak })
      });

      if (!response.ok) {
        speakWithBrowserSpeech(textToSpeak);
        return;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json().catch(() => ({ fallback: true }));
        if (data.fallback || !data.audio) {
          speakWithBrowserSpeech(textToSpeak);
          return;
        }
      }

      const audioBlob = await response.blob();
      if (audioBlob.size < 120) {
        speakWithBrowserSpeech(textToSpeak);
        return;
      }

      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        setupAudioContext();
        audioRef.current.src = audioUrl;
        audioRef.current.play()
          .then(() => {
            setIsSpeaking(true);
          })
          .catch(e => {
            console.warn("Audio element playback interrupted, using browser speech synthesis:", e);
            speakWithBrowserSpeech(textToSpeak);
          });
      } else {
        speakWithBrowserSpeech(textToSpeak);
      }
    } catch (err) {
      console.warn("TTS server call noticed, using browser speech synthesis fallback:", err);
      speakWithBrowserSpeech(textToSpeak);
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
      
      // Clear canvas with ultra-soft fade for fluid harmonic trails
      ctx.fillStyle = 'rgba(13, 14, 16, 0.25)';
      ctx.fillRect(0, 0, width, height);

      const cy = height / 2;
      particlePulse += 0.03;
      rotation += 0.04;

      if (isSpeakingRef.current) {
        // A. Eleanor Voice Output - Luxury Fluid Harmonic Audio Ribbon
        let avg = 0.45;
        if (analyserRef.current) {
          const analyser = analyserRef.current;
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyser.getByteFrequencyData(dataArray);

          let sum = 0;
          for (let i = 0; i < 32; i++) sum += dataArray[i];
          const calculatedAvg = sum / 32 / 255;
          if (calculatedAvg > 0.04) avg = calculatedAvg;
        } else {
          // Synthetic audio envelope for browser speech synthesis
          avg = 0.4 + Math.sin(particlePulse * 3.2) * 0.22 + Math.cos(particlePulse * 6.5) * 0.12;
        }

        const layers = [
          { color: 'rgba(197, 160, 89, 0.95)', width: 2.2, speed: 2.2, amp: 24 * (1 + avg * 1.8), freq: 0.022 },
          { color: 'rgba(235, 210, 150, 0.65)', width: 1.5, speed: -1.6, amp: 18 * (1 + avg * 1.5), freq: 0.03 },
          { color: 'rgba(197, 160, 89, 0.25)', width: 3.5, speed: 1.2, amp: 14 * (1 + avg * 1.2), freq: 0.015 }
        ];

        layers.forEach((layer) => {
          ctx.beginPath();
          ctx.strokeStyle = layer.color;
          ctx.lineWidth = layer.width;

          for (let x = 0; x <= width; x += 4) {
            const normalizedX = (x - width / 2) / (width / 2);
            // Windowing function (Hanning-like) to taper ends gracefully
            const envelope = Math.cos(normalizedX * Math.PI * 0.5);
            const y = cy + Math.sin(x * layer.freq + particlePulse * layer.speed) * layer.amp * Math.max(0, envelope);

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        });

      } else if (isListeningRef.current && micAnalyserRef.current) {
        // B. User Speaking Input - Warm Amber Acoustic Waveform
        const analyser = micAnalyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < 32; i++) sum += dataArray[i];
        const avg = sum / 32 / 255;

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(220, 165, 80, 0.9)';
        ctx.lineWidth = 2;

        for (let x = 0; x <= width; x += 3) {
          const normalizedX = (x - width / 2) / (width / 2);
          const envelope = Math.cos(normalizedX * Math.PI * 0.5);
          const dataIdx = Math.floor((x / width) * 32);
          const waveAmp = (dataArray[dataIdx] / 255) * 28 + 6;
          const y = cy + Math.sin(x * 0.04 + particlePulse * 3) * waveAmp * Math.max(0, envelope);

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

      } else if (isThinkingRef.current) {
        // C. Thinking State - Harmonic Double Helix Wave
        for (let k = 0; k < 2; k++) {
          const phase = k * Math.PI;
          ctx.beginPath();
          ctx.strokeStyle = k === 0 ? 'rgba(197, 160, 89, 0.85)' : 'rgba(215, 185, 125, 0.45)';
          ctx.lineWidth = 1.8;

          for (let x = 0; x <= width; x += 4) {
            const normalizedX = (x - width / 2) / (width / 2);
            const envelope = Math.cos(normalizedX * Math.PI * 0.5);
            const y = cy + Math.sin(x * 0.025 + rotation * 2 + phase) * 14 * Math.max(0, envelope);

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

      } else {
        // D. Idle State - Serene Atelier Drafting Horizon Line
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(197, 160, 89, 0.45)';
        ctx.lineWidth = 1.4;

        for (let x = 0; x <= width; x += 4) {
          const normalizedX = (x - width / 2) / (width / 2);
          const envelope = Math.cos(normalizedX * Math.PI * 0.5);
          const y = cy + Math.sin(x * 0.018 + particlePulse * 0.8) * 6 * Math.max(0, envelope);

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();
  };

  // Quick inquiry prompt chips
  const quickPrompts = [
    { label: language === 'af' ? "Bespoke Kombuis" : "Bespoke Kitchen", query: "Can you advise me on commissioning a bespoke luxury kitchen in Cape Town?" },
    { label: language === 'af' ? "Pasgemaakte Kaste" : "Custom Cabinetry", query: "Tell me about your custom cabinetry, fluted wood profiles and wardrobes." },
    { label: language === 'af' ? "Bespreek Konsultasie" : "Book Consultation", query: "I would like to schedule a design consultation on my calendar." },
    { label: language === 'af' ? "Houtafwerkings" : "Wood Finishes", query: "What timber species, French Oak and travertine finishes do you offer?" }
  ];

  return (
    <>
      {/* 1. FLOATING LUXURY ATELIER BADGE LAUNCHER (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              id="eleanor-floating-launcher"
              initial={{ opacity: 0, scale: 0.88, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setIsOpen(true)}
              className="group relative flex items-center gap-3.5 bg-[#0e0f11]/95 backdrop-blur-xl border border-[#c5a059]/40 hover:border-[#c5a059] text-white pl-4 pr-5 py-3 rounded-full shadow-[0_16px_48px_rgba(0,0,0,0.65)] cursor-pointer select-none overflow-hidden transition-all duration-400 hover:shadow-[0_20px_56px_rgba(197,160,89,0.2)] active:scale-[0.97]"
            >
              {/* Subtle gold light sweep sheen */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c5a059]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

              {/* Atelier Medallion Icon */}
              <div className="relative w-8 h-8 rounded-full bg-[#18191c] border border-[#c5a059]/50 flex items-center justify-center shrink-0 shadow-inner">
                <Sparkles size={14} className="text-[#c5a059] group-hover:rotate-12 transition-transform duration-300" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#c5a059] rounded-full border-2 border-[#0e0f11] shadow-[0_0_8px_#c5a059]" />
              </div>

              {/* Brand Typography */}
              <div className="flex flex-col items-start leading-none text-left">
                <span className="text-[9px] font-sans tracking-[0.24em] uppercase font-semibold text-stone-400">
                  {language === 'af' ? 'Ateljee-Konsultant' : 'Atelier Consultant'}
                </span>
                <span className="text-[13px] font-serif font-medium text-[#e4caa0] tracking-wide mt-1 group-hover:text-[#c5a059] transition-colors">
                  Eleanor
                </span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* 2. CHAT MODAL INTERFACE PANEL (Architectural Atelier Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="eleanor-consultant-sidebar"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed bottom-6 right-6 z-[9995] w-[calc(100vw-32px)] sm:w-[410px] h-[640px] max-h-[calc(100vh-48px)] bg-[#0d0e10]/98 backdrop-blur-2xl border border-stone-800/90 rounded-2xl shadow-[0_32px_100px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col font-sans"
          >
            {/* A. Refined Atelier Header */}
            <div className="px-5 py-4 border-b border-stone-900/90 flex items-center justify-between select-none bg-stone-950/70">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full bg-[#18191c] border border-[#c5a059]/60 flex items-center justify-center shadow-inner">
                  <span className="text-xs font-serif text-[#e4caa0] font-semibold">E</span>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#c5a059] rounded-full border border-[#0d0e10] shadow-[0_0_6px_#c5a059]" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-medium text-white tracking-wide leading-none">Eleanor</h3>
                  <p className="text-[9px] font-sans text-stone-400 tracking-[0.16em] uppercase mt-1">
                    {language === 'af' ? 'Hoof-Ontwerpkonsultant · Kaapstad' : 'Principal Consultant · Cape Town'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Google Calendar Sync status */}
                {user ? (
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] text-emerald-300 uppercase tracking-wider font-semibold font-sans">
                      {language === 'af' ? 'Kalender Gekoppel' : 'Calendar Synced'}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isSigningIn}
                    title="Connect Google Calendar for real-time consultation scheduling"
                    className="flex items-center gap-1 text-[9px] text-[#c5a059] bg-[#c5a059]/10 hover:bg-[#c5a059]/20 border border-[#c5a059]/30 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold font-sans transition-all duration-300 cursor-pointer disabled:opacity-50"
                  >
                    <Calendar size={10} />
                    <span>{isSigningIn ? '...' : (language === 'af' ? 'Kalender' : 'Sync Calendar')}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    stopAllAudio();
                    setIsOpen(false);
                  }}
                  className="text-stone-400 hover:text-white transition-colors duration-300 p-1.5 rounded-full hover:bg-stone-900 cursor-pointer"
                  aria-label="Close consultant panel"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* B. Organic Acoustic Waveform Visualizer */}
            <div className="relative h-[95px] shrink-0 bg-gradient-to-b from-[#090a0c] to-[#0e0f11] border-b border-stone-900/80 flex flex-col items-center justify-center overflow-hidden">
              <canvas 
                ref={canvasRef} 
                width={380} 
                height={95} 
                className="w-full h-full object-contain pointer-events-none"
              />
              
              {/* Dynamic State Caption */}
              <div className="absolute bottom-2 inset-x-0 text-center select-none flex items-center justify-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  isSpeaking ? 'bg-[#c5a059] animate-ping' : isListening ? 'bg-amber-400 animate-pulse' : isThinking ? 'bg-[#c5a059] animate-bounce' : 'bg-stone-600'
                }`} />
                <span className="text-[9px] font-sans tracking-[0.22em] uppercase font-medium text-stone-400">
                  {isSpeaking 
                    ? (language === 'af' ? "Eleanor praat tans..." : "Eleanor is speaking...") 
                    : isListening 
                      ? (language === 'af' ? "Luister na u stem..." : "Listening attentively...") 
                      : isThinking 
                        ? (language === 'af' ? "Raadpleeg ateljee..." : "Consulting atelier archives...") 
                        : (language === 'af' ? "Eleanor is gereed" : "Atelier AI Active")}
                </span>
              </div>
            </div>

            {/* C. Conversation History Scroll Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-stone-800 bg-[#0d0e10]/60">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-[#c5a059] to-[#ad8a43] text-white rounded-tr-none shadow-[0_4px_16px_rgba(197,160,89,0.18)] font-sans' 
                      : 'bg-[#151618] text-stone-200 rounded-tl-none border border-stone-800/80 shadow-[0_4px_12px_rgba(0,0,0,0.3)] font-sans'
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[8.5px] text-stone-500 font-sans tracking-wider mt-1 px-1 uppercase">
                    {msg.role === 'user' ? (language === 'af' ? 'U' : 'You') : 'Eleanor'} · {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              ))}

              {/* Quick Prompt Suggestions when conversation is young */}
              {messages.length <= 2 && (
                <div className="pt-2 pb-1">
                  <p className="text-[9px] font-sans uppercase tracking-[0.2em] text-stone-500 mb-2">
                    {language === 'af' ? 'Voorgestelde navrae:' : 'Suggested inquiries:'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {quickPrompts.map((qp, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          handleSubmitText(qp.query);
                        }}
                        className="text-[10px] font-sans text-stone-300 bg-stone-900/80 hover:bg-[#c5a059]/15 hover:text-[#e4caa0] border border-stone-800 hover:border-[#c5a059]/40 px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer"
                      >
                        {qp.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Confirmation Card */}
              {bookingDetails && (
                <div className="p-3.5 bg-[#c5a059]/10 border border-[#c5a059]/30 rounded-xl space-y-2.5 shadow-md">
                  <div className="flex items-start gap-2.5">
                    <Calendar className="text-[#c5a059] shrink-0 mt-0.5" size={15} />
                    <div>
                      <h4 className="text-xs font-serif font-medium text-white tracking-wide">
                        {language === 'af' ? "Kalender-Konsultasie Gereed" : "Consultation Slot Ready"}
                      </h4>
                      <p className="text-[11px] text-stone-300 mt-0.5 leading-relaxed">
                        {bookingDetails.projectType} · {new Date(bookingDetails.dateTime).toLocaleDateString(language === 'af' ? 'af-ZA' : 'en-ZA', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  
                  {!user ? (
                    <button
                      onClick={handleGoogleSignIn}
                      disabled={isSigningIn}
                      className="w-full py-2 bg-[#c5a059] hover:bg-[#b48f48] text-white text-[10px] uppercase tracking-widest font-semibold font-sans rounded transition-all duration-300 cursor-pointer shadow-md text-center"
                    >
                      {isSigningIn 
                        ? (language === 'af' ? "Meld aan..." : "Connecting...") 
                        : (language === 'af' ? "Koppel Google Kalender om te Bevestig" : "Connect Google Calendar to Confirm")}
                    </button>
                  ) : (
                    <button
                      onClick={() => executeGoogleBooking(bookingDetails, oauthToken!)}
                      disabled={isBooking}
                      className="w-full py-2 bg-[#c5a059] hover:bg-[#b48f48] text-white text-[10px] uppercase tracking-widest font-semibold font-sans rounded transition-all duration-300 cursor-pointer shadow-md text-center flex items-center justify-center gap-1.5"
                    >
                      {isBooking ? (
                        <>
                          <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>{language === 'af' ? "Bespreking word gedoen..." : "Securing Slot..."}</span>
                        </>
                      ) : (
                        language === 'af' ? "Bevestig Kalender-bespreking" : "Confirm Calendar Slot Now"
                      )}
                    </button>
                  )}
                </div>
              )}

              {isThinking && (
                <div className="flex items-center gap-2 text-stone-400 text-xs italic px-1">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#c5a059] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-[#c5a059] rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-[#c5a059] rounded-full animate-bounce" />
                  </div>
                  <span className="text-[11px] font-sans">
                    {language === 'af' ? "Eleanor verwerk u versoek..." : "Eleanor is consulting the atelier..."}
                  </span>
                </div>
              )}

              {speechError && (
                <div className="p-2.5 bg-red-950/40 border border-red-500/25 text-red-300 text-xs rounded-lg flex items-start gap-2">
                  <AlertCircle className="shrink-0 mt-0.5 text-red-400" size={13} />
                  <span>{speechError}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* D. Unified Luxury Input Capsule */}
            <div className="p-3.5 border-t border-stone-900/90 bg-stone-950/80 shrink-0 select-none">
              {/* Voice active transcription feedback banner */}
              {isListening && (
                <div className="mb-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                    <span className="text-xs text-amber-200 italic font-light truncate">
                      {textInput || (language === 'af' ? "Luister..." : "Listening...")}
                    </span>
                  </div>
                  <button 
                    onClick={toggleListening} 
                    className="text-[10px] text-amber-400 hover:text-amber-200 uppercase font-sans font-semibold ml-2 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmitText();
                }}
                className="flex items-center gap-2 bg-[#141517] border border-stone-800 focus-within:border-[#c5a059]/60 rounded-full px-2 py-1 transition-all duration-300 shadow-inner"
              >
                {/* Voice Mute Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setMuteVoice(prev => {
                      if (!prev) stopAllAudio();
                      return !prev;
                    });
                  }}
                  title={muteVoice ? "Unmute Eleanor" : "Mute Eleanor"}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    muteVoice ? 'text-stone-600 hover:text-stone-400' : 'text-[#c5a059] hover:text-[#e4caa0]'
                  }`}
                >
                  {muteVoice ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>

                {/* Text input */}
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={language === 'af' ? "Vra Eleanor of praat..." : "Inquire with Eleanor..."}
                  disabled={isThinking}
                  className="flex-grow bg-transparent text-white text-[13px] placeholder:text-stone-500 outline-none font-sans px-1"
                />

                {/* Voice Mic Trigger Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  title={isListening ? "Stop listening" : "Speak to Eleanor"}
                  className={`p-2 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center ${
                    isListening 
                      ? 'bg-amber-500 text-black animate-pulse shadow-[0_0_12px_#f59e0b]' 
                      : 'text-stone-400 hover:text-[#c5a059] hover:bg-stone-900'
                  }`}
                >
                  {isListening ? <MicOff size={15} /> : <Mic size={15} />}
                </button>

                {/* Send Button */}
                {textInput.trim() && (
                  <button
                    type="submit"
                    disabled={isThinking || !textInput.trim()}
                    className="p-2 bg-[#c5a059] hover:bg-[#b48f48] text-white rounded-full transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center shrink-0"
                  >
                    <Send size={13} />
                  </button>
                )}
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
