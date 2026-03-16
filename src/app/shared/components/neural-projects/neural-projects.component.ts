import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectNode, ProjectConnection, PROJECT_NODES, PROJECT_CONNECTIONS } from '../../data/neural-projects.data';
import { ConnectionAnimator } from '../../utils/connection.animator';
import { ProgressiveRevealManager } from '../../utils/progressive-reveal.manager';

interface ProjectDetail {
  node: ProjectNode;
  relatedTechs: string[];
  relatedProjects: string[];
}

@Component({
  selector: 'app-neural-projects',
  templateUrl: './neural-projects.component.html',
  styleUrls: ['./neural-projects.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class NeuralProjectsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('projectsCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  projects: ProjectNode[] = PROJECT_NODES;
  connections: ProjectConnection[] = PROJECT_CONNECTIONS;

  hoveredProjectId: string | null = null;
  selectedProjectId: string | null = null;
  selectedProjectDetail: ProjectDetail | null = null;
  relatedProjects: string[] = [];

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private time = 0;
  private connectionAnimator!: ConnectionAnimator;
  private revealManager!: ProgressiveRevealManager;
  private lastHoveredProject: string | null = null;

  constructor() {
    this.initializeProjectPositions();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.connectionAnimator = new ConnectionAnimator(this.canvas);
    this.revealManager = new ProgressiveRevealManager(600, 100);
    this.revealManager.initializeNodes(this.projects.map(p => p.id));
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.animate();
  }

  private initializeProjectPositions(): void {
    const centerX = this.canvas ? this.canvas.width / 2 : 600;
    const centerY = this.canvas ? this.canvas.height / 2 : 350;
    
    // Root node in center
    const root = this.projects.find(p => p.id === 'root-projects');
    if (root) {
      root.x = centerX;
      root.y = centerY;
      root.vx = 0;
      root.vy = 0;
    }

    // Position project nodes left and right alternating
    const projectNodes = this.projects.filter(p => p.type === 'project');
    const horizontalDistance = 250;
    const verticalSpacing = 200;
    
    projectNodes.forEach((project, index) => {
      const isLeft = index % 2 === 0; // 0, 2, 4... go left; 1, 3, 5... go right
      const rowIndex = Math.floor(index / 2);
      
      project.x = isLeft ? centerX - horizontalDistance : centerX + horizontalDistance;
      project.y = centerY + (rowIndex - projectNodes.length / 4) * verticalSpacing;
      project.vx = (Math.random() - 0.5) * 0.2;
      project.vy = (Math.random() - 0.5) * 0.2;
    });
  }

  private resizeCanvas(): void {
    const container = this.canvas.parentElement;
    if (container) {
      this.canvas.width = container.offsetWidth;
      this.canvas.height = container.offsetHeight;
    }
  }

  private animate = (): void => {
    this.time += 0.016;

    this.updatePhysics();

    // Update reveal progress
    this.revealManager.update(16.667);

    // Clear canvas completely to show background
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawConnections();

    // Update and render connection animations
    this.connectionAnimator.update(16.667);
    this.connectionAnimator.render();

    this.drawProjects();

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private updatePhysics(): void {
    const friction = 0.92;
    const centerAttraction = 0.08;
    const repulsion = 300;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.projects.forEach((project) => {
      // Keep root node fixed in center
      if (project.type === 'root') {
        project.vx = 0;
        project.vy = 0;
        return;
      }

      // Apply physics to project nodes only
      // Gentle attraction toward approximate positions
      const isLeft = this.projects.indexOf(project) % 2 === 1 || (project.id === 'bright-group');
      const targetX = isLeft ? centerX - 250 : centerX + 250;
      
      const dx = targetX - project.x!;
      const dy = centerY - project.y!;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 2) {
        project.vx! += (dx / distance) * centerAttraction * 0.5;
        project.vy! += (dy / distance) * centerAttraction * 0.3;
      }

      // Repulsion from other nodes
      this.projects.forEach((other) => {
        if (project.id === other.id || other.type === 'branch') return;

        const rdx = project.x! - other.x!;
        const rdy = project.y! - other.y!;
        const rdist = Math.sqrt(rdx * rdx + rdy * rdy) + 1;

        if (rdist < repulsion) {
          const force = ((repulsion - rdist) / repulsion) * 0.2;
          project.vx! += (rdx / rdist) * force;
          project.vy! += (rdy / rdist) * force;
        }
      });

      project.vx! *= friction;
      project.vy! *= friction;

      // Limit velocity
      const vel = Math.sqrt(project.vx! * project.vx! + project.vy! * project.vy!);
      if (vel > 1.5) {
        project.vx! = (project.vx! / vel) * 1.5;
        project.vy! = (project.vy! / vel) * 1.5;
      }

      project.x! += project.vx!;
      project.y! += project.vy!;

      // Boundary constraints
      const padding = 80;
      if (project.x! < padding) {
        project.x = padding;
        project.vx! *= -0.3;
      }
      if (project.x! > this.canvas.width - padding) {
        project.x = this.canvas.width - padding;
        project.vx! *= -0.3;
      }
      if (project.y! < padding) {
        project.y = padding;
        project.vy! *= -0.3;
      }
      if (project.y! > this.canvas.height - padding) {
        project.y = this.canvas.height - padding;
        project.vy! *= -0.3;
      }
    });
  }

  private drawConnections(): void {
    this.connections.forEach((conn) => {
      const source = this.projects.find((p) => p.id === conn.source);
      const target = this.projects.find((p) => p.id === conn.target);

      if (!source || !target) return;

      const isRelated =
        this.hoveredProjectId === conn.source ||
        this.hoveredProjectId === conn.target ||
        this.selectedProjectId === conn.source ||
        this.selectedProjectId === conn.target;

      const opacity = isRelated ? 0.5 : 0.12;
      const width = isRelated ? 2.5 : 1;

      // Color based on connection type
      let color = 'rgba(155, 77, 150, ' + opacity + ')';
      if (conn.type === 'technology') {
        color = 'rgba(0, 191, 255, ' + opacity + ')';
      } else if (conn.type === 'pattern') {
        color = 'rgba(155, 77, 150, ' + opacity + ')';
      }

      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = width;
      this.ctx.beginPath();
      this.ctx.moveTo(source.x!, source.y!);
      this.ctx.lineTo(target.x!, target.y!);
      this.ctx.stroke();
    });
  }

  private drawProjects(): void {
    this.projects.forEach((project) => {
      const isSelected = this.selectedProjectId === project.id;
      const isHovered = this.hoveredProjectId === project.id;

      // Get reveal progress
      const revealScale = this.revealManager.getNodeScale(project.id);
      const revealOpacity = this.revealManager.getNodeOpacity(project.id);

      // Draw based on node type
      if (project.type === 'root') {
        this.drawRootNode(project, isSelected, isHovered, revealScale, revealOpacity);
      } else if (project.type === 'branch') {
        this.drawBranchNode(project, isSelected, isHovered, revealScale, revealOpacity);
      } else {
        this.drawProjectNode(project, isSelected, isHovered, revealScale, revealOpacity);
      }
    });
  }

  private drawRootNode(project: ProjectNode, isSelected: boolean, isHovered: boolean, scale: number, opacity: number): void {
    const radius = 24 * scale;

    // Draw large glow
    const glowGradient = this.ctx.createRadialGradient(
      project.x!, project.y!, 0,
      project.x!, project.y!, radius * 2
    );
    const glowColor = '#00d4ff';
    glowGradient.addColorStop(0, `${glowColor}20`);
    glowGradient.addColorStop(1, `${glowColor}00`);

    this.ctx.fillStyle = glowGradient;
    this.ctx.beginPath();
    this.ctx.arc(project.x!, project.y!, radius * 2, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw node circle
    const nodeOpacity = Math.round(0xff * opacity).toString(16).padStart(2, '0');
    this.ctx.fillStyle = '#0a0a1a' + nodeOpacity;
    this.ctx.strokeStyle = glowColor + nodeOpacity;
    this.ctx.lineWidth = 2 * scale;
    this.ctx.beginPath();
    this.ctx.arc(project.x!, project.y!, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Draw inner ring
    this.ctx.strokeStyle = glowColor + Math.round(0x80 * opacity).toString(16).padStart(2, '0');
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(project.x!, project.y!, radius * 0.6, 0, Math.PI * 2);
    this.ctx.stroke();

    // Draw label
    this.ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * opacity})`;
    this.ctx.font = 'bold 13px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(project.name, project.x!, project.y!);
  }

  private drawBranchNode(project: ProjectNode, isSelected: boolean, isHovered: boolean, scale: number, opacity: number): void {
    const radius = 16 * scale;

    // Draw subtle glow for branches
    const glowGradient = this.ctx.createRadialGradient(
      project.x!, project.y!, 0,
      project.x!, project.y!, radius * 1.8
    );
    glowGradient.addColorStop(0, `rgba(155, 77, 150, ${0.15 * opacity})`);
    glowGradient.addColorStop(1, `rgba(155, 77, 150, 0)`);

    this.ctx.fillStyle = glowGradient;
    this.ctx.beginPath();
    this.ctx.arc(project.x!, project.y!, radius * 1.8, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw branch node
    const nodeOpacity = Math.round(0xff * opacity).toString(16).padStart(2, '0');
    this.ctx.fillStyle = '#0a0a1a' + nodeOpacity;
    this.ctx.strokeStyle = 'rgba(155, 77, 150, ' + opacity + ')';
    this.ctx.lineWidth = 1.5 * scale;
    this.ctx.beginPath();
    this.ctx.arc(project.x!, project.y!, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Draw label
    this.ctx.fillStyle = `rgba(255, 255, 255, ${0.85 * opacity})`;
    this.ctx.font = 'bold 10px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(project.name, project.x!, project.y!);
  }

  private drawProjectNode(project: ProjectNode, isSelected: boolean, isHovered: boolean, scale: number, opacity: number): void {
    const baseRadius = 18;
    const radius = baseRadius * (isSelected ? 1.3 : isHovered ? 1.15 : 1) * scale;

    // Draw glow
    const glowGradient = this.ctx.createRadialGradient(
      project.x!, project.y!, 0,
      project.x!, project.y!, radius * 1.5
    );
    
    const glowOpacity = (isHovered ? 0.25 : 0.12) * opacity;
    glowGradient.addColorStop(0, `rgba(0, 191, 255, ${glowOpacity})`);
    glowGradient.addColorStop(1, `rgba(0, 191, 255, 0)`);

    this.ctx.fillStyle = glowGradient;
    this.ctx.beginPath();
    this.ctx.arc(project.x!, project.y!, radius * 1.5, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw node
    const nodeOpacity = Math.round(0xff * opacity).toString(16).padStart(2, '0');
    this.ctx.fillStyle = '#0a0a1a' + nodeOpacity;
    this.ctx.strokeStyle = '#00bfff' + nodeOpacity;
    this.ctx.lineWidth = (isSelected ? 2 : isHovered ? 1.5 : 1) * scale;
    this.ctx.beginPath();
    this.ctx.arc(project.x!, project.y!, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Draw impact/complexity indicator as small bars
    const barCount = project.impact ?? 0;
    const barSize = 3 * scale;
    const spacing = barSize + 2;
    const startX = project.x! - (barCount - 1) * spacing / 2;

    this.ctx.fillStyle = `rgba(155, 77, 150, ${0.7 * opacity})`;
    for (let i = 0; i < barCount; i++) {
      this.ctx.fillRect(startX + i * spacing, project.y! - radius - 10, barSize, barSize);
    }

    // Draw short label
    this.ctx.fillStyle = `rgba(255, 255, 255, ${0.8 * opacity})`;
    this.ctx.font = 'bold 9px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(project.name.split(' ')[0], project.x!, project.y!);
  }

  onCanvasMouseMove(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let hovered: string | null = null;

    for (const project of this.projects) {
      const dx = x - project.x!;
      const dy = y - project.y!;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 60) {
        hovered = project.id;
        break;
      }
    }

    // Animate connections on hover change
    if (hovered && hovered !== this.lastHoveredProject) {
      this.connections.forEach((conn) => {
        if (conn.source === hovered || conn.target === hovered) {
          const source = this.projects.find(p => p.id === conn.source)!;
          const target = this.projects.find(p => p.id === conn.target)!;
          
          const color = conn.type === 'technology' ? '#00bfff' : '#9b4d96';
          this.connectionAnimator.animateConnection(
            source.x!,
            source.y!,
            target.x!,
            target.y!,
            'glow',
            600,
            color,
            1
          );
        }
      });
    }

    this.lastHoveredProject = hovered;
    this.hoveredProjectId = hovered;

    if (hovered) {
      this.updateRelatedProjects(hovered);
      this.canvas.style.cursor = 'pointer';
    } else {
      this.relatedProjects = [];
      this.canvas.style.cursor = 'default';
    }
  }

  onCanvasClick(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    for (const project of this.projects) {
      const dx = x - project.x!;
      const dy = y - project.y!;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 60) {
        this.selectedProjectId = project.id;
        this.showProjectDetails(project);
        this.updateRelatedProjects(project.id);

        // Animate all connected projects with flow effect
        this.connections.forEach((conn) => {
          if (conn.source === project.id || conn.target === project.id) {
            const source = this.projects.find(p => p.id === conn.source)!;
            const target = this.projects.find(p => p.id === conn.target)!;
            
            const color = conn.type === 'technology' ? '#00bfff' : '#9b4d96';
            this.connectionAnimator.animateConnection(
              source.x!,
              source.y!,
              target.x!,
              target.y!,
              'flow',
              800,
              color,
              1.5
            );
          }
        });

        return;
      }
    }

    this.selectedProjectId = null;
    this.selectedProjectDetail = null;
  }

  private updateRelatedProjects(projectId: string): void {
    this.relatedProjects = [projectId];

    this.connections.forEach((conn) => {
      if (conn.source === projectId) {
        this.relatedProjects.push(conn.target);
      } else if (conn.target === projectId) {
        this.relatedProjects.push(conn.source);
      }
    });
  }

  private showProjectDetails(project: ProjectNode): void {
    const relatedProjects = new Set<string>();
    const techSet = new Set<string>();

    this.connections.forEach((conn) => {
      if (conn.source === project.id) {
        relatedProjects.add(conn.target);
      } else if (conn.target === project.id) {
        relatedProjects.add(conn.source);
      }
    });

    project.technologies.forEach((tech) => techSet.add(tech));

    this.selectedProjectDetail = {
      node: project,
      relatedTechs: Array.from(techSet),
      relatedProjects: Array.from(relatedProjects),
    };
  }

  closeDetails(): void {
    this.selectedProjectId = null;
    this.selectedProjectDetail = null;
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', () => this.resizeCanvas());
  }
}
