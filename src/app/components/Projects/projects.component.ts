import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { NeuralProjectsComponent } from '../../shared/components/neural-projects/neural-projects.component';

interface Project {
  id: number;
  name: string;
  description: string;
  tech: string[];
  link: string;
  github?: string;
  image?: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective, NeuralProjectsComponent],
})
export class ProjectsComponent {
  projects: Project[] = [
    {
      id: 1,
      name: 'House-of-Valta',
      description: 'Elite Trading house dedicated to the mastery & trading of global financial markets Specializing in XAU/USD.',
      tech: ['Angular', 'Node.js', 'Express.js', 'PostgreSQL', 'TypeScript'],
      link: 'https://house-of-valta.netlify.app/',
      image: '/assets/gradient-01 2.png',
    },
    {
      id: 2,
      name: 'Bright Group LTD',
      description: 'Premium technology solutions provider website. Professional platform showcasing services and building client trust through elegant design.',
      tech: ['Web Design', 'Performance Optimization', 'SEO', 'Responsive'],
      link: 'https://brightgroupltd.com/',
      image: '/assets/gradient-01 2.png',
    },
    {
      id: 3,
      name: 'Bleval.inc',
      description: 'Digital Agency specializing in creating user centric digital solutions that sell and provide real value.',
      tech: ['Angular', 'Node.js', 'Firebase', 'Express'],
      link: 'https://blevalincweb.netlify.app/home',
      image: '/assets/gradient-01 2.png',
    },
  ];
}

