import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  submitted = false;
  isLoading = false;

  contactLinks = [
    { icon: '📧', label: 'Email', value: 'toungas@zohomail.com', href: 'mailto:toungas@zohomail.com' },
    { icon: '📱', label: 'Phone', value: '+27 67 257 2112', href: 'tel:+27672572112' },
    { icon: '💼', label: 'LinkedIn', value: 'Tounga Saidou', href: 'https://www.linkedin.com/in/tounga-saidou-188677264/' },
    { icon: '🐙', label: 'GitHub', value: 'B1narybot', href: 'https://github.com/B1narybot' },
  ];

  submitForm(): void {
    if (this.isFormValid()) {
      this.isLoading = true;
      // Simulate form submission
      setTimeout(() => {
        this.submitted = true;
        this.isLoading = false;
        this.resetForm();
      }, 1000);
    }
  }

  isFormValid(): boolean {
    return this.formData.name.trim().length > 0 &&
           this.formData.email.trim().length > 0 &&
           this.formData.message.trim().length > 0;
  }

  resetForm(): void {
    this.formData = { name: '', email: '', subject: '', message: '' };
    setTimeout(() => {
      this.submitted = false;
    }, 3000);
  }
}

