import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
})
export class ProjectsComponent {
  projects: Project[] = [
    {
      id: 1,
      name: 'August Integrated Solutions',
      description: 'Enterprise business solutions platform with custom workflows, scalable architecture, and seamless data integration for operational efficiency.',
      tech: ['Angular', 'Node.js', 'Express.js', 'PostgreSQL', 'TypeScript'],
      link: 'https://augustintegrated.co.za/',
      image: '/assets/gradient-01 2.png',
    },
    {
      id: 2,
      name: 'Global Master',
      description: 'Modern agency website built with React. Clean, responsive design emphasizing functionality and beautiful user interface.',
      tech: ['React', 'TypeScript', 'Responsive Design', 'CSS/SCSS'],
      link: 'https://global-master.netlify.app/',
      image: '/assets/gradient-01 2.png',
    },
    {
      id: 3,
      name: 'Bright Group LTD',
      description: 'Premium technology solutions provider website. Professional platform showcasing services and building client trust through elegant design.',
      tech: ['Web Design', 'Performance Optimization', 'SEO', 'Responsive'],
      link: 'https://brightgroupltd.com/',
      image: '/assets/gradient-01 2.png',
    },
  ];
}

