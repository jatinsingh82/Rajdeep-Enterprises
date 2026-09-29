import React from 'react';
import { ChatMessage, StructuredRfq } from '../../types/chat';
import { Bot, User, AlertCircle, Send, MessageSquare } from 'lucide-react';
import { RfqSummaryCard } from './RfqSummaryCard';

interface ChatMessageItemProps {
  message: ChatMessage;
  onConfirmRfq?: (rfq: StructuredRfq) => void;
  onEditRfq?: (rfq: StructuredRfq) => void;
  onCancelRfq?: (rfq: StructuredRfq) => void;
  onSendRequirement?: () => void;
  onContinueChatting?: () => void;
  isActionDisabled?: boolean;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onConfirmRfq,
  onEditRfq,
  onCancelRfq,
  onSendRequirement,
  onContinueChatting,
  isActionDisabled = false,
}) => {
  const isUser = message.sender === 'user';

  // Format simple markdown (bold **text**, bullets •, newlines)
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
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

  const offersSendRequirement =
    !isUser &&
    !message.rfq &&
    message.text.includes('send this requirement to our team');

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

          {/* Inline Action Buttons if message suggests sending requirement */}
          {offersSendRequirement && (
            <div className="mt-3 pt-2.5 border-t border-slate-700/70 flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={isActionDisabled}
                onClick={onSendRequirement}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>Send Requirement</span>
              </button>
              <button
                type="button"
                disabled={isActionDisabled}
                onClick={onContinueChatting}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-700/70 hover:bg-slate-700 text-slate-300 hover:text-white text-xs rounded-lg transition disabled:opacity-50 cursor-pointer"
              >
                <MessageSquare className="w-3 h-3 text-slate-400" />
                <span>Continue Chatting</span>
              </button>
            </div>
          )}

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
