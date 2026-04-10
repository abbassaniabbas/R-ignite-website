# backend.py
# Contact form email backend for R-Ignite Group
# Stack: Python 3 + Flask + smtplib
#
# Setup:
#   pip install flask flask-cors python-dotenv
#   cp .env.example .env  →  fill in credentials
#   python backend.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import re
from html import escape
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=os.getenv('ALLOWED_ORIGIN', '*'))

# ── Config ──────────────────────────────────────────────────────
EMAIL_USER     = os.getenv('EMAIL_USER')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')
SMTP_SERVER    = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT      = int(os.getenv('SMTP_PORT', 587))
RECIPIENT      = os.getenv('RECIPIENT_EMAIL', 'rignitegroup@gmail.com')

# ── Brand colours ────────────────────────────────────────────────
BRAND = {
    'ink':          '#0A0A0A',
    'accent':       '#0D6B4F',
    'accent_light': '#E8F5F0',
    'accent_mid':   '#1A8A65',
    'surface':      '#F7F5F2',
    'muted':        '#6B6B6B',
    'rule':         '#E2E2E2',
}


# ── Email templates ──────────────────────────────────────────────

def detail_row(label, value):
    b = BRAND
    return f"""<tr>
      <td style="padding:8px 0;border-bottom:1px solid {b['rule']};width:120px;font-size:13px;font-weight:600;color:{b['muted']};vertical-align:top;">{label}</td>
      <td style="padding:8px 0 8px 16px;border-bottom:1px solid {b['rule']};font-size:14px;color:{b['ink']};">{value}</td>
    </tr>"""


def company_email_html(name, email, phone, org, subject, message):
    b = BRAND
    phone_val  = escape(phone)  if phone  else f'<span style="color:#ADADAD;">Not provided</span>'
    org_val    = escape(org)    if org    else f'<span style="color:#ADADAD;">Not provided</span>'

    rows = (
        detail_row('Name',         escape(name)) +
        detail_row('Email',        f'<a href="mailto:{escape(email)}" style="color:{b["accent"]};text-decoration:none;">{escape(email)}</a>') +
        detail_row('Phone',        phone_val) +
        detail_row('Organisation', org_val) +
        detail_row('Subject',      f'<strong>{escape(subject)}</strong>')
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:{b['surface']};font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:{b['surface']};padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid {b['rule']};">

        <tr><td style="background:{b['ink']};padding:28px 40px;">
          <div style="font-size:18px;font-weight:800;color:#ffffff;letter-spacing:-.5px;">
            R<span style="color:{b['accent_mid']};">·</span>IGNITE GROUP
          </div>
          <div style="font-size:12px;color:rgba(255,255,255,.4);margin-top:4px;letter-spacing:.05em;text-transform:uppercase;">
            New Contact Form Submission
          </div>
        </td></tr>

        <tr><td style="background:{b['accent_light']};padding:12px 40px;border-bottom:1px solid {b['rule']};">
          <span style="font-size:13px;font-weight:600;color:{b['accent']};">
            📩 New message from {escape(name)}
          </span>
        </td></tr>

        <tr><td style="padding:36px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            {rows}
          </table>

          <div style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:{b['muted']};margin-bottom:10px;">
            Message
          </div>
          <div style="background:{b['surface']};border:1px solid {b['rule']};border-radius:10px;padding:20px 24px;font-size:15px;line-height:1.75;color:{b['ink']};white-space:pre-wrap;">
            {escape(message)}
          </div>
        </td></tr>

        <tr><td style="padding:0 40px 32px;">
          <a href="mailto:{escape(email)}?subject=Re: {escape(subject)}"
             style="display:inline-block;padding:12px 28px;background:{b['accent']};color:#ffffff;text-decoration:none;border-radius:100px;font-size:14px;font-weight:700;">
            Reply to {escape(name)} →
          </a>
        </td></tr>

        <tr><td style="padding:20px 40px;border-top:1px solid {b['rule']};background:{b['surface']};">
          <p style="margin:0;font-size:12px;color:#ADADAD;line-height:1.6;">
            Submitted via rignitegroup.com contact form<br>
            © 2025 R-Ignite Group · Abuja, Nigeria
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>"""


def user_confirmation_html(name, subject, message):
    b = BRAND
    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:{b['surface']};font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:{b['surface']};padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid {b['rule']};">

        <tr><td style="background:{b['ink']};padding:28px 40px;">
          <div style="font-size:18px;font-weight:800;color:#ffffff;letter-spacing:-.5px;">
            R<span style="color:{b['accent_mid']};">·</span>IGNITE GROUP
          </div>
          <div style="font-size:12px;color:rgba(255,255,255,.4);margin-top:4px;letter-spacing:.05em;text-transform:uppercase;">
            Message Received
          </div>
        </td></tr>

        <tr><td style="background:{b['accent_light']};padding:20px 40px;border-bottom:1px solid rgba(13,107,79,.15);">
          <div style="font-size:20px;font-weight:800;color:{b['accent']};letter-spacing:-.5px;">
            ✓ Got it, {escape(name)}!
          </div>
          <div style="font-size:14px;color:{b['accent_mid']};margin-top:4px;">
            We'll be in touch within 24 hours.
          </div>
        </td></tr>

        <tr><td style="padding:36px 40px;">
          <p style="font-size:15px;line-height:1.75;color:{b['muted']};margin:0 0 24px;">
            Thank you for reaching out to R-Ignite Group. We've received your message and one of our team members will respond promptly.
          </p>

          <div style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:{b['muted']};margin-bottom:10px;">
            Your Message
          </div>
          <div style="background:{b['surface']};border:1px solid {b['rule']};border-radius:10px;padding:20px 24px;margin-bottom:28px;">
            <div style="font-size:13px;font-weight:700;color:{b['ink']};margin-bottom:8px;">
              Subject: {escape(subject)}
            </div>
            <div style="font-size:14px;line-height:1.7;color:{b['muted']};white-space:pre-wrap;">
              {escape(message)}
            </div>
          </div>

          <div style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:{b['muted']};margin-bottom:10px;">
            Need to reach us directly?
          </div>
          <table cellpadding="0" cellspacing="0">
            <tr><td style="padding:4px 0;font-size:14px;color:{b['muted']};">
              📧&nbsp;
              <a href="mailto:rignitegroup@gmail.com"
                 style="color:{b['accent']};text-decoration:none;font-weight:600;">rignitegroup@gmail.com</a>
            </td></tr>
            <tr><td style="padding:4px 0;font-size:14px;color:{b['muted']};">
              📞&nbsp;
              <a href="tel:+2347030579173"
                 style="color:{b['accent']};text-decoration:none;font-weight:600;">+234 703 057 9173</a>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:20px 40px;border-top:1px solid {b['rule']};background:{b['surface']};">
          <p style="margin:0;font-size:12px;color:#ADADAD;line-height:1.6;">
            R-Ignite Group · Abuja, Nigeria<br>
            Empower · Innovate · Excel
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>"""


# ── SMTP helper ──────────────────────────────────────────────────

def send_email(to: str, subject: str, html: str, reply_to: str = None) -> bool:
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From']    = f'"R-Ignite Group" <{EMAIL_USER}>'
        msg['To']      = to
        if reply_to:
            msg['Reply-To'] = reply_to

        msg.attach(MIMEText(html, 'html'))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_USER, to, msg.as_string())

        return True
    except Exception as e:
        print(f'[send_email] Error: {e}')
        return False


