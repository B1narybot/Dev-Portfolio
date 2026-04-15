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
    id: 'House-of-Valta',
    name: 'House-of-Valta',
    description: 'Elite Trading house dedicated to the mastery & trading of global financial markets specializing in XAU/USD.',
    technologies: ['React', 'Node.js', 'Express.js', 'Redis', 'TypeScript'],
    link: 'https://house-of-valta.netlify.app/',
    category: 'Web',
    type: 'project',
    complexity: 4,
    impact: 4,
  },

  // Projects: Right side
  {
    id: 'Bleval.inc',
    name: 'Bleval.inc',
    description: 'Digital Agency specializing in creating user centric digital solutions that sell and provide real value.',
    technologies: ['Angular', 'Node.js', 'Firebase', 'Express'],
    link: '',
    category: 'Web',
    type: 'project',
    complexity: 4,
    impact: 5,
  },

  // Projects: Left side
  {
    id: 'bright-group-ltd',
    name: 'Bright Group LTD',
    description: 'Premium technology solutions provider website showcasing services with elegant design and strong performance.',
    technologies: ['Web Design', 'Performance Optimization', 'SEO', 'Responsive'],
    link: 'https://brightgroupltd.com/',
    category: 'Web',
    type: 'project',
    complexity: 4,
    impact: 4,
  },

  // Projects: Right side
  {
    id: 'global-master',
    name: 'Global Master',
    description: 'Modern agency website built with React featuring clean responsive design and polished user experience.',
    technologies: ['React', 'TypeScript', 'Responsive Design', 'CSS/SCSS'],
    link: 'https://global-master.netlify.app/',
    category: 'Web',
    type: 'project',
    complexity: 4,
    impact: 4,
  },
];

export const PROJECT_CONNECTIONS: ProjectConnection[] = [
  // Root to projects
  { source: 'root-projects', target: 'House-of-Valta', type: 'domain', strength: 0.95 },
  { source: 'root-projects', target: 'Bleval.inc', type: 'domain', strength: 0.95 },
  { source: 'root-projects', target: 'bright-group-ltd', type: 'domain', strength: 0.95 },
  { source: 'root-projects', target: 'global-master', type: 'domain', strength: 0.95 },

  // Project interconnections
  { source: 'House-of-Valta', target: 'Bleval.inc', type: 'technology', strength: 0.75 },
  { source: 'House-of-Valta', target: 'bright-group-ltd', type: 'technology', strength: 0.7 },
  { source: 'Bleval.inc', target: 'bright-group-ltd', type: 'pattern', strength: 0.6 },
  { source: 'bright-group-ltd', target: 'global-master', type: 'technology', strength: 0.55 },
];

export const PROJECT_TECH_CONNECTIONS: ProjectConnection[] = [
  // Technology connections to projects
  // Angular projects
  { source: 'august-solutions', target: 'angular-skill', type: 'technology', strength: 0.95 },
  { source: 'Bleval.inc', target: 'angular-skill', type: 'technology', strength: 0.9 },
  
  // React projects
  { source: 'global-master', target: 'react-skill', type: 'technology', strength: 0.9 },
  
  // Node.js projects
  { source: 'august-solutions', target: 'nodejs-skill', type: 'technology', strength: 0.9 },
  { source: 'global-master', target: 'nodejs-skill', type: 'technology', strength: 0.85 },
  
  // TypeScript usage
  { source: 'august-solutions', target: 'typescript-skill', type: 'technology', strength: 0.95 },
  { source: 'global-master', target: 'typescript-skill', type: 'technology', strength: 0.85 },
];
