import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class HeroComponent implements OnInit, AfterViewInit {
  displayedText = '';
  fullText = 'Building Scalable Systems';
  isTypingComplete = false;
  headlineVisible = false;

  ngOnInit(): void {
    // Animation starts after component init
  }

  ngAfterViewInit(): void {
    // Trigger headline animation
    setTimeout(() => {
      this.headlineVisible = true;
    }, 100);

    // Start typing animation after headline appears
    setTimeout(() => {
      this.startTypeAnimation();
    }, 600);
  }

  private startTypeAnimation(): void {
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < this.fullText.length) {
        this.displayedText += this.fullText[index];
        index++;
      } else {
        clearInterval(typeInterval);
        this.isTypingComplete = true;
      }
    }, 50);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

