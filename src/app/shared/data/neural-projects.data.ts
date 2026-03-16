export interface ProjectNode {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link: string;
  image?: string;
  category: string;
  type: 'root' | 'branch' | 'project';
  complexity?: number; // 1-5
  impact?: number; // 1-5
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
  // Root Node - Center
  {
    id: 'root-projects',
    name: 'Featured Work',
    description: 'Collection of professional projects',
    technologies: [],
    link: '',
    category: 'Root',
    type: 'root',
    complexity: 5,
    impact: 5,
    x: 0,
    y: 0,
  },

  // Projects: Left side (odd indices)
  {
    id: 'august-solutions',
    name: 'August Solutions',
    description: 'Enterprise business solutions platform with custom workflows, scalable architecture, and seamless data integration.',
    technologies: ['Angular', 'Node.js', 'Express.js', 'PostgreSQL', 'TypeScript'],
    link: 'https://augustintegrated.co.za/',
    category: 'Web',
    type: 'project',
    complexity: 5,
    impact: 5,
  },

  // Projects: Right side (even indices)
  {
    id: 'global-master',
    name: 'Global Master',
    description: 'Modern agency website. Clean, responsive design emphasizing functionality and beautiful user interface.',
    technologies: ['React', 'TypeScript', 'CSS/SCSS', 'Responsive Design'],
    link: 'https://global-master.netlify.app/',
    category: 'Web',
    type: 'project',
    complexity: 3,
    impact: 4,
  },

  // Projects: Left side
  {
    id: 'bright-group',
    name: 'Bright Group',
    description: 'Premium technology solutions provider website. Professional platform showcasing services and building client trust.',
    technologies: ['Web Design', 'Performance Optimization', 'SEO', 'Responsive'],
    link: 'https://brightgroupltd.com/',
    category: 'Web',
    type: 'project',
    complexity: 2,
    impact: 3,
  },
];

export const PROJECT_CONNECTIONS: ProjectConnection[] = [
  // Root to projects
  { source: 'root-projects', target: 'august-solutions', type: 'domain', strength: 0.95 },
  { source: 'root-projects', target: 'global-master', type: 'domain', strength: 0.95 },
  { source: 'root-projects', target: 'bright-group', type: 'domain', strength: 0.95 },

  // Project interconnections
  { source: 'august-solutions', target: 'global-master', type: 'technology', strength: 0.7 },
  { source: 'global-master', target: 'bright-group', type: 'technology', strength: 0.6 },
  { source: 'august-solutions', target: 'bright-group', type: 'pattern', strength: 0.5 },
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
