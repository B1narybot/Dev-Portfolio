import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  // standalone: true,
  // imports: [CommonModule], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'DevPortfolio';
  navOpen = false; 

  progressValues = [0, 0, 0, 0, 0, 0]; 
  finalValues = [95, 82, 78, 70, 66, 80];

  toggleNav() {
    this.navOpen = !this.navOpen;
  }

  closeNav() {
    this.navOpen = false;
  }

  ngOnInit(): void {
    this.resetProgressBars();
    this.animateProgressBars();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.animateProgressBars();
    }, 200);
  }

  resetProgressBars(): void {
    for (let i = 0; i < this.progressValues.length; i++) {
      this.progressValues[i] = 0;
    }
  }

  animateProgressBars(): void {
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
}
