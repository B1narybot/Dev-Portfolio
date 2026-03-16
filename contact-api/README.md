# Contact API - Node.js Email Server

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Email Configuration (Optional for Development)

#### For Development (Email Logging Only)
Just run the server - it will log emails to the console:
```bash
npm run dev
```

#### For Real Email Sending
1. Open `.env` file
2. Update `MAIL_PASS` with your Zoho app password:
   - Go to: https://mail.zoho.com/u/1/#settings/security/apppasswords
   - Create a new app password for "Node.js Contact Form"
   - Copy the 16-character password to `.env`

### 3. Run the Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm run build
npm start
```

## Environment Variables

```
MAIL_USER=toungas17@zohomail.com           # Your Zoho email
MAIL_PASS=your-zoho-app-password           # 16-char app password from Zoho
MAIL_RECEIVER=toungas17@zohomail.com      # Where to send submissions
PORT=5000                                   # Server port
```

## How It Works

### Development Mode (Without MAIL_PASS)
- Server starts successfully ✅
- Form submissions are logged to console 📧
- No actual emails sent (good for UI testing)
- Shows you what would be sent

### Production Mode (With MAIL_PASS)
- Actual emails are sent via Zoho SMTP 📨
- Form submissions reach your inbox
- Automatic confirmation sent to users

## API Endpoint

```
POST http://localhost:5000/api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'd like to connect!"
}
```

## Health Check

```
GET http://localhost:5000/api/health

Response: { "status": "FormMailer is healthy" }
```

## Files

- `server.ts` - Express server setup
- `mailer.ts` - Email sending logic
- `Templates/` - Email HTML templates
- `.env` - Environment configuration (DO NOT COMMIT)
- `.gitignore` - Prevents .env from being uploaded

## Troubleshooting

**"MAIL_USER: undefined"**
- Server will run in dev mode (emails logged to console) ✅

**SMTP errors**
- Check your Zoho app password is correct
- Verify `.env` file exists and has the password
- Make sure it's a 16-character app password, not your account password

**Port 5000 already in use**
- Change `PORT` in `.env`
- Or kill the existing process on port 5000
