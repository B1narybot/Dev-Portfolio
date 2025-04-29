import { Component, OnInit, AfterViewInit, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'DevPortfolio';
  navOpen = false;

  progressValues = [0, 0, 0, 0, 0, 0];
  finalValues = [89, 82, 78, 85, 78, 84];

  animateHeading = false;
  animateProgressBars = false;

  notificationMessage: string | null = null; 
  notificationVisible = false; 
skills: any;
// projects: any;

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
    // Trigger progress bar animations after short delay
    setTimeout(() => {
      this.animateProgressBarsOnLoad();
    }, 200);
  
    setTimeout(() => {
      this.isLoading = false;
    
      setTimeout(() => {
        this.showLoader = false;
    
        setTimeout(() => {
          const animatedElements: NodeListOf<HTMLElement> =
            this.elRef.nativeElement.querySelectorAll('[data-animate]');
    
          const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                console.log('Observer triggered:', entry.target);
                entry.target.classList.add('in-view');
                obs.unobserve(entry.target);
              }
            });
          }, { threshold: 0.3 });
    
          animatedElements.forEach(el => {
            el.classList.remove('in-view'); // Reset for reload
            observer.observe(el);
          });
        }, 100); // small delay to ensure layout has stabilized
    
      }, 1500); // matches fade-out
    }, 6000); // initial delay
    
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

  submitForm(event: Event) {
    event.preventDefault(); // Prevent default form submission
  
    const form = event.target as HTMLFormElement;
  
    const formData = {
      name: (form.querySelector('[name="name"]') as HTMLInputElement).value,
      email: (form.querySelector('[name="email"]') as HTMLInputElement).value,
      text: (form.querySelector('[name="text"]') as HTMLTextAreaElement).value
    };
  
    fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      console.log(data.message);
      this.showNotification(data.message || 'Message sent successfully!');
      form.reset();
    })
    .catch(err => {
      console.error('Error:', err);
      this.showNotification('Something went wrong. Please try again later.');
    });
  }

  isLoading = true;
  showLoader = true;


  constructor(private elRef: ElementRef) {}

}
