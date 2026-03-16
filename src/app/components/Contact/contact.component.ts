import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ScrollRevealDirective],
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
    { icon: '📧', label: 'Email', value: 'toungas17@zohomail.com', href: 'mailto:toungas17@zohomail.com' },
    { icon: '📱', label: 'Phone', value: '+27 67 257 2112', href: 'tel:+27672572112' },
    { icon: '💼', label: 'LinkedIn', value: 'Tounga Saidou', href: 'https://www.linkedin.com/in/tounga-saidou-188677264/' },
    { icon: '🐙', label: 'GitHub', value: 'B1narybot', href: 'https://github.com/B1narybot' },
  ];

  /**
   * Check if the API server is available
   */
  private async checkApiHealth(): Promise<boolean> {
    if (environment.production) {
      // In production (Netlify), assume the function is available
      return true;
    }

    // In development, check if the local server is running
    const healthEndpoint = environment.apiEndpoint.replace('/api/contact', '/api/health');
    
    try {
      const response = await Promise.race([
        fetch(healthEndpoint, { method: 'GET' }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Health check timeout')), 3000)
        ),
      ]);
      
      return (response as Response).ok;
    } catch (error) {
      return false;
    }
  }

  submitForm(): void {
    if (this.isFormValid()) {
      this.isLoading = true;
      
      const emailData = {
        name: this.formData.name,
        email: this.formData.email,
        message: this.formData.message,
      };

      // Check API availability first
      this.checkApiHealth()
        .then(isHealthy => {
          if (!isHealthy && !environment.production) {
            // Development mode: API not available, use fallback
            console.warn(
              '⚠️ Contact API server not running. To enable email submissions during development:\n' +
              '1. Open a new terminal\n' +
              '2. Run: cd contact-api && npm run dev\n' +
              'For now, showing success message for UI testing.'
            );
            
            // Simulate successful submission for UI/UX testing
            return Promise.resolve({ message: 'Message queued (dev mode - API offline)' });
          }

          // API is available, send the form
          return Promise.race([
            fetch(environment.apiEndpoint, {
              method: 'POST',
              body: JSON.stringify(emailData),
              headers: { 'Content-Type': 'application/json' },
            }).then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            }),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Email service timeout - took too long to respond')), 20000)
            ),
          ]) as Promise<any>;
        })
        .then(data => {
          this.submitted = true;
          this.isLoading = false;
          this.resetForm();
          
          // Show appropriate message
          if (data.message?.includes('dev mode')) {
            console.log('✅ Form submission successful (development mode - API offline)');
          }
        })
        .catch(error => {
          console.error('Error sending email:', error);
          this.isLoading = false;
          
          if (!environment.production) {
            alert(
              '⚠️ Email Service Issue\n\n' +
              'Error: ' + error.message + '\n\n' +
              'To fix this:\n' +
              '1. Check API server is running: cd contact-api && npm run dev\n' +
              '2. Check server logs for SMTP connection errors\n' +
              '3. Verify Zoho credentials in contact-api/.env\n\n' +
              'Direct email: toungas17@zohomail.com'
            );
          } else {
            alert('Failed to send message. Please try again or contact via email.');
          }
        });
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

