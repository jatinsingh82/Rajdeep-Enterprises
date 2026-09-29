import React from 'react';
import { SuggestedQuestion } from '../../types/chat';
import { HelpCircle, ChevronRight, Send, Search } from 'lucide-react';

interface ChatSuggestionsProps {
  onSelectSuggestion: (questionText: string) => void;
  disabled?: boolean;
}

export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  { id: 'sq-send', text: 'Send Requirement' },
  { id: 'sq-not-found', text: "Can't find your item?" },
  { id: 'sq-1', text: 'What products do you supply?' },
  { id: 'sq-2', text: 'Tell me about your materials' },
  { id: 'sq-3', text: 'How can I contact Rajdeep Enterprises?' },
];

export const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({
  onSelectSuggestion,
  disabled = false,
}) => {
  return (
    <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80">
      <div className="flex items-center gap-1.5 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        <HelpCircle className="w-3.5 h-3.5 text-orange-400" />
        <span>Quick actions & suggestions:</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {SUGGESTED_QUESTIONS.map((q) => {
          const isSendAction = q.id === 'sq-send';
          const isNotFound = q.id === 'sq-not-found';
          return (
            <button
              key={q.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectSuggestion(q.text)}
              className={`group inline-flex items-center gap-1.5 text-left text-xs rounded-full px-3 py-1.5 transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${
                isSendAction
                  ? 'bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-semibold border border-orange-500 shadow-sm'
                  : isNotFound
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-medium'
                  : 'bg-slate-800/90 hover:bg-orange-600/20 active:bg-orange-600/30 text-slate-200 hover:text-orange-300 border border-slate-700 hover:border-orange-500/50'
              }`}
              aria-label={`Action: ${q.text}`}
            >
              {isSendAction ? (
                <Send className="w-3 h-3 text-white" />
              ) : isNotFound ? (
                <Search className="w-3 h-3 text-amber-400" />
              ) : null}
              <span>{q.text}</span>
              <ChevronRight
                className={`w-3 h-3 transition-transform group-hover:translate-x-0.5 ${
                  isSendAction ? 'text-orange-200' : 'text-slate-500 group-hover:text-orange-400'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
