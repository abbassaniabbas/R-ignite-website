// backend-express.js
// Contact form email backend for R-Ignite Group
// Stack: Node.js + Express + Nodemailer
//
// Setup:
//   1. npm install
//   2. Copy .env.example to .env and fill in credentials
//   3. node backend-express.js  (or: npm run dev)

const express    = require('express');
const nodemailer = require('nodemailer');
const cors       = require('cors');
const dotenv     = require('dotenv');

dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────────────────────────
app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',   // set to your domain in production
  methods: ['GET', 'POST'],
}));

// ── Email transporter ───────────────────────────────────────────
// Using Gmail with App Password (generate at myaccount.google.com → Security → App passwords)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter on startup
transporter.verify((error) => {
  if (error) {
    console.error('⚠️  Email transporter error:', error.message);
  } else {
    console.log('✅  Email transporter ready');
  }
});

// ── Brand colours (used in HTML emails) ────────────────────────
const BRAND = {
  ink:          '#0A0A0A',
  accent:       '#0D6B4F',
  accentLight:  '#E8F5F0',
  accentMid:    '#1A8A65',
  surface:      '#F7F5F2',
  muted:        '#6B6B6B',
  rule:         '#E2E2E2',
};

// ── HTML email templates ────────────────────────────────────────

function companyEmailHtml({ name, email, phone, org, subject, message }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.surface};font-family:Outfit,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.surface};padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid ${BRAND.rule};">

        <!-- Header -->
        <tr>
          <td style="background:${BRAND.ink};padding:28px 40px;">
            <div style="font-size:18px;font-weight:800;letter-spacing:-.5px;color:#ffffff;">
              R<span style="color:${BRAND.accentMid};">·</span>IGNITE GROUP
            </div>
            <div style="font-size:12px;color:rgba(255,255,255,.4);margin-top:4px;letter-spacing:.05em;text-transform:uppercase;">
              New Contact Form Submission
            </div>
          </td>
        </tr>

        <!-- Status bar -->
        <tr>
          <td style="background:${BRAND.accentLight};padding:12px 40px;border-bottom:1px solid ${BRAND.rule};">
            <span style="font-size:13px;font-weight:600;color:${BRAND.accent};">
              📩 New message from ${escapeHtml(name)}
            </span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">

            <!-- Contact details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              ${detailRow('Name',         escapeHtml(name))}
              ${detailRow('Email',        `<a href="mailto:${escapeHtml(email)}" style="color:${BRAND.accent};text-decoration:none;">${escapeHtml(email)}</a>`)}
              ${detailRow('Phone',        phone  ? escapeHtml(phone)  : '<span style="color:#ADADAD;">Not provided</span>')}
              ${detailRow('Organisation', org    ? escapeHtml(org)    : '<span style="color:#ADADAD;">Not provided</span>')}
              ${detailRow('Subject',      `<strong>${escapeHtml(subject)}</strong>`)}
            </table>

            <!-- Message -->
            <div style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${BRAND.muted};margin-bottom:10px;">
              Message
            </div>
            <div style="background:${BRAND.surface};border:1px solid ${BRAND.rule};border-radius:10px;padding:20px 24px;font-size:15px;line-height:1.75;color:${BRAND.ink};white-space:pre-wrap;">
              ${escapeHtml(message)}
            </div>

          </td>
        </tr>

        <!-- Quick reply -->
        <tr>
          <td style="padding:0 40px 32px;">
            <a href="mailto:${escapeHtml(email)}?subject=Re: ${encodeURIComponent(subject)}"
               style="display:inline-block;padding:12px 28px;background:${BRAND.accent};color:#ffffff;text-decoration:none;border-radius:100px;font-size:14px;font-weight:700;">
              Reply to ${escapeHtml(name)} →
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;border-top:1px solid ${BRAND.rule};background:${BRAND.surface};">
            <p style="margin:0;font-size:12px;color:#ADADAD;line-height:1.6;">
              This message was submitted via the contact form at rignitegroup.com<br>
              © 2025 R-Ignite Group · Abuja, Nigeria
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function userConfirmationHtml({ name, subject, message }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We received your message</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.surface};font-family:Outfit,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.surface};padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid ${BRAND.rule};">

        <!-- Header -->
        <tr>
          <td style="background:${BRAND.ink};padding:28px 40px;">
            <div style="font-size:18px;font-weight:800;letter-spacing:-.5px;color:#ffffff;">
              R<span style="color:${BRAND.accentMid};">·</span>IGNITE GROUP
            </div>
            <div style="font-size:12px;color:rgba(255,255,255,.4);margin-top:4px;letter-spacing:.05em;text-transform:uppercase;">
              Message Received
            </div>
          </td>
        </tr>

        <!-- Green confirmation banner -->
        <tr>
          <td style="background:${BRAND.accentLight};padding:20px 40px;border-bottom:1px solid rgba(13,107,79,.15);">
            <div style="font-size:20px;font-weight:800;color:${BRAND.accent};letter-spacing:-.5px;">
              ✓ Got it, ${escapeHtml(name)}!
            </div>
            <div style="font-size:14px;color:${BRAND.accentMid};margin-top:4px;">
              We'll be in touch within 24 hours.
            </div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="font-size:15px;line-height:1.75;color:${BRAND.muted};margin:0 0 24px;">
              Thank you for reaching out to R-Ignite Group. We've received your message and one of our team members will respond promptly.
            </p>

            <!-- Message recap -->
            <div style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${BRAND.muted};margin-bottom:10px;">
              Your Message
            </div>
            <div style="background:${BRAND.surface};border:1px solid ${BRAND.rule};border-radius:10px;padding:20px 24px;margin-bottom:28px;">
              <div style="font-size:13px;font-weight:700;color:${BRAND.ink};margin-bottom:8px;">
                Subject: ${escapeHtml(subject)}
              </div>
              <div style="font-size:14px;line-height:1.7;color:${BRAND.muted};white-space:pre-wrap;">
                ${escapeHtml(message)}
              </div>
            </div>

            <!-- Contact details -->
            <div style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${BRAND.muted};margin-bottom:10px;">
              Need to reach us directly?
            </div>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:4px 0;font-size:14px;color:${BRAND.muted};">
                  📧&nbsp; <a href="mailto:rignitegroup@gmail.com" style="color:${BRAND.accent};text-decoration:none;font-weight:600;">rignitegroup@gmail.com</a>
                </td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-size:14px;color:${BRAND.muted};">
                  📞&nbsp; <a href="tel:+2347030579173" style="color:${BRAND.accent};text-decoration:none;font-weight:600;">+234 703 057 9173</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;border-top:1px solid ${BRAND.rule};background:${BRAND.surface};">
            <p style="margin:0;font-size:12px;color:#ADADAD;line-height:1.6;">
              R-Ignite Group · Abuja, Nigeria<br>
              Empower · Innovate · Excel
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Helper: detail row for company email ───────────────────────
function detailRow(label, value) {
  return `<tr>
    <td style="padding:8px 0;border-bottom:1px solid ${BRAND.rule};width:120px;font-size:13px;font-weight:600;color:${BRAND.muted};vertical-align:top;">
      ${label}
    </td>
    <td style="padding:8px 0 8px 16px;border-bottom:1px solid ${BRAND.rule};font-size:14px;color:${BRAND.ink};">
      ${value}
    </td>
  </tr>`;
}

