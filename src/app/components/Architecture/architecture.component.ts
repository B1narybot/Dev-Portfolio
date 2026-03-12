import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ArchitectureExample {
  title: string;
  problem: string;
  solution: string;
  approach: string;
  icon: string;
}

@Component({
  selector: 'app-architecture',
  templateUrl: './architecture.component.html',
  styleUrls: ['./architecture.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ArchitectureComponent {
  architectureExamples: ArchitectureExample[] = [
    {
      title: 'API Architecture',
      icon: '🏗️',
      problem: 'Need for scalable, maintainable backend APIs handling millions of requests',
      solution: 'RESTful architecture with proper versioning, rate limiting, and caching strategies',
      approach: 'Node.js/Express for performance, PostgreSQL for data integrity, Redis for caching',
    },
    {
      title: 'Frontend Architecture',
      icon: '⚡',
      problem: 'Managing complex state and ensuring component reusability across large applications',
      solution: 'Component-based architecture with reactive patterns and unidirectional data flow',
      approach: 'Angular/React with TypeScript, proper separation of concerns, lazy loading modules',
    },
    {
      title: 'Scalability Design',
      icon: '📈',
      problem: 'Applications must gracefully handle growth from 1K to 1M+ users',
      solution: 'Horizontal scaling with load balancing, database optimization, and CDN integration',
      approach: 'Microservices where appropriate, database indexing, query optimization, caching strategies',
    },
  ];
}

