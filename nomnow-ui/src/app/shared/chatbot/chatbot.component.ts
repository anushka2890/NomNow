import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../models/chatMessage.model';

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
  standalone: true
})
export class ChatbotComponent {
  messages: ChatMessage[] = [];
  userInput = '';
  isBotTyping = false;
  suggestions: string[] = [];
  @Output() close = new EventEmitter<void>();

  constructor(private chatService: ChatService) {}

  sendMessage(userText?: string) {
    const input = userText?.trim() || this.userInput.trim();
    if (!input) return;

    this.messages.push({ text: input, sender: 'user' });
    this.userInput = '';
    this.isBotTyping = true;

    this.chatService.sendMessage(input).subscribe(res => {
      this.isBotTyping = false;
      this.messages.push(res);

      const text = res.text.toLowerCase();
      if (
        text.includes('successfully cancelled') ||
        text.includes('currently:') ||
        text.includes('cannot be cancelled') ||
        text.includes('couldn’t fetch')
      ) {
        this.messages.push({
          text: 'Is there anything else I can help you with?',
          sender: 'bot'
        });
        this.suggestions = ['Track another order', 'Cancel another order', 'Close chat'];
      }
      else {
        this.suggestions = res.suggestions || [];
      }
    });
  }


  onSuggestionClick(suggestion: string) {
  if (suggestion === 'Close chat') {
    this.messages.push({ text: 'Okay, feel free to ask if you need anything else!', sender: 'bot' });
    this.suggestions = [];
    return;
  }

  this.sendMessage(suggestion);
}
  closeChat() {
    this.close.emit();
  }

}
