const https = require('https');

// ─── Brevo REST API (uses HTTPS port 443 — never blocked by cloud hosts) ─────
// SMTP (port 587/465) is often blocked on free tier hosts like Render.
// REST API is the reliable alternative.
//
// Set in Render env vars:
//   BREVO_API_KEY = your Brevo v3 API key (Settings → API Keys → Create)
//   CLIENT_URL    = https://your-app.vercel.app

const APP_URL = process.env.CLIENT_URL || 'http://localhost:5173';
// Your Brevo account email — must match what you signed up with on brevo.com
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'placementos@gmail.com';

/** Returns true if Brevo API is configured */
exports.emailEnabled = () => !!process.env.BREVO_API_KEY;

// ─── HTTP helper (no external deps — uses Node built-in https) ───────────────
const postToBrevo = (payload) =>
  new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = https.request(
      {
        hostname: 'api.brevo.com',
        path: '/v3/smtp/email',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode >= 400) {
            reject(new Error(`Brevo API error ${res.statusCode}: ${data}`));
          } else {
            resolve(JSON.parse(data || '{}'));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });

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

// ─── Verification email ───────────────────────────────────────────────────────
exports.sendVerificationEmail = async (to, name, token) => {
  const link = `${APP_URL}/verify-email/${token}`;
  await postToBrevo({
    sender: { name: 'PlacementOS', email: SENDER_EMAIL },
    to: [{ email: to, name }],
    subject: '✉️ Verify your PlacementOS email',
    htmlContent: baseTemplate(`
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
  await postToBrevo({
    sender: { name: 'PlacementOS', email: SENDER_EMAIL },
    to: [{ email: to, name }],
    subject: '🔑 Reset your PlacementOS password',
    htmlContent: baseTemplate(`
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

// ─── Daily Tasks email ────────────────────────────────────────────────────────
exports.sendDailyTasksEmail = async (to, name, dayName, tasksConfig) => {
  const taskHtml = tasksConfig.map(t => `
    <div style="background:#22222d;border-radius:8px;padding:16px;margin-bottom:12px;border-left:4px solid #00e87a;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span style="font-size:10px;font-weight:700;color:#000;background:#00e87a;padding:2px 8px;border-radius:4px;text-transform:uppercase;">${t.tag}</span>
        <span style="font-size:12px;color:#aaa;">${t.time}</span>
      </div>
      <div style="font-size:16px;font-weight:700;color:#fff;margin-bottom:4px;">${t.name}</div>
      <div style="font-size:13px;color:#bbb;">${t.detail}</div>
      ${t.lc ? `<div style="font-size:12px;color:#00e87a;margin-top:8px;font-weight:600;">🔗 ${t.lc}</div>` : ''}
    </div>
  `).join('');

  await postToBrevo({
    sender: { name: 'PlacementOS', email: SENDER_EMAIL },
    to: [{ email: to, name }],
    subject: `🎯 Your Daily Tasks: ${dayName}`,
    htmlContent: baseTemplate(`
      <div style="font-size:24px;font-weight:800;color:#fff;margin-bottom:10px;">${dayName} Mission 🚀</div>
      <div style="font-size:15px;color:#999;line-height:1.6;margin-bottom:24px;">
        Hi <strong style="color:#fff;">${name}</strong>, here are your placement prep tasks for today. Stay consistent!
      </div>
      ${taskHtml}
      <div style="text-align:center;margin-top:24px;">
        <a href="${APP_URL}/dashboard" style="${btnStyle}">→ GO TO DASHBOARD</a>
      </div>
    `),
  });
};
