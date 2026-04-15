import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class NavbarComponent implements OnDestroy {
  navOpen = false;

  @Output() navToggle = new EventEmitter<boolean>();
  @Output() navClose = new EventEmitter<void>();

  toggleNav(): void {
    this.navOpen = !this.navOpen;
    this.updateBodyScrollLock(this.navOpen);
    this.navToggle.emit(this.navOpen);
  }

  closeNav(): void {
    this.navOpen = false;
    this.updateBodyScrollLock(false);
    this.navClose.emit();
  }

  private updateBodyScrollLock(open: boolean): void {
    document.body.style.overflow = open ? 'hidden' : '';
  }

  ngOnDestroy(): void {
    this.updateBodyScrollLock(false);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.closeNav();
    }
  }
}
