import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
constructor(private chatService: ChatService) {}

sendMessage(userInput: string) {
  if (!userInput.trim()) return;

  this.messages.push({ text: userInput, sender: 'user' });
  this.chatService.sendMessage(userInput).subscribe(res => {
    this.messages.push(res);
  });
}

}
