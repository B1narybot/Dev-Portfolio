import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

interface PhilosophyItem {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
})
export class AboutComponent {
  philosophyItems: PhilosophyItem[] = [
    {
      icon: '🏗️',
      title: 'System Design',
      description: 'Architecture-first approach to building scalable, maintainable systems that grow with your needs.',
    },
    {
      icon: '⚡',
      title: 'Performance',
      description: 'Every byte matters. Optimizing for speed, efficiency, and user experience across all devices.',
    },
    {
      icon: '🔧',
      title: 'Clean Code',
      description: 'Writing code that\'s easy to understand, test, and maintain. Technical debt is a real cost.',
    },
    {
      icon: '🎯',
      title: 'Problem Solving',
      description: 'Deep understanding of business requirements translated into elegant technical solutions.',
    },
  ];
}

