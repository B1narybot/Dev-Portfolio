import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class NavbarComponent {
  navOpen = false;

  @Output() navToggle = new EventEmitter<boolean>();
  @Output() navClose = new EventEmitter<void>();

  toggleNav(): void {
    this.navOpen = !this.navOpen;
    this.navToggle.emit(this.navOpen);
  }

  closeNav(): void {
    this.navOpen = false;
    this.navClose.emit();
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.closeNav();
    }
  }
}
