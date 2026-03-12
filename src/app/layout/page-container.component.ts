import { Component, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'app-page-container',
  templateUrl: './page-container.component.html',
  styleUrls: ['./page-container.component.css'],
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
})
export class PageContainerComponent {
  navOpen = false;

  constructor(private elRef: ElementRef) {}

  onNavToggle(isOpen: boolean): void {
    this.navOpen = isOpen;
  }

  onNavClose(): void {
    this.navOpen = false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const skillsSection = document.getElementById('Skills-Section');
    const workSection = document.getElementById('work-section');

    if (skillsSection) {
      const skillsRect = skillsSection.getBoundingClientRect();
      if (skillsRect.top <= window.innerHeight && skillsRect.bottom >= 0) {
        skillsSection.classList.add('visible');
      }
    }

    if (workSection) {
      const workRect = workSection.getBoundingClientRect();
      if (workRect.top <= window.innerHeight && workRect.bottom >= 0) {
        workSection.classList.add('visible');
      }
    }
  }
}
