import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { sendMail } from './mailer';

dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 5000;

app.use(cors());
app.use(bodyParser.json());

// 1. Health check endpoint
app.get('/api/health', (_req: express.Request, res: express.Response) => {
  try {
    res.status(200).json({ status: 'FormMailer is healthy' });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(400).json({ status: 'FormMailer health check failed' });
  }
});

// 2. Endpoint to handle form submission
app.post('/api/contact', async (req: express.Request, res: express.Response) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields: name, email, message' });
  }

  try {
    console.log(`📧 Processing contact form submission from ${email}...`);
    await Promise.race([
      sendMail(name, email, message),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Email send timeout - took too long')), 15000)
      ),
    ]);
    console.log(`✅ Email sent for: ${email}`);
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('❌ Error sending contact email:', err);
    res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ FormMailer server running on port ${PORT}`);
});
