/**
 * Particle System for neural visualization micro-interactions
 * Handles creation, animation, and rendering of particle effects
 */

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
  color: string;
}

export interface ParticleConfig {
  count: number;
  speed: number;
  size: number;
  color: string;
  life: number;
  spread: number; // spawn spread in degrees
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private canvas: OffscreenCanvas | HTMLCanvasElement;
  private ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  /**
   * Emit particles from a point
   */
  emit(x: number, y: number, config: ParticleConfig): void {
    const angleStep = 360 / config.count;

    for (let i = 0; i < config.count; i++) {
      const angle = (angleStep * i + (Math.random() - 0.5) * config.spread) * (Math.PI / 180);
      const velocity = config.speed + (Math.random() - 0.5) * config.speed * 0.5;

      const particle: Particle = {
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: config.life,
        maxLife: config.life,
        size: config.size,
        opacity: 1,
        color: config.color,
      };

      this.particles.push(particle);
    }
  }

  /**
   * Update all particles
   */
  update(deltaTime: number = 16.667): void {
    const friction = 0.97;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Apply friction
      p.vx *= friction;
      p.vy *= friction;

      // Update life
      p.life -= deltaTime;
      p.opacity = Math.max(0, p.life / p.maxLife);
      p.size = p.size * (p.life / p.maxLife) * 0.8;

      // Remove dead particles
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * Render particles to canvas
   */
  render(): void {
    for (const p of this.particles) {
      this.ctx.fillStyle = this.adjustAlpha(p.color, p.opacity);
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  /**
   * Check if there are active particles
   */
  hasActiveParticles(): boolean {
    return this.particles.length > 0;
  }

  /**
   * Clear all particles
   */
  clear(): void {
    this.particles = [];
  }

  /**
   * Adjust color alpha value
   */
  private adjustAlpha(color: string, alpha: number): string {
    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Handle rgb/rgba colors (return as is with adjusted alpha)
    const rgbMatch = color.match(/rgba?\(([^)]*)\)/);
    if (rgbMatch) {
      const parts = rgbMatch[1].split(',').map(p => p.trim());
      if (parts.length === 4) {
        return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
      } else if (parts.length === 3) {
        return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
      }
    }

    return color;
  }

  /**
   * Get particle count
   */
  getParticleCount(): number {
    return this.particles.length;
  }
}
