import React from 'react';
import { SuggestedQuestion } from '../../types/chat';
import { HelpCircle, ChevronRight } from 'lucide-react';

interface ChatSuggestionsProps {
  onSelectSuggestion: (questionText: string) => void;
  disabled?: boolean;
}

export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  { id: 'sq-1', text: 'What products do you supply?' },
  { id: 'sq-2', text: 'I need a quotation' },
  { id: 'sq-3', text: "Can't find your item?" },
  { id: 'sq-4', text: 'Tell me about your materials' },
  { id: 'sq-5', text: 'How can I contact Rajdeep Enterprises?' },
];

export const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({
  onSelectSuggestion,
  disabled = false,
}) => {
  return (
    <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80">
      <div className="flex items-center gap-1.5 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        <HelpCircle className="w-3.5 h-3.5 text-orange-400" />
        <span>Suggested questions:</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectSuggestion(q.text)}
            className="group inline-flex items-center gap-1.5 text-left text-xs bg-slate-800/90 hover:bg-orange-600/20 active:bg-orange-600/30 text-slate-200 hover:text-orange-300 border border-slate-700 hover:border-orange-500/50 rounded-full px-3 py-1.5 transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            aria-label={`Ask: ${q.text}`}
          >
            <span>{q.text}</span>
            <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        ))}
      </div>
    </div>
  );
};
