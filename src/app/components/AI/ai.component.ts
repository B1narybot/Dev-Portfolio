import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-ai',
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ScrollRevealDirective],
})
export class AIComponent {
  showChatbot = false;
  chatMessages = [
    { type: 'bot', text: 'Hi! Ask me about projects, skills, or architecture.' },
  ];
  userMessage = '';

  toggleChatbot(): void {
    this.showChatbot = !this.showChatbot;
  }

  sendMessage(): void {
    if (this.userMessage.trim()) {
      this.chatMessages.push({ type: 'user', text: this.userMessage });
      // Simple demo response
      setTimeout(() => {
        this.chatMessages.push({
          type: 'bot',
          text: 'Thanks for your question! This is a demo. Real AI integration would use a backend API.',
        });
      }, 500);
      this.userMessage = '';
    }
  }
}

