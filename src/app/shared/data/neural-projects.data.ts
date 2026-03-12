export interface ProjectNode {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link: string;
  image?: string;
  category: string;
  complexity: number; // 1-5
  impact: number; // 1-5
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface ProjectConnection {
  source: string;
  target: string;
  type: 'technology' | 'pattern' | 'domain';
  strength: number;
}

export const PROJECT_NODES: ProjectNode[] = [
  {
    id: 'august-solutions',
    name: 'August Integrated Solutions',
    description: 'Enterprise business solutions platform with custom workflows, scalable architecture, and seamless data integration.',
    technologies: ['Angular', 'Node.js', 'Express.js', 'PostgreSQL', 'TypeScript'],
    link: 'https://augustintegrated.co.za/',
    category: 'Enterprise',
    complexity: 5,
    impact: 5,
  },
  {
    id: 'global-master',
    name: 'Global Master',
    description: 'Modern agency website built with React. Clean, responsive design emphasizing functionality and beautiful user interface.',
    technologies: ['React', 'TypeScript', 'CSS/SCSS', 'Responsive Design'],
    link: 'https://global-master.netlify.app/',
    category: 'Web Design',
    complexity: 3,
    impact: 4,
  },
  {
    id: 'bright-group',
    name: 'Bright Group LTD',
    description: 'Premium technology solutions provider website. Professional platform showcasing services and building client trust.',
    technologies: ['Web Design', 'Performance Optimization', 'SEO', 'Responsive'],
    link: 'https://brightgroupltd.com/',
    category: 'Marketing',
    complexity: 2,
    impact: 3,
  },
];

export const PROJECT_CONNECTIONS: ProjectConnection[] = [
  // August & Global Master - both use TypeScript and modern frameworks
  { source: 'august-solutions', target: 'global-master', type: 'technology', strength: 0.8 },
  
  // August & Bright Group - both performance focused
  { source: 'august-solutions', target: 'bright-group', type: 'pattern', strength: 0.6 },
  
  // Global Master & Bright Group - both web design focused
  { source: 'global-master', target: 'bright-group', type: 'domain', strength: 0.7 },
];

export const PROJECT_TECH_CONNECTIONS: ProjectConnection[] = [
  // Technology connections to projects
  // Angular projects
  { source: 'august-solutions', target: 'angular-skill', type: 'technology', strength: 0.95 },
  
  // React projects
  { source: 'global-master', target: 'react-skill', type: 'technology', strength: 0.9 },
  
  // Node.js projects
  { source: 'august-solutions', target: 'nodejs-skill', type: 'technology', strength: 0.9 },
  
  // TypeScript usage
  { source: 'august-solutions', target: 'typescript-skill', type: 'technology', strength: 0.95 },
  { source: 'global-master', target: 'typescript-skill', type: 'technology', strength: 0.85 },
];
