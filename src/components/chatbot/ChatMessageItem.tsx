import React from 'react';
import { ChatMessage, StructuredRfq } from '../../types/chat';
import { Bot, User, AlertCircle } from 'lucide-react';
import { RfqSummaryCard } from './RfqSummaryCard';

interface ChatMessageItemProps {
  message: ChatMessage;
  onConfirmRfq?: (rfq: StructuredRfq) => void;
  onEditRfq?: (rfq: StructuredRfq) => void;
  onCancelRfq?: (rfq: StructuredRfq) => void;
  isActionDisabled?: boolean;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onConfirmRfq,
  onEditRfq,
  onCancelRfq,
  isActionDisabled = false,
}) => {
  const isUser = message.sender === 'user';

  // Format simple markdown (bold **text**, bullets •, newlines)
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      // Parse **bold** parts
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <React.Fragment key={lineIdx}>
          {parts.map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={partIdx} className="font-semibold text-white">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={partIdx}>{part}</span>;
          })}
          {lineIdx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div
      className={`flex items-end gap-2.5 my-2.5 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
      role="listitem"
    >
      {/* AI Avatar */}
      {!isUser && (
        <div
          className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-slate-900 to-slate-800 border border-orange-500/60 flex items-center justify-center shadow-md text-orange-400"
          aria-hidden="true"
        >
          <Bot className="w-4 h-4" />
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`max-w-[88%] sm:max-w-[80%] flex flex-col ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`rounded-2xl px-4 py-2.5 text-[13px] sm:text-sm leading-relaxed shadow-sm w-full ${
            isUser
              ? 'bg-orange-600 text-white rounded-br-xs font-medium'
              : message.isError
              ? 'bg-rose-950/80 border border-rose-700/60 text-rose-200 rounded-bl-xs'
              : 'bg-slate-800/95 border border-slate-700/80 text-slate-200 rounded-bl-xs'
          }`}
        >
          {message.isError && (
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold mb-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Response error</span>
            </div>
          )}
          <div className="break-words select-text">
            {renderFormattedText(message.text)}
          </div>

          {/* Structured RFQ summary card if present */}
          {message.rfq && (
            <RfqSummaryCard
              rfq={message.rfq}
              onConfirm={onConfirmRfq ? () => onConfirmRfq(message.rfq!) : undefined}
              onEdit={onEditRfq ? () => onEditRfq(message.rfq!) : undefined}
              onCancel={onCancelRfq ? () => onCancelRfq(message.rfq!) : undefined}
              disabled={isActionDisabled}
            />
          )}
        </div>

        {/* Timestamp */}
        <span
          className="text-[10px] text-slate-400 mt-1 px-1"
          aria-label={`Sent at ${message.timestamp}`}
        >
          {message.timestamp}
        </span>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div
          className="shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shadow-sm"
          aria-hidden="true"
        >
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
