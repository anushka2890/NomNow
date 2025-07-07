export interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  suggestions?: string[]; // 💡 Add this line
}
