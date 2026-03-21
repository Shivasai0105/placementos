const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM || 'PlacementOS <onboarding@resend.dev>';
const APP_URL = process.env.CLIENT_URL || 'http://localhost:5173';

/**
 * Send an email. Throws on failure.
 * @param {object} opts - { to, subject, html }
 */
const sendEmail = async ({ to, subject, html }) => {
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject,
    html,
  });
  if (error) throw new Error(`Email error: ${error.message}`);
};

// ─── Email Templates ──────────────────────────────────────────────────────────

const btnStyle = `
  display:inline-block;
  background:#00e87a;
  color:#000;
  font-weight:700;
  font-family:monospace;
  padding:12px 28px;
  border-radius:8px;
  text-decoration:none;
  font-size:14px;
  margin:20px 0;
`;

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f0f14;font-family:'Helvetica Neue',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="560" style="background:#1a1a24;border-radius:16px;padding:40px;border:1px solid #2a2a3a;">
        <tr><td>
          <div style="font-size:22px;font-weight:900;color:#00e87a;margin-bottom:8px;letter-spacing:-0.5px;">PlacementOS</div>
          <div style="font-size:11px;color:#666;margin-bottom:32px;font-family:monospace;letter-spacing:2px;">10 LPA BATTLE PLAN</div>
          ${content}
          <hr style="border:none;border-top:1px solid #2a2a3a;margin:32px 0;">
          <div style="font-size:12px;color:#555;">This email was sent by PlacementOS. If you didn't request this, you can safely ignore it.</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

exports.sendVerificationEmail = async (to, name, token) => {
  const link = `${APP_URL}/verify-email/${token}`;
  await sendEmail({
    to,
    subject: 'Verify your PlacementOS email',
    html: baseTemplate(`
      <div style="font-size:24px;font-weight:800;color:#fff;margin-bottom:8px;">Verify your email ✉️</div>
      <div style="font-size:15px;color:#aaa;margin-bottom:20px;">Hi ${name}, thanks for joining PlacementOS! Click the button below to verify your email and activate your account.</div>
      <a href="${link}" style="${btnStyle}">→ VERIFY EMAIL</a>
      <div style="font-size:12px;color:#555;margin-top:8px;">This link expires in 24 hours.</div>
      <div style="font-size:12px;color:#555;margin-top:16px;">Or copy this link:<br><span style="color:#00e87a;word-break:break-all;">${link}</span></div>
    `),
  });
};

exports.sendPasswordResetEmail = async (to, name, token) => {
  const link = `${APP_URL}/reset-password/${token}`;
  await sendEmail({
    to,
    subject: 'Reset your PlacementOS password',
    html: baseTemplate(`
      <div style="font-size:24px;font-weight:800;color:#fff;margin-bottom:8px;">Reset your password 🔑</div>
      <div style="font-size:15px;color:#aaa;margin-bottom:20px;">Hi ${name}, we received a request to reset your password. Click below to set a new one.</div>
      <a href="${link}" style="${btnStyle}">→ RESET PASSWORD</a>
      <div style="font-size:12px;color:#555;margin-top:8px;">This link expires in 1 hour. If you didn't request this, ignore this email.</div>
    `),
  });
};
