import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, RotateCcw, Sparkles } from 'lucide-react';
import { ChatMessage, ChatStatus, StructuredRfq } from '../../types/chat';
import { ChatMessageItem } from './ChatMessageItem';
import { ChatSuggestions } from './ChatSuggestions';
import { sendChatMessage } from '../../services/chatService';
import { submitAiRfq } from '../../services/rfqService';

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
  text: `Hello! 👋\nI'm Rajdeep AI, the Rajdeep Enterprises sales and sourcing assistant.\nCan't find your item in our online catalogue? No problem! Our online catalogue does not contain every item we can source or supply. Tell us what you need, the quantity, and any specifications you have, and we'll help you with a quotation.\nHow can I help you today?`,
  timestamp: formatCurrentTime(),
};

export const RajdeepChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputVal, setInputVal] = useState('');
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [showTooltip, setShowTooltip] = useState(true);
  const [currentRfq, setCurrentRfq] = useState<StructuredRfq | null>(null);

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

  const handleSendMessage = async (
    textToSend?: string,
    actionOverride?: 'confirm' | 'edit' | 'cancel' | 'send_requirement'
  ) => {
    const text = (textToSend || inputVal).trim();
    if ((!text && !actionOverride) || status === 'loading' || status === 'submitting') return;

    // Detect action intent from message text if not explicitly overridden
    let effectiveAction = actionOverride;
    if (!effectiveAction) {
      const lower = text.toLowerCase();
      if (lower === 'confirm & send' || lower === 'confirm rfq' || lower === 'confirm quotation' || lower === 'confirm') {
        effectiveAction = 'confirm';
      } else if (lower.includes('cancel my quotation') || lower === 'cancel rfq' || lower === 'cancel' || lower === 'cancel my requirement') {
        effectiveAction = 'cancel';
      } else if (lower === 'edit' || lower === 'edit details' || lower === 'edit rfq') {
        effectiveAction = 'edit';
      } else if (lower === 'send requirement') {
        effectiveAction = 'send_requirement';
      }
    }

    // Intercept confirm action to execute actual submission if ready
    if (effectiveAction === 'confirm') {
      await handleConfirmAndSubmit();
      return;
    }

    const userMessageText =
      text || (effectiveAction === 'cancel' ? 'Cancel requirement' : effectiveAction === 'send_requirement' ? 'Send Requirement' : 'Edit details');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userMessageText,
      timestamp: formatCurrentTime(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputVal('');
    setStatus('loading');

    try {
      const response = await sendChatMessage({
        message: userMessageText,
        history: newHistory,
        currentRfq,
        action: effectiveAction,
      });

      const updatedRfq = response.rfq !== undefined ? response.rfq : currentRfq;
      if (updatedRfq !== undefined) {
        setCurrentRfq(updatedRfq);
      }

      // Attach structured RFQ to AI message if ready for review, ready to submit, or confirmed
      const shouldAttachRfq = Boolean(
        updatedRfq &&
        (updatedRfq.status === 'ready_for_review' ||
         updatedRfq.status === 'ready_to_submit' ||
         updatedRfq.status === 'submitted' ||
         updatedRfq.status === 'confirmed' ||
         updatedRfq.status === 'cancelled' ||
         updatedRfq.submissionError)
      );

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: formatCurrentTime(),
        isError: response.isError,
        rfq: shouldAttachRfq ? updatedRfq! : undefined,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setStatus('idle');
    } catch {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Sorry, I encountered an issue processing your request. Please try again or reach out to our team directly at +91-9997993895.',
        timestamp: formatCurrentTime(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
      setStatus('error');
    }
  };

  // Real backend submission flow via /api/rfq
  const handleConfirmAndSubmit = async () => {
    if (!currentRfq) return;

    // Check if customer name and contact are available
    const hasName = Boolean(currentRfq.customerName && currentRfq.customerName.trim());
    const hasContact = Boolean(
      (currentRfq.phone && currentRfq.phone.trim()) ||
      (currentRfq.email && currentRfq.email.trim())
    );

    if (!hasName || !hasContact) {
      // Prompt user to provide contact info first
      const promptMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'To send your requirement to our team for an official quotation, please provide your name and a phone or WhatsApp number.',
        timestamp: formatCurrentTime(),
      };
      setMessages((prev) => [...prev, promptMessage]);
      inputRef.current?.focus();
      return;
    }

    setStatus('submitting');

    try {
      const result = await submitAiRfq({ rfq: currentRfq });

      if (result.success) {
        const submittedRfq: StructuredRfq = {
          ...currentRfq,
          status: 'submitted',
          rfqReference: result.rfqReference,
        };
        setCurrentRfq(submittedRfq);

        const successMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Your requirement has been sent to the Rajdeep Enterprises team.\n\nReference: ${result.rfqReference || 'RE-RFQ'}\nOur sales team will check the requirement and reach out with an official quotation.`,
          timestamp: formatCurrentTime(),
          rfq: submittedRfq,
        };

        setMessages((prev) => [...prev, successMessage]);
        setStatus('idle');
      } else {
        const failedRfq: StructuredRfq = {
          ...currentRfq,
          status: 'failed',
          submissionError: result.error,
        };
        setCurrentRfq(failedRfq);

        const failMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `We couldn't submit your requirement right now: ${result.error || 'Connection error'}. You can click "Retry Send" or call our team directly at +91 99979 93895.`,
          timestamp: formatCurrentTime(),
          isError: true,
          rfq: failedRfq,
        };

        setMessages((prev) => [...prev, failMessage]);
        setStatus('idle');
      }
    } catch {
      const failedRfq: StructuredRfq = {
        ...currentRfq,
        status: 'failed',
        submissionError: 'Network connection error',
      };
      setCurrentRfq(failedRfq);

      const errorMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Failed to connect to the quotation service. Please call our team directly at +91 99979 93895.',
        timestamp: formatCurrentTime(),
        isError: true,
        rfq: failedRfq,
      };

      setMessages((prev) => [...prev, errorMessage]);
      setStatus('idle');
    }
  };

  const handleSendRequirement = () => {
    handleSendMessage('Send Requirement', 'send_requirement');
  };

  const handleContinueChatting = () => {
    inputRef.current?.focus();
  };

  const handleEditRfq = () => {
    inputRef.current?.focus();
    setInputVal('');
    handleSendMessage('I would like to edit my requirement.', 'edit');
  };

  const handleCancelRfq = () => {
    handleSendMessage('Cancel my requirement', 'cancel');
  };

  const handleResetChat = () => {
    setCurrentRfq(null);
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
        } bottom-36 right-4 sm:bottom-40 md:bottom-42 md:right-5`}
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
              className="text-slate-400 hover:text-slate-200 ml-1 cursor-pointer"
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
                SALES & RFQ
              </span>
            </span>
            <span className="text-[10px] text-slate-400 leading-tight">Instant Sourcing</span>
          </div>
        </button>
      </div>

      {/* 2. Chat Modal Dialog Window */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          role="dialog"
          aria-label="Rajdeep AI Sales & Sourcing Assistant"
          aria-modal="true"
          className="fixed z-50 bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[420px] md:w-[450px] h-[600px] max-h-[85vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-900 to-slate-800 border border-orange-500 flex items-center justify-center text-orange-400 shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-wide">
                    Rajdeep AI
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    SALES & SOURCING
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Catalogue & Custom Sourcing • Quotes
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                aria-label="Reset conversation"
                title="Restart chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3 space-y-1 bg-slate-950/60 industrial-grid-dark scroll-smooth"
            role="log"
            aria-live="polite"
          >
            {messages.map((msg) => (
              <ChatMessageItem
                key={msg.id}
                message={msg}
                onConfirmRfq={handleConfirmAndSubmit}
                onEditRfq={handleEditRfq}
                onCancelRfq={handleCancelRfq}
                onSendRequirement={handleSendRequirement}
                onContinueChatting={handleContinueChatting}
                isActionDisabled={status === 'loading' || status === 'submitting'}
              />
            ))}

            {/* Typing / Loading Indicator */}
            {(status === 'loading' || status === 'submitting') && (
              <div className="flex items-end gap-2.5 my-2.5 justify-start">
                <div className="shrink-0 w-8 h-8 rounded-full bg-slate-900 border border-orange-500/60 flex items-center justify-center text-orange-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl rounded-bl-xs px-4 py-3 text-slate-300 shadow-sm flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 mr-1">
                    {status === 'submitting' ? 'Transmitting to Rajdeep team' : 'Rajdeep AI is thinking'}
                  </span>
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
            onSelectSuggestion={(q) => {
              if (q === 'Send Requirement') {
                handleSendRequirement();
              } else {
                handleSendMessage(q);
              }
            }}
            disabled={status === 'loading' || status === 'submitting'}
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
                placeholder="Ask about products or send requirement..."
                disabled={status === 'loading' || status === 'submitting'}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                aria-label="Your message or product requirement"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || status === 'loading' || status === 'submitting'}
                className="p-2.5 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 disabled:opacity-40 disabled:hover:bg-orange-600 text-white rounded-xl transition-all shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-500">
              <span>Rajdeep Enterprises • Mathura Depot</span>
              <span>Fast Quotes & Pan-India Sourcing</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
