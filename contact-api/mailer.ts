import dotenv from 'dotenv';
dotenv.config();

import * as nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Debug environment
console.log('MAIL_USER:', process.env.MAIL_USER);
console.log('MAIL_PASS:', process.env.MAIL_PASS ? '********' : 'undefined or empty');

if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
  throw new Error('Missing MAIL_USER or MAIL_PASS environment variables');
}

// Email transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

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
