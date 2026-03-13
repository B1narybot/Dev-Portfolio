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
    const centerX = 600;
    const centerY = 350;
    const radius = 200;

    this.projects.forEach((project, index) => {
      const angle = (index / this.projects.length) * Math.PI * 2;
      project.x = centerX + Math.cos(angle) * radius;
      project.y = centerY + Math.sin(angle) * radius;
      project.vx = (Math.random() - 0.5) * 1;
      project.vy = (Math.random() - 0.5) * 1;
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

    this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawConnections();

    // Update and render connection animations
    this.connectionAnimator.update(16.667);
    this.connectionAnimator.render();

    this.drawProjects();

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private updatePhysics(): void {
    const friction = 0.96;
    const centerAttraction = 0.05;
    const repulsion = 400;

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.projects.forEach((project) => {
      // Center attraction
      const dx = centerX - project.x!;
      const dy = centerY - project.y!;
      const distance = Math.sqrt(dx * dx + dy * dy);

      project.vx! += (dx / distance) * centerAttraction;
      project.vy! += (dy / distance) * centerAttraction;

      // Repulsion from other nodes
      this.projects.forEach((other) => {
        if (project.id === other.id) return;

        const rdx = project.x! - other.x!;
        const rdy = project.y! - other.y!;
        const rdist = Math.sqrt(rdx * rdx + rdy * rdy) + 1;

        if (rdist < repulsion) {
          const force = ((repulsion - rdist) / repulsion) * 0.3;
          project.vx! += (rdx / rdist) * force;
          project.vy! += (rdy / rdist) * force;
        }
      });

      project.vx! *= friction;
      project.vy! *= friction;

      project.x! += project.vx!;
      project.y! += project.vy!;

      // Boundary constraints
      const padding = 80;
      if (project.x! < padding) project.x = padding;
      if (project.x! > this.canvas.width - padding) project.x = this.canvas.width - padding;
      if (project.y! < padding) project.y = padding;
      if (project.y! > this.canvas.height - padding) project.y = this.canvas.height - padding;
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
      const baseRadius = 48;
      const isSelected = this.selectedProjectId === project.id;
      const isHovered = this.hoveredProjectId === project.id;

      // Get reveal progress
      const revealScale = this.revealManager.getNodeScale(project.id);
      const revealOpacity = this.revealManager.getNodeOpacity(project.id);

      const scale = (isSelected ? 1.4 : isHovered ? 1.2 : 1) * revealScale;
      const radius = baseRadius * scale;

      // Draw glow
      const gradient = this.ctx.createRadialGradient(
        project.x!,
        project.y!,
        0,
        project.x!,
        project.y!,
        radius * 1.3
      );

      const glowOpacity = (Math.random() * 0.3 + 0.2) * revealOpacity;
      const glowColor = `rgba(0, 191, 255, ${glowOpacity})`;
      gradient.addColorStop(0, glowColor);
      gradient.addColorStop(1, 'rgba(0, 191, 255, 0)');

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(project.x!, project.y!, radius * 1.3, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw main node circle with reveal opacity
      const nodeOpacity = Math.round(0xff * revealOpacity).toString(16).padStart(2, '0');
      this.ctx.fillStyle = (isSelected ? 'rgba(0, 191, 255, 0.9)' : 'rgba(26, 26, 46, 0.8)').slice(0, -1) + revealOpacity + ')';
      this.ctx.strokeStyle = '#00bfff' + nodeOpacity;
      this.ctx.lineWidth = (isSelected ? 3 : isHovered ? 2.5 : 2) * revealScale;
      this.ctx.beginPath();
      this.ctx.arc(project.x!, project.y!, radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      // Draw complexity/impact indicator
      const size = project.complexity * 2 * revealScale;
      this.ctx.fillStyle = `rgba(155, 77, 150, ${0.8 * revealOpacity})`;
      this.ctx.fillRect(
        project.x! - size / 2,
        project.y! - radius - 15,
        size,
        size
      );

      // Draw project label
      this.ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * revealOpacity})`;
      this.ctx.font = 'bold 11px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      const lines = project.name.split(' ');
      const maxLength = Math.ceil(Math.sqrt(project.name.length));
      const wrappedLines = [];

      let currentLine = '';
      lines.forEach((word) => {
        if ((currentLine + ' ' + word).length > maxLength) {
          if (currentLine) wrappedLines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = currentLine ? currentLine + ' ' + word : word;
        }
      });
      if (currentLine) wrappedLines.push(currentLine);

      wrappedLines.forEach((line, i) => {
        const yOffset = (i - wrappedLines.length / 2 + 0.5) * 11;
        this.ctx.fillText(line, project.x!, project.y! + yOffset);
      });
    });
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
