# R-Ignite Contact Form Backend - Setup Guide

## Overview
This backend service handles email submissions from your contact form. Users fill out the form on your website, and emails are sent directly to their inbox (and yours) without redirecting to a mail client.

---

## Option 1: Using Gmail (Simplest)

### Step 1: Enable 2-Factor Authentication on Gmail
1. Go to your Google Account: https://myaccount.google.com/
2. Click "Security" in the left menu
3. Enable "2-Step Verification"

### Step 2: Create App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer" (or your device)
3. Google will generate a 16-character password
4. Copy this password (you'll use it in .env file)

### Step 3: Configure Environment Variables
1. Create a `.env` file in your backend directory with:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
RECIPIENT_EMAIL=rignitegroup@gmail.com
PORT=5001
```

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Run the Server
```bash
npm start
```

The server should start on `http://localhost:5001`

---

## Option 2: Using Vercel (Recommended for Production)

### Deploy to Vercel (Free Hosting)

1. **Create Vercel Account**: https://vercel.com/signup

2. **Create `vercel.json` file** in your project root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend-express.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "backend-express.js"
    }
  ]
}
```

3. **Push to GitHub**:
   - Create a GitHub repository
   - Push your code (including .env variables as Vercel secrets)

4. **Connect to Vercel**:
   - Go to Vercel dashboard
   - Click "New Project"
   - Select your GitHub repo
   - Add environment variables in "Environment Variables" section:
     - EMAIL_USER
     - EMAIL_PASSWORD
   - Deploy!

5. **Update your HTML**:
   If your backend is on a different domain, set the API base before the contact form script runs:
   ```html
   <script>window.CONTACT_API_URL = 'https://your-app.vercel.app';</script>
   ```

---

## Option 3: Using Heroku (Alternative)

1. Create Heroku account: https://www.heroku.com/
2. Install Heroku CLI
3. Run:
```bash
heroku create your-app-name
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
git push heroku main
```

---

## Testing Locally

1. Start your backend:
```bash
npm start
```

2. If you are opening the contact page from a different host during local testing, set:
```html
<script>window.CONTACT_API_URL = 'http://localhost:5001';</script>
```

3. Open your contact page and test the form

---

## Troubleshooting

### "Invalid login" error
- Check that you're using the 16-character App Password, not your Gmail password
- Ensure 2-Factor Authentication is enabled on your Google Account

### "CORS error"
- Make sure the frontend URL is allowed in CORS settings
- Update the CORS configuration if your frontend is on a different domain

### "Email not received"
- Check spam/junk folder
- Verify EMAIL_USER and EMAIL_PASSWORD are correct
- Check server logs for error messages

---

## Features Included

✓ Contact form submission via HTTP
✓ Email sent to your inbox (rignitegroup@gmail.com)
✓ Confirmation email sent to user
✓ Form validation
✓ HTML-formatted emails
✓ Error handling
✓ Loading states and user feedback

---

## Frontend Integration

Your updated `contact-updated.html` already includes:
- Form submission handler
- Loading/success/error messages
- Email validation
- Disabled button during submission

Just replace your current contact.html with the updated version and deploy the backend!

---

## Production Checklist

- [ ] Backend deployed (Vercel, Heroku, or your own server)
- [ ] Environment variables configured
- [ ] Frontend HTML updated with correct backend URL
- [ ] Test form submission works
- [ ] Check emails arrive in inbox
- [ ] Verify confirmation email is sent to users
- [ ] Monitor error logs

---

## Need Help?

Common issues and solutions are included above. For additional support:
- Check server logs for detailed error messages
- Verify all environment variables are set correctly
- Test the backend health endpoint: `/api/health`
