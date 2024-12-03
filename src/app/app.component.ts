import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'DevPortfolio';
  navOpen = false;

  progressValues = [0, 0, 0, 0, 0, 0];
  finalValues = [95, 82, 78, 70, 66, 80];

  animateHeading = false;
  animateProgressBars = false;

  notificationMessage: string | null = null; 
  notificationVisible = false; 

  toggleNav() {
    this.navOpen = !this.navOpen;
  }

  closeNav() {
    this.navOpen = false;
  }

  ngOnInit(): void {
    this.resetProgressBars();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.animateProgressBarsOnLoad();
    }, 200);
  }

  resetProgressBars(): void {
    for (let i = 0; i < this.progressValues.length; i++) {
      this.progressValues[i] = 0;
    }
  }

  animateProgressBarsOnLoad(): void {
    for (let i = 0; i < this.finalValues.length; i++) {
      this.incrementProgress(i);
    }
  }

  incrementProgress(index: number): void {
    let value = 0;
    const targetValue = this.finalValues[index];

    const interval = setInterval(() => {
      value += 1;
      this.progressValues[index] = value;

      if (value >= targetValue) {
        clearInterval(interval);
      }
    }, 20);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const skillsSection = document.getElementById('Skills-Section');
    const workSection = document.getElementById('work-section');

    if (skillsSection && workSection) {
      const skillsRect = skillsSection.getBoundingClientRect();
      const workRect = workSection.getBoundingClientRect();

      if (skillsRect.top <= window.innerHeight && skillsRect.bottom >= 0 && !this.animateHeading) {
        this.animateHeading = true; 
        skillsSection.classList.add('visible'); 
      }

      if (workRect.top <= window.innerHeight && workRect.bottom >= 0 && !this.animateHeading) {
        this.animateHeading = true; 
        workSection.classList.add('visible'); 
      }

      if (skillsRect.top <= window.innerHeight && skillsRect.bottom >= 0 && !this.animateProgressBars) {
        this.animateProgressBars = true; 
        for (let i = 0; i < this.finalValues.length; i++) {
          this.incrementProgress(i);
        }
      }
    }
  }

  triggerAnimations(): void {
    if (!this.animateHeading) {
      this.animateHeading = true; 
    }

    if (!this.animateProgressBars) {
      this.animateProgressBars = true; 
      for (let i = 0; i < this.finalValues.length; i++) {
        this.incrementProgress(i);
      }
    }
  }

  copyToClipboard(text: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = text;

    textarea.style.position = 'fixed';  
    textarea.style.opacity = '0';        
    document.body.appendChild(textarea); 

    textarea.select();
    textarea.setSelectionRange(0, 99999); 

    document.execCommand('copy');

    document.body.removeChild(textarea);

    this.showNotification(`Copied to clipboard: ${text}`);
  }

  showNotification(message: string): void {
    this.notificationMessage = message;
    this.notificationVisible = true;

    setTimeout(() => {
      this.notificationVisible = false;
      this.notificationMessage = null;
    }, 3000);
  }
}