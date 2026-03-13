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
    const centerX = this.canvas ? this.canvas.width / 2 : 500;
    const centerY = this.canvas ? this.canvas.height / 2 : 350;

    const rootSkill = this.skills.find(s => s.id === 'root-engineering');
    if (rootSkill) {
      rootSkill.x = centerX;
      rootSkill.y = centerY;
      rootSkill.vx = 0;
      rootSkill.vy = 0;
    }

    const branchRadius = 100;
    this.skills.forEach((skill) => {
      if (skill.id === 'root-engineering') return;
      
      const clusterOffset = CLUSTER_POSITIONS[skill.cluster];
      const clusterX = centerX + clusterOffset.offsetX;
      const clusterY = centerY + clusterOffset.offsetY;
      
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * branchRadius * 0.5 + branchRadius * 0.2;

      skill.x = clusterX + Math.cos(angle) * distance;
      skill.y = clusterY + Math.sin(angle) * distance;
      skill.vx = (Math.random() - 0.5) * 0.3;
      skill.vy = (Math.random() - 0.5) * 0.3;
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

    // Clear canvas completely to show background
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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
    const friction = 0.93;
    const clusterForce = 0.10;
    const repulsion = 280;
    
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.skills.forEach((skill) => {
      const clusterOffset = CLUSTER_POSITIONS[skill.cluster];
      const clusterX = centerX + clusterOffset.offsetX;
      const clusterY = centerY + clusterOffset.offsetY;

      // Attraction to cluster center
      const dx = clusterX - skill.x!;
      const dy = clusterY - skill.y!;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 2) {
        skill.vx! += (dx / distance) * clusterForce;
        skill.vy! += (dy / distance) * clusterForce;
      }

      // Repulsion from other nodes
      this.skills.forEach((other) => {
        if (skill.id === other.id) return;

        const rdx = skill.x! - other.x!;
        const rdy = skill.y! - other.y!;
        const rdist = Math.sqrt(rdx * rdx + rdy * rdy) + 1;

        if (rdist < repulsion) {
          const force = (repulsion - rdist) / repulsion * 0.4;
          skill.vx! += (rdx / rdist) * force;
          skill.vy! += (rdy / rdist) * force;
        }
      });

      // Apply velocity with damping
      skill.vx! *= friction;
      skill.vy! *= friction;

      // Limit velocity for stability
      const maxVelocity = 2;
      const vel = Math.sqrt(skill.vx! * skill.vx! + skill.vy! * skill.vy!);
      if (vel > maxVelocity) {
        skill.vx! = (skill.vx! / vel) * maxVelocity;
        skill.vy! = (skill.vy! / vel) * maxVelocity;
      }

      skill.x! += skill.vx!;
      skill.y! += skill.vy!;

      // Soft boundary constraints with bounce
      const padding = 60;
      if (skill.x! < padding) {
        skill.x = padding;
        skill.vx! *= -0.3;
      }
      if (skill.x! > this.canvas.width - padding) {
        skill.x = this.canvas.width - padding;
        skill.vx! *= -0.3;
      }
      if (skill.y! < padding) {
        skill.y = padding;
        skill.vy! *= -0.3;
      }
      if (skill.y! > this.canvas.height - padding) {
        skill.y = this.canvas.height - padding;
        skill.vy! *= -0.3;
      }
    });
  }

  private drawConnections(): void {
    this.connections.forEach((conn) => {
      const source = this.skills.find((s) => s.id === conn.source);
      const target = this.skills.find((s) => s.id === conn.target);

      if (!source || !target) return;

      const isSourceHovered = this.hoveredSkillId === conn.source;
      const isTargetHovered = this.hoveredSkillId === conn.target;
      const isSourceSelected = this.selectedSkillId === conn.source;
      const isTargetSelected = this.selectedSkillId === conn.target;
      const isRelated = 
        (this.hoveredSkillId && 
          (this.relatedSkills.includes(conn.source) || this.relatedSkills.includes(conn.target)));

      let opacity = 0.1;
      let width = 0.8;

      if (isSourceHovered || isTargetHovered) {
        opacity = 0.5;
        width = 1.5;
      } else if (isSourceSelected || isTargetSelected) {
        opacity = 0.4;
        width = 1.3;
      } else if (isRelated) {
        opacity = 0.2;
        width = 1;
      }

      this.ctx.strokeStyle = `rgba(155, 77, 150, ${opacity})`;
      this.ctx.lineWidth = width;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(source.x!, source.y!);
      this.ctx.lineTo(target.x!, target.y!);
      this.ctx.stroke();
    });
  }

  private drawNodes(): void {
    this.skills.forEach((skill) => {
      const isRoot = skill.id === 'root-engineering';
      const baseRadius = isRoot ? 20 : 14;
      const isSelected = this.selectedSkillId === skill.id;
      const isHovered = this.hoveredSkillId === skill.id;
      const isRelated = this.relatedSkills.includes(skill.id);

      // Get reveal progress
      const revealScale = this.revealManager.getNodeScale(skill.id);
      const revealOpacity = this.revealManager.getNodeOpacity(skill.id);

      // Calculate glow with subtle scaling
      const glowScale = (isHovered ? 1.4 : isRelated ? 1.15 : 1) * revealScale;

      // Draw refined glow for non-root nodes
      if (!isRoot) {
        const gradient = this.ctx.createRadialGradient(
          skill.x!, skill.y!, 0,
          skill.x!, skill.y!, baseRadius * glowScale * 1.5
        );

        const clusterColor = CLUSTER_COLORS[skill.cluster];
        const glowAlpha = Math.round(0x20 * revealOpacity).toString(16).padStart(2, '0');
        gradient.addColorStop(0, `${clusterColor}${glowAlpha}`);
        gradient.addColorStop(1, `${clusterColor}00`);

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(skill.x!, skill.y!, baseRadius * glowScale * 1.5, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Draw node circle with refined styling
      const nodeOpacity = Math.round(0xff * revealOpacity).toString(16).padStart(2, '0');
      const clusterColor = CLUSTER_COLORS[skill.cluster];
      
      // Dark background for node
      this.ctx.fillStyle = '#0a0a1a' + nodeOpacity;
      this.ctx.strokeStyle = clusterColor + nodeOpacity;
      this.ctx.lineWidth = (isSelected ? 2.5 : isHovered ? 2 : 1.2) * revealScale;
      
      this.ctx.beginPath();
      this.ctx.arc(skill.x!, skill.y!, baseRadius * revealScale, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      // Optional: Add subtle inner ring for root
      if (isRoot) {
        this.ctx.strokeStyle = clusterColor + Math.round(0x60 * revealOpacity).toString(16).padStart(2, '0');
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(skill.x!, skill.y!, baseRadius * revealScale * 0.6, 0, Math.PI * 2);
        this.ctx.stroke();
      }

      // Add subtle proficiency indicator as small dot
      if (!isRoot) {
        const proficiencyOpacity = skill.proficiency / 100 * revealOpacity;
        const indicatorAlpha = Math.round(proficiencyOpacity * 180).toString(16).padStart(2, '0');
        this.ctx.fillStyle = clusterColor + indicatorAlpha;
        this.ctx.beginPath();
        const indicatorRadius = 3 * revealScale;
        const indicatorDist = baseRadius * revealScale + indicatorRadius + 4;
        this.ctx.arc(
          skill.x! + indicatorDist * Math.cos(-Math.PI / 4),
          skill.y! + indicatorDist * Math.sin(-Math.PI / 4),
          indicatorRadius,
          0,
          Math.PI * 2
        );
        this.ctx.fill();
      }
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
      
      const hitRadius = skill.id === 'root-engineering' ? 28 : 22;

      if (distance < hitRadius) {
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
          count: 8,
          speed: 1.2,
          size: 1.5,
          color: clusterColor,
          life: 600,
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
      
      const hitRadius = skill.id === 'root-engineering' ? 28 : 22;

      if (distance < hitRadius) {
        this.selectedSkillId = skill.id;
        this.showSkillDetails(skill);
        this.updateRelatedSkills(skill.id);

        // Emit particles on click
        const clusterColor = CLUSTER_COLORS[skill.cluster];
        this.particleSystem.emit(skill.x!, skill.y!, {
          count: 15,
          speed: 2,
          size: 2,
          color: clusterColor,
          life: 800,
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
