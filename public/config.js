// v=20261018d
// Fusora runtime config (edit on server without rebuilding)
// Google Cloud Console → APIs & Services → Credentials → Create OAuth Client ID (Web)
// Authorized JavaScript origins:
//   https://fusora.shop
//   https://www.fusora.shop
//   http://127.0.0.1:5181
//   http://localhost:5181
window.__FUSORA__ = window.__FUSORA__ || {
  googleClientId:
    '955699114876-o19var7ktsmjobvqhkqgr579uaiun828.apps.googleusercontent.com',
  // EmailJS — email OTP login (browser uses public key only)
  emailjs: {
    serviceId: 'service_zzdygr4',
    templateId: 'template_2lgjx1a',
    publicKey: '9z1t6eVNbk2GSc2KS',
  },
  // Admin panel — https://fusora.shop/admin
  // Password is verified server-side via /api/admin/login.php (never stored here).
}
