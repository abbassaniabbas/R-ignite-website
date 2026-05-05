# Quick Start Guide - Contact Form Backend

## What You Got

Your contact form now sends emails directly to inboxes instead of opening a mail client. Here's what changed:

### Frontend (contact.html)
- ✅ Form still looks the same
- ✅ Shows loading/success/error messages
- ✅ Validates email format
- ✅ Sends to a backend server instead of mailto

### Backend (Choose One)

You have **two backend options**:

---

## 🚀 Option 1: Node.js + Express (Recommended)

**Best for:** Most hosting environments, easy to deploy

### Quick Setup (5 minutes):

1. **Download Files**: You have these files ready:
   - `backend-express.js` - The server code
   - `package.json` - Dependencies list
   - `.env-example` - Configuration template

2. **Set Up Locally** (to test):
   ```bash
   # Create a folder for your backend
   mkdir my-backend
   cd my-backend
   
   # Copy the files here
   cp backend-express.js .
   cp package.json .
   cp .env-example .env
   ```

3. **Edit `.env` file**:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   RECIPIENT_EMAIL=rignitegroup@gmail.com
   PORT=5001
   ```

4. **Install and Run**:
   ```bash
   npm install
   npm start
   ```

5. **Update contact.html**:
   Find the contact API base in the JavaScript section:
   ```javascript
   const contactApiUrl = configuredApiBase
   ```
   Set `window.CONTACT_API_URL` or `data-contact-api-base` if your backend lives on a different domain.

---

## 🐍 Option 2: Python + Flask (Alternative)

**Best for:** If you prefer Python

### Quick Setup:

1. **Get the file**: `backend.py`

2. **Set up environment**:
   ```bash
   pip install flask flask-cors python-dotenv
   ```

3. **Create `.env` file**:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   ```

4. **Run**:
   ```bash
   python backend.py
   ```

---

## 📧 Getting Gmail App Password (Both Options)

1. Go to: https://myaccount.google.com/
2. Click **Security** (left sidebar)
3. Enable **2-Step Verification** if not enabled
4. Go to: https://myaccount.google.com/apppasswords
5. Select **Mail** and your device type
6. Copy the 16-character password
7. Use this in your `.env` file

---

## 🌐 Deploying to Production

### Vercel (Easiest - Free)
```bash
npm install -g vercel
vercel
```

### Heroku (Alternative - Free tier available)
```bash
heroku create your-app-name
heroku config:set EMAIL_USER=...
heroku config:set EMAIL_PASSWORD=...
git push heroku main
```

### Your Own Server
Set environment variables and run the backend on your server.

---

## ✅ Testing

After deployment:

1. Open your contact page
2. Fill out the form
3. Click "Send Message"
4. Should see success message
5. Check your inbox (rignitegroup@gmail.com)
6. Check sender's inbox for confirmation email

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Invalid login" | Use 16-char app password, not Gmail password |
| CORS error | Update frontend URL in fetch request |
| Email not sent | Check EMAIL_USER and EMAIL_PASSWORD in .env |
| Port already in use | Change PORT in .env or stop other apps |

---

## 📝 Files Included

- **contact.html** - Updated form with working submission
- **backend-express.js** - Node.js server (recommended)
- **backend.py** - Python server (alternative)
- **package.json** - Dependencies for Node.js
- **.env-example** - Configuration template
- **SETUP_GUIDE.md** - Detailed setup instructions
- **QUICK_START.md** - This file

---

## 🎯 Next Steps

1. Choose Node.js or Python backend
2. Get Gmail app password
3. Test locally
4. Deploy to production
5. Update frontend with production URL

Done! Your contact form will now send emails directly. 🎉
