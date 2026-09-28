export type MessageSender = 'user' | 'ai';

export type RfqStatus = 'draft' | 'ready_for_review' | 'confirmed' | 'cancelled';

export interface StructuredRfq {
  customerName?: string;
  companyName?: string;
  phone?: string;
  email?: string;
  product?: string;
  material?: string;
  grade?: string;
  quantity?: string;
  unit?: string;
  thickness?: string;
  dimensions?: string;
  specifications?: string;
  application?: string;
  deliveryLocation?: string;
  requiredBy?: string;
  additionalNotes?: string;
  boqProvided?: boolean;
  status: RfqStatus;
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: string;
  isError?: boolean;
  rfq?: StructuredRfq;
  isRfqSummary?: boolean;
}

export interface SuggestedQuestion {
  id: string;
  text: string;
}

export type ChatStatus = 'idle' | 'loading' | 'error';
