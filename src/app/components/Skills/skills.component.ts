import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Skill {
  name: string;
  proficiency: number;
  category: string;
  icon?: string;
}

interface SkillCategory {
  name: string;
  icon: string;
  skills: Skill[];
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class SkillsComponent {
  skillCategories: SkillCategory[] = [
    {
      name: 'Frontend',
      icon: '🎨',
      skills: [
        { name: 'Angular', proficiency: 95, category: 'Frontend' },
        { name: 'React', proficiency: 85, category: 'Frontend' },
        { name: 'TypeScript', proficiency: 92, category: 'Frontend' },
        { name: 'CSS/SCSS', proficiency: 90, category: 'Frontend' },
      ],
    },
    {
      name: 'Backend',
      icon: '⚙️',
      skills: [
        { name: 'Node.js', proficiency: 90, category: 'Backend' },
        { name: 'Express.js', proficiency: 88, category: 'Backend' },
        { name: 'REST APIs', proficiency: 92, category: 'Backend' },
        { name: 'Database Design', proficiency: 85, category: 'Backend' },
      ],
    },
    {
      name: 'Data & Infrastructure',
      icon: '🗄️',
      skills: [
        { name: 'PostgreSQL', proficiency: 88, category: 'Data' },
        { name: 'MongoDB', proficiency: 82, category: 'Data' },
        { name: 'Docker', proficiency: 80, category: 'Infrastructure' },
        { name: 'Git/CI-CD', proficiency: 90, category: 'Infrastructure' },
      ],
    },
    {
      name: 'Tools & Others',
      icon: '🛠️',
      skills: [
        { name: 'System Design', proficiency: 90, category: 'Tools' },
        { name: 'Problem Solving', proficiency: 95, category: 'Tools' },
        { name: 'Performance Opt.', proficiency: 88, category: 'Tools' },
        { name: 'Agile/Scrum', proficiency: 85, category: 'Tools' },
      ],
    },
  ];
}

