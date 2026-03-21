const { Resend } = require('resend');

const APP_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ─── Resend client (lazy — only created if API key is present) ────────────────
let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

/**
 * Returns true if email sending is configured and ready.
 */
exports.emailEnabled = () => !!resend;

const FROM = process.env.EMAIL_FROM || 'PlacementOS <onboarding@resend.dev>';

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
  if (!resend) throw new Error('RESEND_API_KEY not configured');
  const { error } = await resend.emails.send({ from: FROM, to, subject, html });
  if (error) throw new Error(`Resend error: ${error.message}`);
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
