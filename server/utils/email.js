const nodemailer = require('nodemailer');

// ─── Brevo SMTP Transporter ───────────────────────────────────────────────────
// Sign up free at brevo.com → Settings → SMTP & API → SMTP tab → copy key
// Set these in Render env vars:
//   BREVO_SMTP_USER = your Brevo account email (e.g. you@gmail.com)
//   BREVO_SMTP_KEY  = your Brevo SMTP key (starts with xsmtp...)
//   CLIENT_URL      = https://your-vercel-app.vercel.app

let transporter = null;
if (process.env.BREVO_SMTP_KEY && process.env.BREVO_SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_KEY,
    },
  });
}

const FROM = `PlacementOS <${process.env.BREVO_SMTP_USER || 'noreply@placementos.com'}>`;
const APP_URL = process.env.CLIENT_URL || 'http://localhost:5173';

/** Returns true if email sending is configured */
exports.emailEnabled = () => !!transporter;

// ─── Base HTML template ───────────────────────────────────────────────────────
const btnStyle = [
  'display:inline-block',
  'background:#00e87a',
  'color:#000',
  'font-weight:700',
  'font-family:monospace',
  'padding:12px 28px',
  'border-radius:8px',
  'text-decoration:none',
  'font-size:14px',
  'margin:20px 0',
].join(';');

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f0f14;font-family:'Helvetica Neue',Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="560" style="max-width:100%;background:#1a1a24;border-radius:16px;padding:40px 36px;border:1px solid #2a2a3a;">
        <tr><td>
          <div style="font-size:22px;font-weight:900;color:#00e87a;margin-bottom:4px;letter-spacing:-0.5px;">PlacementOS</div>
          <div style="font-size:10px;color:#555;margin-bottom:32px;font-family:monospace;letter-spacing:2px;">10 LPA BATTLE PLAN</div>
          ${content}
          <hr style="border:none;border-top:1px solid #2a2a3a;margin:32px 0 20px;">
          <div style="font-size:11px;color:#444;line-height:1.6;">
            If you didn't request this, you can safely ignore this email.<br>
            © ${new Date().getFullYear()} PlacementOS
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

// ─── Send helper ──────────────────────────────────────────────────────────────
const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) throw new Error('Email not configured (BREVO_SMTP_KEY missing)');
  await transporter.sendMail({ from: FROM, to, subject, html });
};

// ─── Verification email ───────────────────────────────────────────────────────
exports.sendVerificationEmail = async (to, name, token) => {
  const link = `${APP_URL}/verify-email/${token}`;
  await sendEmail({
    to,
    subject: '✉️ Verify your PlacementOS email',
    html: baseTemplate(`
      <div style="font-size:24px;font-weight:800;color:#fff;margin-bottom:10px;">Verify your email ✉️</div>
      <div style="font-size:15px;color:#999;line-height:1.6;margin-bottom:4px;">
        Hi <strong style="color:#fff;">${name}</strong>, welcome to PlacementOS!<br>
        Click the button below to verify your email and start your placement prep.
      </div>
      <div><a href="${link}" style="${btnStyle}">→ VERIFY MY EMAIL</a></div>
      <div style="font-size:12px;color:#555;margin-top:4px;">This link expires in 24 hours.</div>
      <div style="font-size:12px;color:#444;margin-top:16px;word-break:break-all;">
        Link not working? Copy this URL:<br>
        <span style="color:#00e87a;">${link}</span>
      </div>
    `),
  });
};

// ─── Password reset email ─────────────────────────────────────────────────────
exports.sendPasswordResetEmail = async (to, name, token) => {
  const link = `${APP_URL}/reset-password/${token}`;
  await sendEmail({
    to,
    subject: '🔑 Reset your PlacementOS password',
    html: baseTemplate(`
      <div style="font-size:24px;font-weight:800;color:#fff;margin-bottom:10px;">Reset your password 🔑</div>
      <div style="font-size:15px;color:#999;line-height:1.6;margin-bottom:4px;">
        Hi <strong style="color:#fff;">${name}</strong>,<br>
        We received a request to reset your password. Click below to choose a new one.
      </div>
      <div><a href="${link}" style="${btnStyle}">→ RESET PASSWORD</a></div>
      <div style="font-size:12px;color:#555;margin-top:4px;">This link expires in 1 hour.</div>
    `),
  });
};
