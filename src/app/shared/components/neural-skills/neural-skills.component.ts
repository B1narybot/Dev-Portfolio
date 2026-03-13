import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillFilterPipe } from '../../pipes/skill-filter.pipe';
import { SkillNode, Connection, NEURAL_SKILLS_DATA, SKILL_CONNECTIONS, CLUSTER_POSITIONS, CLUSTER_COLORS } from '../../data/neural-skills.data';
import { ParticleSystem } from '../../utils/particle.system';
import { ProgressiveRevealManager } from '../../utils/progressive-reveal.manager';

interface SkillDetail {
  node: SkillNode;
  relatedSkills: string[];
}

@Component({
  selector: 'app-neural-skills',
  templateUrl: './neural-skills.component.html',
  styleUrls: ['./neural-skills.component.css'],
  standalone: true,
  imports: [CommonModule, SkillFilterPipe],
})
export class NeuralSkillsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('skillsCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  skills: SkillNode[] = NEURAL_SKILLS_DATA;
  connections: Connection[] = SKILL_CONNECTIONS;
  
  hoveredSkillId: string | null = null;
  selectedSkillId: string | null = null;
  selectedSkillDetail: SkillDetail | null = null;
  
  relatedSkills: string[] = [];

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private time = 0;
  private particleSystem!: ParticleSystem;
  private revealManager!: ProgressiveRevealManager;
  private lastHoveredSkill: string | null = null;

  constructor() {
    this.initializeSkillPositions();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.particleSystem = new ParticleSystem(this.canvas);
    this.revealManager = new ProgressiveRevealManager(600, 30);
    this.revealManager.initializeNodes(this.skills.map(s => s.id));
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.animate();
  }

  private initializeSkillPositions(): void {
    const clusterRadius = 120;

    this.skills.forEach((skill) => {
      const clusterPos = CLUSTER_POSITIONS[skill.cluster];
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * clusterRadius;

      skill.x = clusterPos.cx + Math.cos(angle) * distance;
      skill.y = clusterPos.cy + Math.sin(angle) * distance;
      skill.vx = (Math.random() - 0.5) * 2;
      skill.vy = (Math.random() - 0.5) * 2;
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
    this.time += 0.016; // ~60fps
    
    // Physics simulation
    this.updatePhysics();

    // Update reveal progress
    this.revealManager.update(16.667);

    // Clear canvas
    this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw connections
    this.drawConnections();

    // Draw skill nodes
    this.drawNodes();

    // Update and render particles
    this.particleSystem.update(16.667);
    this.particleSystem.render();

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private updatePhysics(): void {
    const friction = 0.95;
    const clusterForce = 0.08;
    const repulsion = 300;

    this.skills.forEach((skill) => {
      const clusterPos = CLUSTER_POSITIONS[skill.cluster];

      // Attraction to cluster center
      const dx = clusterPos.cx - skill.x!;
      const dy = clusterPos.cy - skill.y!;
      const distance = Math.sqrt(dx * dx + dy * dy);

      skill.vx! += (dx / distance) * clusterForce;
      skill.vy! += (dy / distance) * clusterForce;

      // Repulsion from other nodes
      this.skills.forEach((other) => {
        if (skill.id === other.id) return;

        const rdx = skill.x! - other.x!;
        const rdy = skill.y! - other.y!;
        const rdist = Math.sqrt(rdx * rdx + rdy * rdy) + 1;

        if (rdist < repulsion) {
          const force = (repulsion - rdist) / repulsion * 0.5;
          skill.vx! += (rdx / rdist) * force;
          skill.vy! += (rdy / rdist) * force;
        }
      });

      // Apply velocity
      skill.vx! *= friction;
      skill.vy! *= friction;

      skill.x! += skill.vx!;
      skill.y! += skill.vy!;

      // Boundary constraints
      const padding = 40;
      if (skill.x! < padding) skill.x = padding;
      if (skill.x! > this.canvas.width - padding) skill.x = this.canvas.width - padding;
      if (skill.y! < padding) skill.y = padding;
      if (skill.y! > this.canvas.height - padding) skill.y = this.canvas.height - padding;
    });
  }

  private drawConnections(): void {
    this.connections.forEach((conn) => {
      const source = this.skills.find((s) => s.id === conn.source);
      const target = this.skills.find((s) => s.id === conn.target);

      if (!source || !target) return;

      const isRelated = 
        this.hoveredSkillId === conn.source || 
        this.hoveredSkillId === conn.target ||
        this.selectedSkillId === conn.source ||
        this.selectedSkillId === conn.target;

      const opacity = isRelated ? 0.6 : 0.15;
      const width = isRelated ? 2 : 1;

      this.ctx.strokeStyle = `rgba(155, 77, 150, ${opacity})`;
      this.ctx.lineWidth = width;
      this.ctx.beginPath();
      this.ctx.moveTo(source.x!, source.y!);
      this.ctx.lineTo(target.x!, target.y!);
      this.ctx.stroke();
    });
  }

  private drawNodes(): void {
    this.skills.forEach((skill) => {
      const radius = 24;
      const isSelected = this.selectedSkillId === skill.id;
      const isHovered = this.hoveredSkillId === skill.id;
      const isRelated = this.relatedSkills.includes(skill.id);

      // Get reveal progress
      const revealScale = this.revealManager.getNodeScale(skill.id);
      const revealOpacity = this.revealManager.getNodeOpacity(skill.id);

      // Calculate glow scale with reveal
      const glowScale = (isHovered ? 1.5 : isRelated ? 1.2 : 1) * revealScale;

      // Draw glow
      const gradient = this.ctx.createRadialGradient(
        skill.x!, skill.y!, 0,
        skill.x!, skill.y!, radius * glowScale
      );

      const clusterColor = CLUSTER_COLORS[skill.cluster];
      gradient.addColorStop(0, `${clusterColor}${Math.round(0x40 * revealOpacity).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, `${clusterColor}00`);

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(skill.x!, skill.y!, radius * glowScale, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw node circle with reveal opacity
      const nodeOpacity = Math.round(0xff * revealOpacity).toString(16).padStart(2, '0');
      this.ctx.fillStyle = (isSelected ? clusterColor : isHovered ? clusterColor : '#1a1a2e') + nodeOpacity;
      this.ctx.strokeStyle = clusterColor + nodeOpacity;
      this.ctx.lineWidth = (isSelected ? 3 : isHovered ? 2 : 1.5) * revealScale;
      this.ctx.beginPath();
      this.ctx.arc(skill.x!, skill.y!, radius * revealScale, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      // Draw proficiency indicator
      const proficiencyOpacity = skill.proficiency / 100 * revealOpacity;
      this.ctx.fillStyle = `${clusterColor}${Math.round(proficiencyOpacity * 255).toString(16).padStart(2, '0')}`;
      this.ctx.beginPath();
      this.ctx.arc(skill.x!, skill.y! - radius * revealScale - 10, 4 * revealScale, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  onCanvasMouseMove(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let hovered: string | null = null;

    for (const skill of this.skills) {
      const dx = x - skill.x!;
      const dy = y - skill.y!;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 30) {
        hovered = skill.id;
        break;
      }
    }

    // Emit particles on hover change
    if (hovered && hovered !== this.lastHoveredSkill) {
      const skill = this.skills.find(s => s.id === hovered);
      if (skill) {
        const clusterColor = CLUSTER_COLORS[skill.cluster];
        this.particleSystem.emit(skill.x!, skill.y!, {
          count: 12,
          speed: 1.5,
          size: 2,
          color: clusterColor,
          life: 800,
          spread: 360,
        });
      }
    }

    this.lastHoveredSkill = hovered;
    this.hoveredSkillId = hovered;

    if (hovered) {
      this.updateRelatedSkills(hovered);
      this.canvas.style.cursor = 'pointer';
    } else {
      this.relatedSkills = [];
      this.canvas.style.cursor = 'default';
    }
  }

  onCanvasClick(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    for (const skill of this.skills) {
      const dx = x - skill.x!;
      const dy = y - skill.y!;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 30) {
        this.selectedSkillId = skill.id;
        this.showSkillDetails(skill);
        this.updateRelatedSkills(skill.id);

        // Emit particles on click
        const clusterColor = CLUSTER_COLORS[skill.cluster];
        this.particleSystem.emit(skill.x!, skill.y!, {
          count: 20,
          speed: 2.5,
          size: 3,
          color: clusterColor,
          life: 1000,
          spread: 360,
        });
        
        return;
      }
    }

    this.selectedSkillId = null;
    this.selectedSkillDetail = null;
  }

  private updateRelatedSkills(skillId: string): void {
    this.relatedSkills = [skillId];

    // Find directly connected skills
    this.connections.forEach((conn) => {
      if (conn.source === skillId) {
        this.relatedSkills.push(conn.target);
      } else if (conn.target === skillId) {
        this.relatedSkills.push(conn.source);
      }
    });
  }

  private showSkillDetails(skill: SkillNode): void {
    const related = new Set<string>();

    this.connections.forEach((conn) => {
      if (conn.source === skill.id) {
        related.add(conn.target);
      } else if (conn.target === skill.id) {
        related.add(conn.source);
      }
    });

    this.selectedSkillDetail = {
      node: skill,
      relatedSkills: Array.from(related),
    };
  }

  closeDetails(): void {
    this.selectedSkillId = null;
    this.selectedSkillDetail = null;
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', () => this.resizeCanvas());
  }
}
