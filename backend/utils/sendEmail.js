const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'Adblogger.uz <amaljonmordayev@gmail.com>',
    to,
    subject,
    html,
    text,
  });
};

// ─── Email HTML Templates ────────────────────────────────────────────────────

const baseWrapper = (content) => `
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Adblogger.uz</title>
</head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#C62828,#E53935);padding:28px 32px;text-align:center;">
              <div style="display:inline-flex;align-items:center;gap:8px;">
                <div style="width:36px;height:36px;background:rgba(255,255,255,0.2);border-radius:10px;display:inline-flex;align-items:center;justify-content:center;">
                  <span style="color:#fff;font-size:18px;font-weight:900;">A</span>
                </div>
                <span style="color:#fff;font-size:22px;font-weight:900;letter-spacing:-0.5px;">AdBlogger<span style="opacity:0.7">.uz</span></span>
              </div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 36px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px 28px;text-align:center;border-top:1px solid #f3f4f6;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                Bu xabar <a href="https://adblogger.uz" style="color:#dc2626;text-decoration:none;">Adblogger.uz</a> tomonidan yuborildi.<br/>
                Agar siz bu so'rovni bermagan bo'lsangiz, ushbu emailni e'tiborsiz qoldiring.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * Registration OTP email template
 */
const registrationOtpTemplate = (firstName, otp) => baseWrapper(`
  <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827;">Emailingizni tasdiqlang</h2>
  <p style="margin:0 0 24px;font-size:15px;color:#4b5563;">
    Salom, <strong>${firstName}</strong>! Adblogger.uz platformasiga ro'yxatdan o'tish uchun quyidagi tasdiqlash kodini kiriting.
  </p>
  <div style="background:#fef2f2;border:2px solid #fecaca;border-radius:14px;padding:28px;text-align:center;margin-bottom:24px;">
    <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#991b1b;text-transform:uppercase;letter-spacing:1px;">Tasdiqlash kodi</p>
    <div style="font-size:40px;font-weight:900;letter-spacing:10px;color:#dc2626;font-family:'Courier New',monospace;background:#fff;border-radius:10px;padding:14px 20px;display:inline-block;border:1.5px solid #fecaca;">
      ${otp}
    </div>
    <p style="margin:14px 0 0;font-size:12px;color:#ef4444;">Kod 10 daqiqa amal qiladi</p>
  </div>
  <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px 16px;margin-bottom:8px;">
    <p style="margin:0;font-size:13px;color:#92400e;">
      <strong>Muhim:</strong> Ushbu kodni hech kimga bermang. Adblogger xodimlari hech qachon bu kodni so'rashadi.
    </p>
  </div>
`);

/**
 * Login OTP email template
 */
const loginOtpTemplate = (firstName, otp) => baseWrapper(`
  <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827;">Tizimga kirish kodi</h2>
  <p style="margin:0 0 24px;font-size:15px;color:#4b5563;">
    Salom, <strong>${firstName}</strong>! Adblogger.uz ga kirish uchun bir martalik kod:
  </p>
  <div style="background:#fef2f2;border:2px solid #fecaca;border-radius:14px;padding:28px;text-align:center;margin-bottom:24px;">
    <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#991b1b;text-transform:uppercase;letter-spacing:1px;">Kirish kodi</p>
    <div style="font-size:40px;font-weight:900;letter-spacing:10px;color:#dc2626;font-family:'Courier New',monospace;background:#fff;border-radius:10px;padding:14px 20px;display:inline-block;border:1.5px solid #fecaca;">
      ${otp}
    </div>
    <p style="margin:14px 0 0;font-size:12px;color:#ef4444;">Kod 10 daqiqa amal qiladi</p>
  </div>
  <p style="margin:0;font-size:13px;color:#6b7280;">
    Agar siz kirmagan bo'lsangiz, bu emailni e'tiborsiz qoldiring va akkauntingiz xavfsiz bo'lib qoladi.
  </p>
`);

/**
 * Application approved email template
 */
const applicationApprovedTemplate = (firstName) => baseWrapper(`
  <div style="text-align:center;margin-bottom:24px;">
    <div style="width:64px;height:64px;background:#dcfce7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827;">Arizangiz tasdiqlandi! 🎉</h2>
  </div>
  <p style="margin:0 0 20px;font-size:15px;color:#4b5563;text-align:center;">
    Salom, <strong>${firstName}</strong>! Sizning Adblogger.uz platformasiga ro'yxatdan o'tish arizangiz <strong style="color:#16a34a;">tasdiqlandi</strong>.
  </p>
  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:18px 20px;margin-bottom:24px;">
    <p style="margin:0;font-size:14px;color:#166534;">
      Endi siz platformadan to'liq foydalanishingiz mumkin. Profilingizni to'ldiring va boshqa foydalanuvchilar bilan hamkorlik qiling.
    </p>
  </div>
  <div style="text-align:center;">
    <a href="https://adblogger.uz/kirish" style="display:inline-block;background:linear-gradient(135deg,#C62828,#E53935);color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:15px;">
      Platformaga kirish →
    </a>
  </div>