// ── Helper: escape HTML ─────────────────────────────────────────
function escapeHtml(text) {
  if (!text) return '';
  return String(text).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[c]));
}

// ── POST /api/send-email ────────────────────────────────────────
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, phone, org, subject, message } = req.body;

    // Required field validation
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({ success: false, message: 'Missing required fields: name, email, subject, message.' });
    }

    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    const data = {
      name:    name.trim(),
      email:   email.trim(),
      phone:   phone?.trim()   || '',
      org:     org?.trim()     || '',
      subject: subject.trim(),
      message: message.trim(),
    };

    // Email to R-Ignite team
    await transporter.sendMail({
      from:     `"R-Ignite Contact Form" <${process.env.EMAIL_USER}>`,
      to:       process.env.RECIPIENT_EMAIL || 'rignitegroup@gmail.com',
      replyTo:  data.email,
      subject:  `New enquiry: ${data.subject}`,
      html:     companyEmailHtml(data),
    });

    // Confirmation email to sender
    await transporter.sendMail({
      from:    `"R-Ignite Group" <${process.env.EMAIL_USER}>`,
      to:      data.email,
      subject: `We received your message — R-Ignite Group`,
      html:    userConfirmationHtml(data),
    });

    return res.status(200).json({ success: true, message: 'Message sent successfully.' });

  } catch (error) {
    console.error('Send email error:', error);
    return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// ── GET /api/health ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'R-Ignite Email API', timestamp: new Date().toISOString() });
});

// ── Start server ────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀  R-Ignite email server running on http://localhost:${PORT}`);
});

module.exports = app;
