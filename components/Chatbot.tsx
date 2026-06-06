import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Minimize2, Mic, MicOff } from 'lucide-react';
import { chatWithAssistant } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const CHATBOT_CONFIG = {
  openingMessage: "Hi 👋 Are you looking for custom furniture or furniture restoration for your home?",
  qualificationQuestions: [
    {
      question: "What type of project do you need help with?",
      options: ["Custom furniture", "Furniture restoration", "Kitchen installation", "Built-in cupboards"]
    },
    {
      question: "Which room is this project for?",
      options: ["Kitchen", "Living room", "Bedroom", "Office", "Other"]
    },
    {
      question: "Do you already have measurements or photos of the space?",
      options: ["Yes", "Not yet", "I need help with measurements"]
    },
    {
      question: "When would you like the project completed?",
      options: ["As soon as possible", "Within 1 month", "Within 3 months", "Just researching"]
    }
  ]
};

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: CHATBOT_CONFIG.openingMessage }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  // Conversation State
  const [step, setStep] = useState(0); // 0: opening, 1-4: qualification, 5: booking

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, errorMessage, step]);

  // ... (SpeechRecognition useEffect and toggleListening remain the same)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        
        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setInputValue(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInputValue('');
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Could not start speech recognition:", e);
      }
    }
  };

  const handleOptionSelect = (option: string) => {
    setMessages(prev => [...prev, { role: 'user', text: option }]);
    
    if (step < CHATBOT_CONFIG.qualificationQuestions.length) {
      const question = CHATBOT_CONFIG.qualificationQuestions[step].question;
      setCollectedData(prev => ({ ...prev, [question]: option }));
      
      const nextStep = step + 1;
      setStep(nextStep);
      
      if (nextStep < CHATBOT_CONFIG.qualificationQuestions.length) {
        setMessages(prev => [...prev, { role: 'model', text: CHATBOT_CONFIG.qualificationQuestions[nextStep].question }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: "The best next step is a quick consultation so we can understand your project and give you accurate pricing. Would you like to book a free consultation?" }]);
      }
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, retryMessage?: string) => {
    e?.preventDefault();
    
    // Handle Booking Flow
    if (step === CHATBOT_CONFIG.qualificationQuestions.length) {
      const msg = (retryMessage || inputValue).toLowerCase();
      setMessages(prev => [...prev, { role: 'user', text: retryMessage || inputValue }]);
      setInputValue('');
      
      if (msg.includes('yes')) {
        setMessages(prev => [...prev, { role: 'model', text: "Great. One of our team members will reach out to you shortly to schedule your consultation." }]);
        setStep(-1); // End flow
      } else {
        setMessages(prev => [...prev, { role: 'model', text: "No problem. When you're ready we can book a consultation to plan your project." }]);
        setStep(-1);
      }
      return;
    }

    // Default Chat Flow
    const messageToSend = retryMessage || inputValue.trim();
    if (!messageToSend) return;

    if (!retryMessage) {
      setInputValue('');
      setMessages(prev => [...prev, { role: 'user', text: messageToSend }]);
    }
    
    setIsTyping(true);
    setErrorMessage(null);

    try {
      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const responseText = await chatWithAssistant(messageToSend, history);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[350px] md:w-[400px] h-[500px] rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200 mb-4 animate-fade-in-up transition-all duration-300">
          {/* Header */}
          <div className="bg-elegant-dark text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="font-serif font-bold tracking-wide">Furniture Project Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors">
              <Minimize2 size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-elegant-gold text-white rounded-br-none' : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Qualification Options */}
            {step < CHATBOT_CONFIG.qualificationQuestions.length && messages[messages.length-1].role === 'model' && (
              <div className="flex flex-col gap-2 mt-2">
                {CHATBOT_CONFIG.qualificationQuestions[step].options.map((opt, idx) => (
                  <button key={idx} onClick={() => handleOptionSelect(opt)} className="text-left text-sm p-2 bg-white border border-gray-200 rounded-lg hover:border-elegant-gold hover:text-elegant-gold transition-colors">
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* ... (Typing, Error, EndRef) */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-500 p-3 rounded-lg rounded-bl-none border border-gray-100 shadow-sm flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-xs italic">Typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
            {recognitionRef.current && (
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-md transition-colors flex items-center justify-center ${
                  isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            )}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isListening ? "Listening..." : "Type your message..."}
              className="flex-1 p-2 border border-gray-200 rounded-md focus:outline-none focus:border-elegant-gold focus:ring-1 focus:ring-elegant-gold text-sm"
            />
            <button type="submit" className="p-2 bg-elegant-dark text-white rounded-md hover:bg-elegant-gold">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center
          ${isOpen ? 'bg-gray-200 text-gray-600 rotate-90' : 'bg-elegant-gold text-white hover:bg-elegant-dark'}
        `}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};
