import { ChatMessage, StructuredRfq } from '../types/chat';

export interface SendMessageOptions {
  message: string;
  history: ChatMessage[];
  currentRfq?: StructuredRfq | null;
  action?: 'confirm' | 'edit' | 'cancel';
}

export interface ChatServiceResponse {
  text: string;
  isError?: boolean;
  rfq?: StructuredRfq | null;
  intent?: string;
}

/**
 * Connects the Rajdeep AI chatbot frontend to the secure /api/chat backend.
 * Sends the user message, clean conversation history, and current RFQ state.
 * Never handles or exposes the GEMINI_API_KEY.
 */
export async function sendChatMessage(options: SendMessageOptions): Promise<ChatServiceResponse> {
  const { message, history, currentRfq, action } = options;
  const trimmed = message.trim();

  if (!trimmed && !action) {
    return {
      text: 'Please enter a message.',
      isError: true,
      rfq: currentRfq,
    };
  }

  // Format conversation history for multi-turn context (last 10 messages max)
  const conversation = history.slice(-10).map((msg) => ({
    sender: msg.sender,
    text: msg.text,
  }));

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: trimmed || (action === 'confirm' ? 'Confirm RFQ' : action === 'cancel' ? 'Cancel my quotation' : 'Edit details'),
        conversation,
        currentRfq: currentRfq || null,
        action: action || null,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      const errorMsg =
        data?.error ||
        "Sorry, I'm unable to respond right now. Please try again or contact Rajdeep Enterprises directly.";
      return {
        text: errorMsg,
        isError: true,
        rfq: currentRfq,
      };
    }

    return {
      text: data.reply || "I apologize, but I could not generate a response. Please contact Rajdeep Enterprises directly.",
      isError: false,
      rfq: data.rfq !== undefined ? data.rfq : currentRfq,
      intent: data.intent,
    };
  } catch {
    // Network or client fetch failure
    return {
      text: "Sorry, I'm unable to respond right now. Please try again or contact Rajdeep Enterprises directly.",
      isError: true,
      rfq: currentRfq,
    };
  }
}
