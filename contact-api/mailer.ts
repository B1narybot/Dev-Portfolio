import dotenv from 'dotenv';
dotenv.config();

import * as nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Debug environment
console.log('MAIL_USER:', process.env.MAIL_USER);
console.log('MAIL_PASS:', process.env.MAIL_PASS ? '✓ Configured' : 'undefined or empty');

const isDevelopment = process.env.NODE_ENV !== 'production';

if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
  if (isDevelopment) {
    console.warn(
      '\n⚠️  EMAIL CREDENTIALS NOT CONFIGURED\n' +
      'To enable email sending:\n' +
      '1. Copy contact-api/.env.example to contact-api/.env\n' +
      '2. Add your Zoho app password to the MAIL_PASS field\n' +
      '3. Get your app password at: https://mail.zoho.com/u/1/#settings/security/apppasswords\n' +
      '\nRunning in dev mode - emails will be logged to console.\n'
    );
  } else {
    throw new Error('Missing MAIL_USER or MAIL_PASS environment variables');
  }
}

// Email transporter
let transporter: any;

if (process.env.MAIL_USER && process.env.MAIL_PASS) {
  // Strip spaces from password (Zoho app passwords have spaces for readability)
  const cleanPassword = process.env.MAIL_PASS.replace(/\s/g, '');
  
  console.log(`🔐 SMTP Config: user=${process.env.MAIL_USER}, password length=${cleanPassword.length} chars`);
  
  transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: cleanPassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
    socketTimeout: 10000,
    logger: true,
    debug: true,
  });
  
  // Verify transporter connection on startup
  transporter.verify((error: any, success: boolean) => {
    if (error) {
      console.error('❌ SMTP Connection Error:', error.code, '-', error.message);
      console.error('📋 Response:', error.response);
    } else if (success) {
      console.log('✅ SMTP Connection Verified - Ready to send emails');
    }
  });
} else if (isDevelopment) {
  // Dev mode: use ethereal test account
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'test@ethereal.email',
      pass: 'test123456',
    },
  });
} else {
  throw new Error('Email configuration required for production');
}

// Absolute path to Templates folder
const templatesDir = path.resolve(
  __dirname,
  'Templates'
);

// Load a specific template by filename
function loadTemplate(fileName: string): string {
  const filePath = path.join(templatesDir, fileName);
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error loading template ${fileName}:`, error);
    return '';
  }
}

// Fill in template placeholders with support for filters like | uppercase
function fillTemplate(template: string, variables: Record<string, string>): string {
  // Define simple filters
  const filters: Record<string, (input: string) => string> = {
    uppercase: (input: string) => input.toUpperCase(),
    lowercase: (input: string) => input.toLowerCase(),
    capitalize: (input: string) => input.charAt(0).toUpperCase() + input.slice(1),
  };

  // Regex to match {{ variable | filter }} or {{ variable }}
  const pattern = /{{\s*([\w]+)(?:\s*\|\s*(\w+))?\s*}}/g;

  return template.replace(pattern, (_, varName, filterName) => {
    let value = variables[varName] ?? '';
    if (filterName && filters[filterName]) {
      value = filters[filterName](value);
    }
    return value;
  });
}

// Send email to admin and confirmation to user
export const sendMail = async (name: string, email: string, message: string, phone: string = '') => {
  const adminTemplateRaw = loadTemplate('adminTemp.html');
  const userTemplateRaw = loadTemplate('userTemp.html');

  const submissionTime = new Date().toLocaleString();

  const htmlToAdmin = fillTemplate(adminTemplateRaw, {
    userName: name,
    userEmail: email,
    userMessage: message,
    submissionTime,
  });

  const htmlToUser = fillTemplate(userTemplateRaw, {
    userName: name,
    userMessage: message,
  });

  // Plain text fallback
  const textToAdmin = `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage:\n${message}`;
  const textToUser = `Hi ${name},\n\nThank you for contacting us. We've received your message and will get back to you shortly.\n\nBest regards,\nTounga Saidou`;

  // Development mode: log to console instead of sending
  if (isDevelopment && !process.env.MAIL_USER) {
    console.log('\n📧 ===== EMAIL WOULD BE SENT (DEV MODE) =====');
    console.log('\n📮 TO ADMIN:');
    console.log(`From: Contact Form`);
    console.log(`To: ${process.env['MAIL_RECEIVER'] || 'admin@example.com'}`);
    console.log(`Subject: New Contact Form Submission from ${name}`);
    console.log(`\n${textToAdmin}`);
    console.log('\n📮 TO USER:');
    console.log(`From: Tounga Saidou <${process.env['MAIL_USER'] || 'tounga@example.com'}>`);
    console.log(`To: ${email}`);
    console.log(`Subject: We've received your message`);
    console.log(`\n${textToUser}`);
    console.log('\n✅ ===== END EMAIL PREVIEW =====\n');
    return;
  }

  // Production mode: send actual emails
  // Send email to admin
  await transporter.sendMail({
    from: `"Contact Form" <${process.env['MAIL_USER']}>`,
    to: process.env['MAIL_RECEIVER'],
    subject: `New Contact Form Submission from ${name}`,
    text: textToAdmin,
    html: htmlToAdmin || undefined,
  });

  // Send confirmation to user
  await transporter.sendMail({
    from: `"Tounga." <${process.env['MAIL_USER']}>`,
    to: email,
    subject: "We've received your message",
    text: textToUser,
    html: htmlToUser || undefined,
  });
};