`);

/**
 * Application rejected email template
 */
const applicationRejectedTemplate = (firstName, reason) => baseWrapper(`
  <div style="text-align:center;margin-bottom:24px;">
    <div style="width:64px;height:64px;background:#fee2e2;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827;">Ariza rad etildi</h2>
  </div>
  <p style="margin:0 0 20px;font-size:15px;color:#4b5563;text-align:center;">
    Salom, <strong>${firstName}</strong>. Afsuski, sizning arizangiz <strong style="color:#dc2626;">rad etildi</strong>.
  </p>
  ${reason ? `
  <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px 18px;margin-bottom:20px;">
    <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#ef4444;text-transform:uppercase;letter-spacing:0.5px;">Sabab:</p>
    <p style="margin:0;font-size:14px;color:#7f1d1d;">${reason}</p>
  </div>
  ` : ''}
  <p style="margin:0 0 20px;font-size:14px;color:#6b7280;text-align:center;">
    Murojaat uchun biz bilan bog'laning yoki boshqa email bilan qayta ro'yxatdan o'ting.
  </p>
  <div style="text-align:center;">
    <a href="https://adblogger.uz/kirish" style="display:inline-block;background:#6b7280;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:700;font-size:14px;">
      Bosh sahifaga qaytish
    </a>
  </div>
`);

/**
 * Profile approved email template (account fully activated)
 */
const profileApprovedTemplate = (firstName) => baseWrapper(`
  <div style="text-align:center;margin-bottom:24px;">
    <div style="width:72px;height:72px;background:linear-gradient(135deg,#dcfce7,#bbf7d0);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
      <span style="font-size:36px;">🎉</span>
    </div>
    <h2 style="margin:0 0 8px;font-size:24px;font-weight:900;color:#111827;">Akkauntingiz faollashdi!</h2>
  </div>
  <p style="margin:0 0 20px;font-size:15px;color:#4b5563;text-align:center;">
    Tabriklaymiz, <strong>${firstName}</strong>! Profilingiz ko'rib chiqildi va <strong style="color:#16a34a;">tasdiqlandi</strong>. Siz endi platformadan to'liq foydalanishingiz mumkin!
  </p>
  <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:14px;padding:20px;margin-bottom:24px;">
    <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;">
      <span style="color:#22c55e;font-size:16px;margin-top:2px;">✓</span>
      <div>
        <p style="margin:0;font-size:14px;font-weight:700;color:#166534;">Profil tasdiqlandi</p>
        <p style="margin:4px 0 0;font-size:13px;color:#4ade80;">Profilingiz to'liq va faol holda</p>
      </div>
    </div>
    <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;">
      <span style="color:#22c55e;font-size:16px;margin-top:2px;">✓</span>
      <div>
        <p style="margin:0;font-size:14px;font-weight:700;color:#166534;">Platforma imkoniyatlari ochiq</p>
        <p style="margin:4px 0 0;font-size:13px;color:#4ade80;">E'lonlar, hamkorliklar va ko'proq</p>
      </div>
    </div>
  </div>
  <div style="text-align:center;">
    <a href="https://adblogger.uz" style="display:inline-block;background:linear-gradient(135deg,#C62828,#E53935);color:#fff;text-decoration:none;padding:15px 36px;border-radius:12px;font-weight:800;font-size:16px;box-shadow:0 4px 14px rgba(198,40,40,0.35);">
      Platformaga kirish →
    </a>
  </div>
`);

/**
 * Profile rejected email template
 */
const profileRejectedTemplate = (firstName, reason) => baseWrapper(`
  <div style="text-align:center;margin-bottom:24px;">
    <div style="width:64px;height:64px;background:#fee2e2;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827;">Profilingiz rad etildi</h2>
  </div>
  <p style="margin:0 0 20px;font-size:15px;color:#4b5563;text-align:center;">
    Salom, <strong>${firstName}</strong>. Afsuski, profilingiz ko'rib chiqildi va <strong style="color:#dc2626;">rad etildi</strong>.
  </p>
  ${reason ? `
  <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px 18px;margin-bottom:20px;">
    <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#ef4444;text-transform:uppercase;letter-spacing:0.5px;">Sabab:</p>
    <p style="margin:0;font-size:14px;color:#7f1d1d;">${reason}</p>
  </div>
  ` : ''}
  <p style="margin:0 0 20px;font-size:14px;color:#6b7280;text-align:center;">
    Ma'lumotlaringizni to'g'rilab, profilingizni qayta yuborishingiz mumkin.
  </p>
  <div style="text-align:center;">
    <a href="https://adblogger.uz/profil-toldirish" style="display:inline-block;background:linear-gradient(135deg,#C62828,#E53935);color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:700;font-size:14px;">
      Profilni qayta to'ldirish
    </a>
  </div>
`);

module.exports = sendEmail;
module.exports.registrationOtpTemplate = registrationOtpTemplate;
module.exports.loginOtpTemplate = loginOtpTemplate;
module.exports.applicationApprovedTemplate = applicationApprovedTemplate;
module.exports.applicationRejectedTemplate = applicationRejectedTemplate;
module.exports.profileApprovedTemplate = profileApprovedTemplate;
module.exports.profileRejectedTemplate = profileRejectedTemplate;
