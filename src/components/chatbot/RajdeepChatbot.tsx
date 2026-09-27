import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, RotateCcw, Sparkles } from 'lucide-react';
import { ChatMessage, ChatStatus } from '../../types/chat';
import { ChatMessageItem } from './ChatMessageItem';
import { ChatSuggestions } from './ChatSuggestions';
import { sendChatMessage } from '../../services/chatService';

function formatCurrentTime(): string {
  return new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome-message',
  sender: 'ai',
  text: `Hello! 👋\nI'm Rajdeep AI, the Rajdeep Enterprises assistant.\nI can help you with products, materials, quotations, enquiries, and company information.\nHow can I help you today?`,
  timestamp: formatCurrentTime(),
};

export const RajdeepChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputVal, setInputVal] = useState('');
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [showTooltip, setShowTooltip] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update or status changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input when opened on non-touch devices
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages, status]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || status === 'loading') return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: formatCurrentTime(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputVal('');
    setStatus('loading');

    try {
      const response = await sendChatMessage({
        message: text,
        history: newHistory,
      });

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: formatCurrentTime(),
        isError: response.isError,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setStatus('idle');
    } catch {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Sorry, I encountered an issue processing your request. Please try again or reach out to our team at +91-9997993895.',
        timestamp: formatCurrentTime(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
      setStatus('error');
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        ...INITIAL_MESSAGE,
        id: `welcome-${Date.now()}`,
        timestamp: formatCurrentTime(),
      },
    ]);
    setStatus('idle');
    inputRef.current?.focus();
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* 1. Floating Launch Button in Bottom-Right Corner */}
      <div
        className={`fixed z-40 flex flex-col items-end transition-all duration-200 ${
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        } bottom-18 right-4 md:bottom-22 md:right-5`}
      >
        {/* Subtle helper tooltip on desktop */}
        {showTooltip && (
          <div className="hidden lg:flex items-center gap-2 mb-2 bg-slate-900 text-slate-100 text-xs py-1.5 px-3 rounded-lg shadow-xl border border-slate-700/80 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="font-medium text-[11px]">Chat with Rajdeep AI</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-slate-400 hover:text-slate-200 ml-1"
              aria-label="Dismiss tooltip"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <button
          id="rajdeep-ai-toggle-btn"
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 h-13 px-4 rounded-full bg-slate-950 hover:bg-slate-900 active:bg-slate-950 text-white shadow-xl border-2 border-orange-500/80 hover:border-orange-400 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 cursor-pointer"
          aria-label="Open Rajdeep AI Assistant"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        >
          {/* AI Icon with subtle glow */}
          <div className="relative flex items-center justify-center">
            <Bot className="w-6 h-6 text-orange-400 group-hover:text-orange-300 transition-colors" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full animate-pulse" />
          </div>

          <div className="flex flex-col items-start pr-1 text-left hidden sm:flex">
            <span className="text-xs font-bold text-white tracking-wide leading-tight flex items-center gap-1">
              Rajdeep AI
              <span className="inline-block px-1 py-0.2 text-[9px] bg-orange-500/20 text-orange-400 rounded font-semibold border border-orange-500/30">
                PRO
              </span>
            </span>
            <span className="text-[10px] text-slate-400 leading-tight">Instant Assistant</span>
          </div>
        </button>
      </div>

      {/* 2. Chatbot Window Modal Container */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          role="dialog"
          aria-modal="true"
          aria-label="Rajdeep AI Chat Assistant"
          className="fixed z-50 flex flex-col bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200
            inset-x-2 bottom-2 h-[88vh] max-h-[640px] rounded-2xl
            sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[600px] sm:max-h-[85vh]"
        >
          {/* Header */}
          <header className="relative bg-slate-950 text-white px-4 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
            {/* Top decorative hazard line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />

            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-9 h-9 rounded-full bg-slate-900 border border-orange-500/60 flex items-center justify-center text-orange-400 shrink-0">
                <Bot className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-bold text-white tracking-wide truncate">
                    Rajdeep AI
                  </h2>
                  <span className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  Rajdeep Enterprises Assistant
                </p>
              </div>
            </div>

            {/* Header Action Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
                title="Restart conversation"
                aria-label="Restart conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
                title="Close chat window"
                aria-label="Close Rajdeep AI"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Messages Scroll Area */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3 space-y-1 bg-slate-950/60 industrial-grid-dark scroll-smooth"
            role="log"
            aria-live="polite"
          >
            {messages.map((msg) => (
              <ChatMessageItem key={msg.id} message={msg} />
            ))}

            {/* Typing / Loading Indicator */}
            {status === 'loading' && (
              <div className="flex items-end gap-2.5 my-2.5 justify-start">
                <div className="shrink-0 w-8 h-8 rounded-full bg-slate-900 border border-orange-500/60 flex items-center justify-center text-orange-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl rounded-bl-xs px-4 py-3 text-slate-300 shadow-sm flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 mr-1">Rajdeep AI is thinking</span>
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions Area */}
          <ChatSuggestions
            onSelectSuggestion={(q) => handleSendMessage(q)}
            disabled={status === 'loading'}
          />

          {/* Message Input Area */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDownInput}
                placeholder="Ask Rajdeep AI anything..."
                disabled={status === 'loading'}
                className="flex-1 bg-slate-900 text-slate-100 placeholder-slate-500 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition disabled:opacity-50"
                aria-label="Message to Rajdeep AI"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || status === 'loading'}
                className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition shadow-md cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Disclaimer required by user brief */}
            <p className="mt-2 text-[10px] text-slate-500 text-center leading-tight select-none">
              AI-generated responses may not always be accurate. For final pricing, availability and quotations, please contact Rajdeep Enterprises.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
