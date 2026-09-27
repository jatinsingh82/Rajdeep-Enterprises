export type MessageSender = 'user' | 'ai';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: string;
  isError?: boolean;
}

export interface SuggestedQuestion {
  id: string;
  text: string;
}

export type ChatStatus = 'idle' | 'loading' | 'error';
