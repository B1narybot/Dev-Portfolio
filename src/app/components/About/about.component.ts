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
      icon: '�',
      title: 'User Experience',
      description: 'Prioritizing intuitive, accessible interfaces. Every detail matters—from responsive layouts to smooth interactions that delight users.',
    },
    {
      icon: '⚡',
      title: 'Performance',
      description: 'Optimizing for speed and efficiency. Fast-loading, smooth-running applications that respect user bandwidth and device capabilities.',
    },
    {
      icon: '🔧',
      title: 'Clean Code',
      description: 'Writing maintainable, scalable component architectures. Code that others can understand and build upon with confidence.',
    },
    {
      icon: '🎯',
      title: 'Attention to Detail',
      description: 'Pixel-perfect implementations with consistent design systems. Quality is in the refinement and attention to every interaction.',
    },
  ];
}

