import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimatedBackgroundComponent } from './shared/background/animated-background.component';
import { PageContainerComponent } from './layout/page-container.component';
import { HeroComponent } from './components/Hero/hero.component';
import { AboutComponent } from './components/About/about.component';
import { SkillsComponent } from './components/Skills/skills.component';
import { ProjectsComponent } from './components/Projects/projects.component';
import { ArchitectureComponent } from './components/Architecture/architecture.component';
import { AIComponent } from './components/AI/ai.component';
import { ContactComponent } from './components/Contact/contact.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    AnimatedBackgroundComponent,
    PageContainerComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ArchitectureComponent,
    AIComponent,
    ContactComponent,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'DevPortfolio';

  isLoading = true;
  showLoader = true;
  loadingProgress = 0;

  private readonly LOADER_DURATION = 5000; // 5 seconds
  private readonly FADE_DURATION = 600;
  private readonly UPDATE_INTERVAL = 50; // Update every 50ms for smooth animation
  private progressInterval: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Start loading immediately - this is called before view rendering
    this.initializeLoading();
  }

  private initializeLoading(): void {
    const startTime = Date.now();

    // Update progress bar every 50ms
    this.progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = (elapsed / this.LOADER_DURATION) * 100;
      this.loadingProgress = Math.min(rawProgress, 100);

      // Manually trigger change detection to update the UI
      this.cdr.markForCheck();

      // Stop when complete
      if (this.loadingProgress >= 100) {
        clearInterval(this.progressInterval);
      }
    }, this.UPDATE_INTERVAL);

    // After 5 seconds, transition to content
    setTimeout(() => {
      clearInterval(this.progressInterval);
      this.loadingProgress = 100;
      this.isLoading = false;
      this.cdr.markForCheck();

      // Remove loader from DOM after fade animation completes
      setTimeout(() => {
        this.showLoader = false;
        this.cdr.markForCheck();
      }, this.FADE_DURATION);
    }, this.LOADER_DURATION);
  }

  ngOnDestroy(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }
}