# ── Routes ───────────────────────────────────────────────────────

@app.route('/api/send-email', methods=['POST'])
def send_contact_email():
    try:
        data = request.get_json(force=True)

        # Required fields
        for field in ('name', 'email', 'subject', 'message'):
            if not data.get(field, '').strip():
                return jsonify({'success': False, 'message': f'Missing required field: {field}'}), 400

        name    = data['name'].strip()
        email   = data['email'].strip()
        phone   = data.get('phone', '').strip()
        org     = data.get('org',   '').strip()
        subject = data['subject'].strip()
        message = data['message'].strip()

        # Email format
        if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
            return jsonify({'success': False, 'message': 'Invalid email address.'}), 400

        # Send to R-Ignite team
        team_sent = send_email(
            to       = RECIPIENT,
            subject  = f'New enquiry: {subject}',
            html     = company_email_html(name, email, phone, org, subject, message),
            reply_to = email,
        )

        # Send confirmation to user
        user_sent = send_email(
            to      = email,
            subject = 'We received your message — R-Ignite Group',
            html    = user_confirmation_html(name, subject, message),
        )

        if team_sent and user_sent:
            return jsonify({'success': True, 'message': 'Message sent successfully.'}), 200
        else:
            return jsonify({'success': False, 'message': 'Failed to deliver email. Please try again.'}), 500

    except Exception as e:
        print(f'[send_contact_email] Error: {e}')
        return jsonify({'success': False, 'message': 'Server error. Please try again later.'}), 500


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'R-Ignite Email API'})


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    print(f'🚀  R-Ignite email server running on http://localhost:{port}')
    app.run(debug=os.getenv('FLASK_DEBUG', 'false').lower() == 'true', port=port)
