import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from '../components/ui/toast';
import api from '../services/api';

// ─── Role config ──────────────────────────────────────────────────────────────
const ROLES = [
  {
    key: 'blogger',
    title: 'Blogger',
    desc: "Kontent yaratuvchi va ta'sirli shaxs",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 24, height: 24 }}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
    activeBg: '#EDE9FE',
    activeBorder: '#7C3AED',
  },
  {
    key: 'business',
    title: 'Biznes',
    desc: 'Reklama beruvchi yoki kompaniya',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 24, height: 24 }}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: '#D32F2F',
    bg: '#FFF5F5',
    border: '#FECACA',
    activeBg: '#FEE2E2',
    activeBorder: '#D32F2F',
  },
];

const inputCls = (hasError) => ({
  width: '100%',
  padding: '12px 16px',
  border: `1.5px solid ${hasError ? '#f87171' : '#e5e7eb'}`,
  borderRadius: 12,
  fontSize: 14,
  fontFamily: 'inherit',
  outline: 'none',
  background: hasError ? '#fef2f2' : '#f9fafb',
  color: '#111827',
  transition: 'border-color .2s, background .2s',
  boxSizing: 'border-box',
});

function Field({ label, error, required, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 6 }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {children}
      {error && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#ef4444', fontWeight: 600 }}>{error}</p>}
    </div>
  );
}

function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '12px 14px', borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', marginBottom: 16 }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0 }}>
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <p style={{ margin: 0, fontSize: 13, color: '#b91c1c', fontWeight: 600 }}>{message}</p>
    </div>
  );
}

// ─── OTP Input ────────────────────────────────────────────────────────────────
function OtpInput({ value, onChange, disabled }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={6}
      value={value}
      onChange={e => {
        const v = e.target.value.replace(/\D/g, '').slice(0, 6);
        onChange(v);
      }}
      disabled={disabled}
      placeholder="000000"
      style={{
        width: '100%',
        padding: '16px',
        border: '2px solid #fecaca',
        borderRadius: 14,
        fontSize: 32,
        fontWeight: 900,
        letterSpacing: 12,
        textAlign: 'center',
        fontFamily: "'Courier New', monospace",
        color: '#dc2626',
        background: '#fef2f2',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color .2s',
        caretColor: '#dc2626',
      }}
      onFocus={e => { e.target.style.borderColor = '#dc2626'; }}
      onBlur={e => { e.target.style.borderColor = '#fecaca'; }}
    />
  );
}

// ─── Countdown Timer ─────────────────────────────────────────────────────────
function useCountdown(initialSeconds) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!active) return;
    if (seconds <= 0) { setActive(false); return; }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, active]);

  const reset = () => { setSeconds(initialSeconds); setActive(true); };

  return { seconds, canResend: !active || seconds <= 0, reset };
}

