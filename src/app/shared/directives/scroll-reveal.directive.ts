import { Directive, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  @Input() revealDelay = 0;

  private observer: IntersectionObserver | null = null;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.initializeObserver();
  }

  private initializeObserver(): void {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add animation class with delay
          setTimeout(() => {
            this.elementRef.nativeElement.classList.add('scroll-reveal-visible');
          }, this.revealDelay);

          // Stop observing once revealed
          if (this.observer) {
            this.observer.unobserve(entry.target);
          }
        }
      });
    }, options);

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
