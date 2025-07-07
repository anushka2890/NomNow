import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
  standalone: true
})
export class ChatbotComponent {
  messages: { text: string; isUser: boolean }[] = [];
  userInput = '';
constructor(private chatService: ChatService) {}

  sendMessage() {
    if (!this.userInput.trim()) return;

    const message = this.userInput.trim();
    this.messages.push({ text: message, isUser: true });
    this.userInput = '';

    this.chatService.sendMessage(message).subscribe({
      next: (response) => {
        this.messages.push({ text: response.reply, isUser: false });
      },
      error: () => {
        this.messages.push({
          text: 'Sorry, something went wrong.',
          isUser: false,
        });
      },
    });
  }
}
