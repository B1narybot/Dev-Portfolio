// netlify/functions/mailer.js

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const env = process.env;

  if (!env.MAIL_USER || !env.MAIL_PASS || !env.MAIL_RECEIVER) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Missing email environment variables' }),
    };
  }

  const { name, email, message = '' } = JSON.parse(event.body);
  const submissionTime = new Date().toLocaleString();

  // --- Load Templates ---
  const templatesDir = path.resolve(__dirname, 'Templates');

  function loadTemplate(fileName) {
    const filePath = path.join(templatesDir, fileName);
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error(`Error loading template ${fileName}:`, error);
      return '';
    }
  }

  function fillTemplate(template, variables) {
    const filters = {
      uppercase: (str) => str.toUpperCase(),
      lowercase: (str) => str.toLowerCase(),
      capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
    };

    const pattern = /{{\s*([\w]+)(?:\s*\|\s*(\w+))?\s*}}/g;

    return template.replace(pattern, (_, varName, filterName) => {
      let value = variables[varName] ?? '';
      if (filterName && filters[filterName]) {
        value = filters[filterName](value);
      }
      return value;
    });
  }

  const adminTemplate = loadTemplate('adminTemp.html');
  const userTemplate = loadTemplate('userTemp.html');

  const htmlToAdmin = fillTemplate(adminTemplate, {
    userName: name,
    userEmail: email,
    userMessage: message,
    submissionTime,
  });

  const htmlToUser = fillTemplate(userTemplate, {
    userName: name,
    userMessage: message,
  });

  const textToAdmin = `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`;
  const textToUser = `Hi ${name},\n\nThank you for contacting us. We've received your message and will get back to you shortly.\n\nBest regards,\nTounga Saidou`;

  // --- Email Transporter ---
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: env.MAIL_USER,
      pass: env.MAIL_PASS,
    },
  });

  try {
    // Send to Admin
    await transporter.sendMail({
      from: `"Contact Form" <${env.MAIL_USER}>`,
      to: env.MAIL_RECEIVER,
      subject: `New Contact Form Submission from ${name}`,
      text: textToAdmin,
      html: htmlToAdmin || undefined,
    });

    // Send Confirmation to User
    await transporter.sendMail({
      from: `"Tounga Saidou" <${env.MAIL_USER}>`,
      to: email,
      subject: "Message received 👌",
      text: textToUser,
      html: htmlToUser || undefined,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Emails sent successfully' }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to send emails',
        error: err.message,
      }),
    };
  }
};
