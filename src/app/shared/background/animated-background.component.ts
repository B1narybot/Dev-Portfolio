import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

@Component({
  selector: 'app-animated-background',
  templateUrl: './animated-background.component.html',
  styleUrls: ['./animated-background.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class AnimatedBackgroundComponent implements OnInit, OnDestroy {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId: number | null = null;
  private width = window.innerWidth;
  private height = window.innerHeight;

  private readonly PARTICLE_COUNT = 60;
  private readonly PARTICLE_RADIUS = 2;
  private readonly CONNECTION_DISTANCE = 150;
  private readonly SPEED_MULTIPLIER = 0.3;

  ngOnInit(): void {
    this.initCanvas();
    this.initParticles();
    this.animate();
  }

  private initCanvas(): void {
    this.canvas = document.getElementById('animated-bg-canvas') as HTMLCanvasElement;
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d', { alpha: false })!;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  private initParticles(): void {
    for (let i = 0; i < this.PARTICLE_COUNT; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * this.SPEED_MULTIPLIER,
        vy: (Math.random() - 0.5) * this.SPEED_MULTIPLIER,
        radius: this.PARTICLE_RADIUS,
      });
    }
  }

  private animate = (): void => {
    // Clear canvas with gradient instead of solid color
    const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(0.5, '#111120');
    gradient.addColorStop(1, '#010a15');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Update particles
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x - particle.radius < 0 || particle.x + particle.radius > this.width) {
        particle.vx *= -1;
        particle.x = Math.max(particle.radius, Math.min(this.width - particle.radius,particle.x));
      }
      if (particle.y - particle.radius < 0 || particle.y + particle.radius > this.height) {
        particle.vy *= -1;
        particle.y = Math.max(particle.radius, Math.min(this.height - particle.radius, particle.y));
      }
    });

    // Draw connections
    this.ctx.strokeStyle = 'rgba(155, 77, 150, 0.15)';
    this.ctx.lineWidth = 1;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.CONNECTION_DISTANCE) {
          this.ctx.globalAlpha = 1 - distance / this.CONNECTION_DISTANCE;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
    this.ctx.globalAlpha = 1;

    // Draw particles
    this.ctx.fillStyle = 'rgba(155, 77, 150, 0.8)';
    this.particles.forEach(particle => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.animationId = requestAnimationFrame(this.animate);
  };

  @HostListener('window:resize')
  onResize(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    if (this.canvas) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }
  }

  ngOnDestroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
