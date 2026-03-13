/**
 * Connection Animation System
 * Handles animating connections between nodes with glow, pulse, and flow effects
 */

export interface AnimatedConnection {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: number;
  maxDuration: number;
  type: 'glow' | 'pulse' | 'flow';
  strength: number;
  color: string;
}

export class ConnectionAnimator {
  private animatedConnections: AnimatedConnection[] = [];
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  /**
   * Trigger animation for a connection
   */
  animateConnection(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    type: 'glow' | 'pulse' | 'flow' = 'glow',
    duration: number = 600,
    color: string = '#00bfff',
    strength: number = 1
  ): void {
    this.animatedConnections.push({
      startX,
      startY,
      endX,
      endY,
      progress: 0,
      maxDuration: duration,
      type,
      strength,
      color,
    });
  }

  /**
   * Update all animated connections
   */
  update(deltaTime: number = 16.667): void {
    for (let i = this.animatedConnections.length - 1; i >= 0; i--) {
      const conn = this.animatedConnections[i];

      // Update progress
      conn.progress += deltaTime;

      // Remove finished animations
      if (conn.progress >= conn.maxDuration) {
        this.animatedConnections.splice(i, 1);
      }
    }
  }

  /**
   * Render animated connections
   */
  render(): void {
    for (const conn of this.animatedConnections) {
      const progress = Math.min(1, conn.progress / conn.maxDuration);

      switch (conn.type) {
        case 'glow':
          this.renderGlow(conn, progress);
          break;
        case 'pulse':
          this.renderPulse(conn, progress);
          break;
        case 'flow':
          this.renderFlow(conn, progress);
          break;
      }
    }
  }

  /**
   * Render glow animation
   */
  private renderGlow(conn: AnimatedConnection, progress: number): void {
    const easeOut = 1 - progress;
    const glowWidth = 3 * conn.strength * (1 + easeOut * 1.5);
    const opacity = conn.strength * easeOut;

    // Outer glow
    this.ctx.strokeStyle = this.adjustAlpha(conn.color, opacity * 0.3);
    this.ctx.lineWidth = glowWidth * 3;
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(conn.startX, conn.startY);
    this.ctx.lineTo(conn.endX, conn.endY);
    this.ctx.stroke();

    // Inner bright line
    this.ctx.strokeStyle = this.adjustAlpha(conn.color, opacity);
    this.ctx.lineWidth = glowWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(conn.startX, conn.startY);
    this.ctx.lineTo(conn.endX, conn.endY);
    this.ctx.stroke();
  }

  /**
   * Render pulse animation
   */
  private renderPulse(conn: AnimatedConnection, progress: number): void {
    const pulseSize = Math.sin(progress * Math.PI * 2) * 0.5 + 0.5;
    const opacity = conn.strength * (1 - progress);

    this.ctx.strokeStyle = this.adjustAlpha(conn.color, opacity);
    this.ctx.lineWidth = 2 + pulseSize * 2;
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(conn.startX, conn.startY);
    this.ctx.lineTo(conn.endX, conn.endY);
    this.ctx.stroke();
  }

  /**
   * Render flow animation (traveling dot along connection)
   */
  private renderFlow(conn: AnimatedConnection, progress: number): void {
    const currentX = conn.startX + (conn.endX - conn.startX) * progress;
    const currentY = conn.startY + (conn.endY - conn.startY) * progress;
    const opacity = Math.sin(progress * Math.PI) * conn.strength;

    // Trail line
    this.ctx.strokeStyle = this.adjustAlpha(conn.color, opacity * 0.3);
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(conn.startX, conn.startY);
    this.ctx.lineTo(currentX, currentY);
    this.ctx.stroke();

    // Flow dot
    this.ctx.fillStyle = this.adjustAlpha(conn.color, opacity);
    this.ctx.beginPath();
    this.ctx.arc(currentX, currentY, 4, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * Check if there are active animations
   */
  hasActiveAnimations(): boolean {
    return this.animatedConnections.length > 0;
  }

  /**
   * Clear all animations
   */
  clear(): void {
    this.animatedConnections = [];
  }

  /**
   * Get animation count
   */
  getAnimationCount(): number {
    return this.animatedConnections.length;
  }

  /**
   * Adjust color alpha
   */
  private adjustAlpha(color: string, alpha: number): string {
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    const rgbMatch = color.match(/rgba?\(([^)]*)\)/);
    if (rgbMatch) {
      const parts = rgbMatch[1].split(',').map(p => p.trim());
      if (parts.length >= 3) {
        return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
      }
    }

    return color;
  }
}
