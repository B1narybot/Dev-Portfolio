import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TECHNOLOGY_DISTRIBUTION, ARCHITECTURE_METRICS, PROJECT_METRICS, MetricData } from '../../data/engineering-metrics.data';

@Component({
  selector: 'app-engineering-metrics',
  templateUrl: './engineering-metrics.component.html',
  styleUrls: ['./engineering-metrics.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class EngineeringMetricsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('metricsCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  techDistribution: MetricData[] = TECHNOLOGY_DISTRIBUTION;
  archMetrics = ARCHITECTURE_METRICS;
  projectMetrics = PROJECT_METRICS;

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private time = 0;
  private animationComplete = false;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.animate();
  }

  private resizeCanvas(): void {
    const container = this.canvas.parentElement;
    if (container) {
      this.canvas.width = container.offsetWidth;
      this.canvas.height = 400;
    }
  }

  private animate = (): void => {
    this.time += 0.016;

    // Clear canvas completely to show background
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw radial chart for technology distribution
    this.drawRadialChart();

    // Draw metric bars for architecture
    this.drawMetricBars();

    if (this.time < 2) {
      this.animationFrameId = requestAnimationFrame(this.animate);
    } else {
      this.animationComplete = true;
    }
  };

  private drawRadialChart(): void {
    const centerX = this.canvas.width / 4;
    const centerY = this.canvas.height / 2;
    const baseRadius = 80;
    
    // Smooth ease-out animation for segment expansion
    const easeProgress = this.easeOutCubic(Math.min(this.time / 1.2, 1));
    const radius = baseRadius * (0.5 + easeProgress * 0.5);

    // Draw background circle
    this.ctx.strokeStyle = 'rgba(155, 77, 150, 0.15)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
    this.ctx.stroke();

    // Draw segments with improved styling
    let currentAngle = -Math.PI / 2;

    this.techDistribution.forEach((tech, index) => {
      const sliceAngle = (tech.value / 100) * Math.PI * 2;
      const endAngle = currentAngle + sliceAngle * easeProgress;

      // Draw segment with semi-transparent fill
      this.ctx.fillStyle = tech.color + '40';
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.arc(centerX, centerY, radius, currentAngle, endAngle);
      this.ctx.closePath();
      this.ctx.fill();

      // Draw border with refined thickness
      this.ctx.strokeStyle = tech.color;
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.arc(centerX, centerY, radius, currentAngle, endAngle);
      this.ctx.closePath();
      this.ctx.stroke();

      // Draw labels with better positioning
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelDist = radius + 35;
      const labelX = centerX + Math.cos(labelAngle) * labelDist;
      const labelY = centerY + Math.sin(labelAngle) * labelDist;

      // Label with color
      this.ctx.fillStyle = tech.color;
      this.ctx.font = 'bold 11px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(tech.label, labelX, labelY);

      // Percentage with subtle color
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      this.ctx.font = '10px Arial';
      this.ctx.fillText(tech.value + '%', labelX, labelY + 13);

      currentAngle = endAngle;
    });

    // Draw center label
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.font = 'bold 13px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('Technology', centerX, centerY - 8);
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = 'rgba(155, 77, 150, 0.85)';
    this.ctx.fillText('Stack', centerX, centerY + 8);
  }

  private drawMetricBars(): void {
    const startX = this.canvas.width / 2 + 40;
    const startY = 60;
    const barWidth = 180;
    const barHeight = 14;
    const spacing = 55;

    // Smooth ease-out animation
    const easeProgress = this.easeOutQuart(Math.min(this.time / 1.5, 1));

    Object.entries(this.archMetrics).forEach((entry, index) => {
      const [label, value] = entry as [string, number];
      const y = startY + index * spacing;

      // Draw label
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      this.ctx.font = 'bold 11px Arial';
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(label, startX, y - 15);

      // Draw background bar
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      this.ctx.fillRect(startX, y, barWidth, barHeight);
      
      // Draw subtle border
      this.ctx.strokeStyle = 'rgba(155, 77, 150, 0.15)';
      this.ctx.lineWidth = 0.5;
      this.ctx.strokeRect(startX, y, barWidth, barHeight);

      // Draw progress bar with animation
      const fillWidth = barWidth * (value / 100) * easeProgress;
      const gradient = this.ctx.createLinearGradient(startX, y, startX + fillWidth, y);
      gradient.addColorStop(0, '#00bfff');
      gradient.addColorStop(1, '#9b4d96');
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(startX, y, fillWidth, barHeight);

      // Draw animated value with counting effect
      const animatedValue = Math.round(value * easeProgress);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      this.ctx.font = '10px Arial';
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(animatedValue + '%', startX + barWidth + 12, y + barHeight / 2);
    });
  }

  getTechPercentage(tech: MetricData): number {
    return tech.value;
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  private easeOutQuart(t: number): number {
    return 1 - Math.pow(1 - t, 4);
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', () => this.resizeCanvas());
  }
}