// ─── Login Flow ───────────────────────────────────────────────────────────────
function LoginFlow() {
  const navigate = useNavigate();
  const { loginWithOtp } = useAuthStore();
  const [loginStep, setLoginStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { seconds, canResend, reset: resetTimer } = useCountdown(60);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Email kiritilishi shart.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError("Email formati noto'g'ri."); return; }
    setLoading(true);
    try {
      await api.post('/auth/send-login-otp', { email: email.trim() });
      setLoginStep(2);
      resetTimer();
    } catch (err) {
      setError(err?.response?.data?.message || 'Xatolik yuz berdi. Qayta urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp || otp.length < 6) { setError('6 raqamli kodni kiriting.'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-login-otp', { email: email.trim(), otp });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      useAuthStore.getState().setToken(token);
      useAuthStore.getState().setUser(user);
      toast.success(`Xush kelibsiz, ${user.firstName}!`);
      navigate(user?.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err?.response?.data?.message || "Kod noto'g'ri yoki muddati tugagan.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/send-login-otp', { email: email.trim() });
      setOtp('');
      resetTimer();
      toast.success('Yangi kod yuborildi!');
    } catch (err) {
      setError(err?.response?.data?.message || 'Xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1 — Enter email
  if (loginStep === 1) {
    return (
      <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 0 }} noValidate>
        <ErrorBox message={error} />
        <Field label="Email manzil" required>
          <input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputCls(false)}
            autoFocus
          />
        </Field>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '13px', borderRadius: 12, border: 'none',
            background: loading ? '#9ca3af' : 'linear-gradient(135deg,#C62828,#E53935)',
            color: '#fff', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', transition: 'background .2s', marginTop: 8,
            boxShadow: loading ? 'none' : '0 4px 14px rgba(198,40,40,0.3)',
          }}
        >
          {loading ? 'Yuborilmoqda...' : 'OTP Yuborish'}
        </button>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <a href="/" style={{ color: '#dc2626', fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>
            ← Bosh sahifaga qaytish
          </a>
        </div>
      </form>
    );
  }

  // Step 2 — Enter OTP
  return (
    <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 0 }} noValidate>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ width: 52, height: 52, background: '#fef2f2', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" style={{ width: 26, height: 26 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
          Kirish kodi <strong style={{ color: '#111827' }}>{email}</strong> manziliga yuborildi
        </p>
      </div>

      <ErrorBox message={error} />

      <Field label="6-raqamli kod">
        <OtpInput value={otp} onChange={setOtp} disabled={loading} />
      </Field>

      <button
        type="submit"
        disabled={loading || otp.length < 6}
        style={{
          width: '100%', padding: '13px', borderRadius: 12, border: 'none',
          background: (loading || otp.length < 6) ? '#e5e7eb' : 'linear-gradient(135deg,#C62828,#E53935)',
          color: (loading || otp.length < 6) ? '#9ca3af' : '#fff',
          fontWeight: 700, fontSize: 15, cursor: (loading || otp.length < 6) ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit', transition: 'all .2s', marginBottom: 12,
          boxShadow: (loading || otp.length < 6) ? 'none' : '0 4px 14px rgba(198,40,40,0.3)',
        }}
      >
        {loading ? 'Tekshirilmoqda...' : 'Tasdiqlash'}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={() => { setLoginStep(1); setOtp(''); setError(''); }}
          style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
        >
          ← Email o'zgartirish
        </button>
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
          >
            Qayta yuborish
          </button>
        ) : (
          <span style={{ fontSize: 12, color: '#9ca3af' }}>
            Qayta yuborish: <strong style={{ color: '#374151' }}>{seconds}s</strong>
          </span>
        )}
      </div>
    </form>
  );
}

