import dotenv from 'dotenv';
dotenv.config();

import * as nodemailer from 'nodemailer';

console.log('MAIL_USER:', process.env.MAIL_USER);
console.log('MAIL_PASS:', process.env.MAIL_PASS ? '********' : 'undefined or empty');

if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
  throw new Error('Missing MAIL_USER or MAIL_PASS environment variables');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Send form message to admin + confirmation to user
export const sendMail = async (name: string, email: string, text: string) => {
  // Send to admin
  await transporter.sendMail({
    from: `"Contact Form" <${process.env['MAIL_USER']}>`,
    to: process.env['MAIL_RECEIVER'],
    subject: `New Contact Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${text}`
  });

  // Confirmation to user
  await transporter.sendMail({
    from: `"Tounga." <${process.env['MAIL_USER']}>`,
    to: email,
    subject: "We've received your message",
    text: `Hi ${name},\n\nThank you for contacting Me. I've received your message and will get back to you shortly.\n\nBest Regards,\nTounga Saidou`
  });
};

// Send follow-up "no reply received" message
//ToDO: Automate FollowUP Email
// export const sendNoReply = async (email: string) => {
//   await transporter.sendMail({
//     from: `"Bright Group Ltd." <${process.env['MAIL_USER']}>`,
//     to: email,
//     subject: "Just checking in",
//     text: `Hi there,\n\nWe noticed you haven’t replied. If you still need help or have questions, feel free to reach out anytime.\n\nWarm regards,\nTounga Saidou`
//   });
// };