// ─── Register Flow ────────────────────────────────────────────────────────────
function RegisterFlow() {
  const navigate = useNavigate();
  const { setPendingFromOtp } = useAuthStore();
  const pageLoadTime = useRef(Date.now());

  const [registerStep, setRegisterStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [pendingEmail, setPendingEmail] = useState('');

  // Step 1 form state
  const [role, setRole] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [phone, setPhone]         = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [notBotChecked, setNotBotChecked] = useState(false);
  const [honeypot, setHoneypot]   = useState(''); // should stay empty
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [rootError, setRootError] = useState('');

  // Step 2 OTP state
  const [otp, setOtp]             = useState('');
  const [otpError, setOtpError]   = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const { seconds, canResend, reset: resetTimer } = useCountdown(60);

  const validateStep1 = () => {
    const errs = {};
    if (!role) errs.role = 'Rolni tanlash majburiy';
    if (!firstName.trim()) errs.firstName = 'Ism kiritilishi shart';
    if (!email.trim()) errs.email = 'Email kiritilishi shart';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = "Email formati noto'g'ri";
    if (!termsAccepted) errs.terms = 'Shartlarga rozilik bildiring';
    if (!notBotChecked) errs.notBot = 'Ushbu maydonni belgilang';
    return errs;
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setRootError('');
    const errs = validateStep1();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await api.post('/auth/send-registration-otp', {
        role,
        firstName: firstName.trim(),
        lastName:  lastName.trim(),
        email:     email.trim(),
        phone:     phone.trim(),
        _hp:       honeypot,
        _time:     pageLoadTime.current,
      });
      setUserId(res.data.userId);
      setPendingEmail(email.trim());
      setRegisterStep(2);
      resetTimer();
    } catch (err) {
      setRootError(err?.response?.data?.message || "Xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError('');
    if (!otp || otp.length < 6) { setOtpError('6 raqamli kodni to\'liq kiriting.'); return; }
    setVerifyLoading(true);
    try {
      const res = await api.post('/auth/verify-registration-otp', { userId, otp });
      // Store pending userId in auth store
      setPendingFromOtp({ userId: res.data.userId, email: pendingEmail });
      navigate('/tasdiqlash-kutilmoqda');
    } catch (err) {
      setOtpError(err?.response?.data?.message || "Kod noto'g'ri yoki muddati tugagan.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setOtpError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/send-registration-otp', {
        role,
        firstName: firstName.trim(),
        lastName:  lastName.trim(),
        email:     pendingEmail,
        phone:     phone.trim(),
        _hp:       '',
        _time:     Date.now() - 5000, // bypass timing check on resend
      });
      if (res.data.userId) setUserId(res.data.userId);
      setOtp('');
      resetTimer();
      toast.success('Yangi kod yuborildi!');
    } catch (err) {
      setOtpError(err?.response?.data?.message || 'Xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 1 ──
  if (registerStep === 1) {
    return (
      <form onSubmit={handleStep1Submit} style={{ display: 'flex', flexDirection: 'column' }} noValidate>
        {/* Honeypot — completely hidden */}
        <input
          type="text"
          name="_hp"
          value={honeypot}
          onChange={e => setHoneypot(e.target.value)}
          style={{ display: 'none', position: 'absolute', left: '-9999px' }}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        {/* Role selection */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 8 }}>
            Siz kimsingiz? <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {ROLES.map(r => {
              const active = role === r.key;
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => { setRole(r.key); setErrors(prev => ({ ...prev, role: '' })); }}
                  style={{
                    position: 'relative',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    padding: '14px 10px', borderRadius: 12,
                    border: `2px solid ${active ? r.activeBorder : r.border}`,
                    background: active ? r.activeBg : r.bg,
                    boxShadow: active ? `0 0 0 3px ${r.activeBorder}33` : 'none',
                    cursor: 'pointer', transition: 'all .15s', textAlign: 'center',
                    fontFamily: 'inherit',
                  }}
                >
                  {active && (
                    <span style={{
                      position: 'absolute', top: 8, right: 8,
                      width: 16, height: 16, borderRadius: '50%',
                      background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" style={{ width: 10, height: 10 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                  <span style={{ color: active ? r.color : '#94a3b8' }}>{r.icon}</span>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: active ? r.color : '#374151' }}>{r.title}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 10, color: '#9ca3af', lineHeight: 1.3 }}>{r.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.role && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#ef4444', fontWeight: 600 }}>{errors.role}</p>}
        </div>

        {/* Name */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 4 }}>
          <Field label="Ism" required error={errors.firstName}>
            <input
              type="text"
              placeholder="Ismingiz"
              value={firstName}
              onChange={e => { setFirstName(e.target.value); setErrors(p => ({ ...p, firstName: '' })); }}
              style={inputCls(!!errors.firstName)}
            />
          </Field>
          <Field label="Familiya">
            <input
              type="text"
              placeholder="Familiyangiz"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              style={inputCls(false)}
            />
          </Field>
        </div>

        <Field label="Email" required error={errors.email}>
          <input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
            style={inputCls(!!errors.email)}
          />
        </Field>

        <Field label="Telefon">
          <input
            type="tel"
            placeholder="+998 90 000 00 00"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={inputCls(false)}
          />
        </Field>

        {/* Terms */}
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
            <div
              onClick={() => { setTermsAccepted(v => !v); setErrors(p => ({ ...p, terms: '' })); }}
              style={{
                width: 18, height: 18, borderRadius: 5, border: `2px solid ${termsAccepted ? '#dc2626' : '#d1d5db'}`,
                background: termsAccepted ? '#dc2626' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 1, cursor: 'pointer', transition: 'all .15s',
              }}
            >
              {termsAccepted && (
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" style={{ width: 11, height: 11 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>
              <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626', fontWeight: 700, textDecoration: 'none' }}>Foydalanish shartlari</a>
              {' '}bilan tanishdim va roziman
            </span>
          </label>
          {errors.terms && <p style={{ margin: '4px 0 0 28px', fontSize: 11, color: '#ef4444', fontWeight: 600 }}>{errors.terms}</p>}
        </div>

        {/* Not a bot checkbox */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <div
              onClick={() => { setNotBotChecked(v => !v); setErrors(p => ({ ...p, notBot: '' })); }}
              style={{
                width: 18, height: 18, borderRadius: 5, border: `2px solid ${notBotChecked ? '#16a34a' : '#d1d5db'}`,
                background: notBotChecked ? '#16a34a' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, cursor: 'pointer', transition: 'all .15s',
              }}
            >
              {notBotChecked && (
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" style={{ width: 11, height: 11 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>Men bot emasman ✓</span>
          </label>
          {errors.notBot && <p style={{ margin: '4px 0 0 28px', fontSize: 11, color: '#ef4444', fontWeight: 600 }}>{errors.notBot}</p>}
        </div>

        {rootError && <ErrorBox message={rootError} />}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '13px', borderRadius: 12, border: 'none',
            background: loading ? '#9ca3af' : 'linear-gradient(135deg,#C62828,#E53935)',
            color: '#fff', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', transition: 'background .2s',
            boxShadow: loading ? 'none' : '0 4px 14px rgba(198,40,40,0.3)',
          }}
        >
          {loading ? 'Yuborilmoqda...' : 'Tasdiqlash kodini olish →'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <a href="/" style={{ color: '#dc2626', fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>
            ← Bosh sahifaga qaytish
          </a>
        </div>
      </form>
    );
  }

  // ── Step 2: OTP verification ──
  return (
    <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column' }} noValidate>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ width: 60, height: 60, background: '#fef2f2', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.8" style={{ width: 30, height: 30 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: '#111827' }}>Emailingizni tasdiqlang</h3>
        <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
          6-raqamli kod <strong style={{ color: '#111827' }}>{pendingEmail}</strong> manziliga yuborildi
        </p>
      </div>

      {otpError && <ErrorBox message={otpError} />}

      <Field label="Tasdiqlash kodi">
        <OtpInput value={otp} onChange={setOtp} disabled={verifyLoading} />
        <p style={{ margin: '6px 0 0', fontSize: 11, color: '#9ca3af', textAlign: 'center' }}>Kod 10 daqiqa amal qiladi</p>
      </Field>

      <button
        type="submit"
        disabled={verifyLoading || otp.length < 6}
        style={{
          width: '100%', padding: '13px', borderRadius: 12, border: 'none',
          background: (verifyLoading || otp.length < 6) ? '#e5e7eb' : 'linear-gradient(135deg,#C62828,#E53935)',
          color: (verifyLoading || otp.length < 6) ? '#9ca3af' : '#fff',
          fontWeight: 700, fontSize: 15, cursor: (verifyLoading || otp.length < 6) ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit', transition: 'all .2s', marginBottom: 12,
          boxShadow: (verifyLoading || otp.length < 6) ? 'none' : '0 4px 14px rgba(198,40,40,0.3)',
        }}
      >
        {verifyLoading ? 'Tekshirilmoqda...' : 'Tasdiqlash →'}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={() => { setRegisterStep(1); setOtp(''); setOtpError(''); }}
          style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
        >
          ← Orqaga qaytish
        </button>
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
          >
            Qayta yuborish
          </button>
        ) : (
          <span style={{ fontSize: 12, color: '#9ca3af' }}>
            Qayta: <strong style={{ color: '#374151' }}>{seconds}s</strong>
          </span>
        )}
      </div>
    </form>
  );
}

// ─── Main Register Page ───────────────────────────────────────────────────────
export default function Register() {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#f8fafc 0%,#fff 50%,#fff5f5 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52, borderRadius: 16, marginBottom: 14,
            background: 'linear-gradient(135deg,#C62828,#E53935)',
            boxShadow: '0 8px 20px rgba(198,40,40,0.35)',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ width: 26, height: 26 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: '#111827' }}>
            Ad<span style={{ color: '#dc2626' }}>Bloger</span>
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#9ca3af' }}>Blogger va biznes platformasi</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff', borderRadius: 20,
          boxShadow: '0 8px 40px rgba(0,0,0,0.09)', border: '1px solid #f3f4f6',
          overflow: 'hidden',
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #f3f4f6' }}>
            {[['login', 'Kirish'], ['register', "Ro'yxatdan o'tish"]].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: '15px 10px', border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                  background: 'none',
                  color: activeTab === tab ? '#C62828' : '#64748b',
                  borderBottom: `2px solid ${activeTab === tab ? '#C62828' : 'transparent'}`,
                  transition: 'all .15s',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ padding: '24px 28px 28px' }}>
            {activeTab === 'login' ? <LoginFlow key="login" /> : <RegisterFlow key="register" />}
          </div>
        </div>

      </div>
    </div>
  );
}
