import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from '../components/ui/toast';

const SILENT = { _skipToast: true };

// ─── Schemas ──────────────────────────────────────────────────────────────────
const loginSchema = yup.object({
  email: yup.string().email("Email noto'g'ri").required("Email kiritilishi shart"),
  password: yup.string().required("Parol kiritilishi shart"),
});

const registerSchema = yup.object({
  role: yup
    .string()
    .oneOf(['blogger', 'business'], "Rolni tanlash majburiy")
    .required("Rolni tanlash majburiy"),
  firstName: yup.string().trim().required("Ism kiritilishi shart"),
  lastName: yup.string().trim().default(''),
  email: yup.string().email("Email noto'g'ri").required("Email kiritilishi shart"),
  phone: yup.string().default(''),
  password: yup
    .string()
    .min(6, "Parol kamida 6 ta belgi bo'lishi kerak")
    .required("Parol kiritilishi shart"),
  confirmPassword: yup.string()
    .oneOf([yup.ref("password")], "Parollar mos kelmadi")
    .required("Parolni tasdiqlang"),
  platform:  yup.string().default(''),
  followers: yup.string().default(''),
  category:  yup.string().default(''),
});

// ─── Role config ──────────────────────────────────────────────────────────────
const ROLES = [
  {
    key: 'blogger',
    title: 'Blogger',
    desc: "Kontent yaratuvchi va ta'sirli shaxs",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
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

// ─── Reusable field ───────────────────────────────────────────────────────────
function Field({ label, error, required, children }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-500 mt-1 font-medium">{error}</p>}
    </div>
  );
}

const inputCls = (hasError) =>
  `w-full px-4 py-3 border rounded-xl text-sm outline-none transition bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent ${
    hasError ? 'border-red-400 bg-red-50' : 'border-gray-200'
  }`;

// ─── Login Form ───────────────────────────────────────────────────────────────
function LoginForm() {
  const { login: loginFn } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      const user = await loginFn({ email: data.email, password: data.password }, SILENT);
      toast.success(`Xush kelibsiz, ${user.firstName}!`);
      navigate(user?.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      const msg = err?.response?.data?.message || "Email yoki parol noto'g'ri";
      setError('root', { message: msg });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Field label="Email" required error={errors.email?.message}>
        <input
          type="email"
          placeholder="email@example.com"
          className={inputCls(!!errors.email)}
          {...register('email')}
        />
      </Field>

      <Field label="Parol" required error={errors.password?.message}>
        <input
          type="password"
          placeholder="••••••••"
          className={inputCls(!!errors.password)}
          {...register('password')}
        />
      </Field>

      {errors.root && (
        <div className="flex items-start gap-2 px-3.5 py-3 rounded-xl bg-red-50 border border-red-200">
          <svg viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" className="w-4 h-4 mt-0.5 shrink-0">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-sm text-red-700 font-medium">{errors.root.message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-60"
        style={{
          background: 'linear-gradient(135deg,#C62828,#E53935)',
          boxShadow: '0 4px 16px #C6282840',
        }}
      >
        {isSubmitting ? 'Kirish...' : 'Kirish'}
      </button>

      <div className="text-center pt-1">
        <a href="/" className="text-red-600 text-xs hover:text-red-700 transition font-medium">
          ← Bosh sahifaga qaytish
        </a>
      </div>
    </form>
  );
}

// ─── Register Form ────────────────────────────────────────────────────────────
function RegisterForm() {
  const { register: registerFn } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { role: '', firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', platform: '', followers: '', category: '' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    try {
      const payload = {
        firstName: data.firstName,
        lastName:  data.lastName,
        email:     data.email,
        phone:     data.phone,
        password:  data.password,
        role:      data.role,
      };
      if (data.role === 'blogger') {
        if (data.platform)  payload.platforms  = [data.platform];
        if (data.followers) payload.followers  = Number(data.followers);
        if (data.category)  payload.categories = [data.category];
      }
      const result = await registerFn(payload, SILENT);
      if (result?.status === 'pending') {
        navigate('/tasdiqlash-kutilmoqda');
      } else {
        toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
        navigate('/');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Ro'yxatdan o'tishda xatolik yuz berdi";
      setError('root', { message: msg });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

      {/* Role selection cards */}
      <div>
        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
          Siz kimsingiz? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {ROLES.map((r) => {
            const active = selectedRole === r.key;
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => setValue('role', r.key, { shouldValidate: true })}
                className="relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center"
                style={{
                  borderColor: active ? r.activeBorder : r.border,
                  background:  active ? r.activeBg    : r.bg,
                  boxShadow:   active ? `0 0 0 3px ${r.activeBorder}33` : 'none',
                }}
              >
                {active && (
                  <span
                    className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: r.color }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-2.5 h-2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
                <span style={{ color: active ? r.color : '#94A3B8' }}>{r.icon}</span>
                <div>
                  <p className="text-sm font-bold" style={{ color: active ? r.color : '#374151' }}>{r.title}</p>
                  <p className="text-[10px] leading-tight mt-0.5 text-slate-400">{r.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
        {errors.role && (
          <p className="text-[11px] text-red-500 mt-1.5 font-medium">{errors.role.message}</p>
        )}
      </div>

      {/* Name */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Ism" required error={errors.firstName?.message}>
          <input
            type="text"
            placeholder="Ismingiz"
            className={inputCls(!!errors.firstName)}
            {...register('firstName')}
          />
        </Field>
        <Field label="Familiya" error={errors.lastName?.message}>
          <input
            type="text"
            placeholder="Familiyangiz"
            className={inputCls(!!errors.lastName)}
            {...register('lastName')}
          />
        </Field>
      </div>

      <Field label="Email" required error={errors.email?.message}>
        <input
          type="email"
          placeholder="email@example.com"
          className={inputCls(!!errors.email)}
          {...register('email')}
        />
      </Field>

      <Field label="Telefon" error={errors.phone?.message}>
        <input
          type="tel"
          placeholder="+998 90 000 00 00"
          className={inputCls(!!errors.phone)}
          {...register('phone')}
        />
      </Field>

      <Field label="Parol" required error={errors.password?.message}>
        <input
          type="password"
          placeholder="Kamida 6 ta belgi"
          className={inputCls(!!errors.password)}
          {...register('password')}
        />
      </Field>

      <Field label="Parolni tasdiqlang" required error={errors.confirmPassword?.message}>
        <input
          type="password"
          placeholder="Parolni qayta kiriting"
          className={inputCls(!!errors.confirmPassword)}
          {...register('confirmPassword')}
        />
      </Field>

      {/* Blogger-specific fields */}
      {selectedRole === 'blogger' && (
        <>
          <div style={{ borderTop: '1px dashed #E5E7EB', paddingTop: 4 }}>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              Blogger ma'lumotlari
            </p>
            <div className="space-y-3">
              <Field label="Asosiy platforma" error={errors.platform?.message}>
                <select className={inputCls(!!errors.platform)} {...register('platform')}>
                  <option value="">Platformani tanlang</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="telegram">Telegram</option>
                </select>
              </Field>
              <Field label="Obunachilar soni" error={errors.followers?.message}>
                <input
                  type="number"
                  placeholder="Masalan: 50000"
                  className={inputCls(!!errors.followers)}
                  {...register('followers')}
                />
              </Field>
              <Field label="Kategoriya" error={errors.category?.message}>
                <select className={inputCls(!!errors.category)} {...register('category')}>
                  <option value="">Kategoriyani tanlang</option>
                  <option value="Tech">Texnologiya</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Beauty">Go'zallik</option>
                  <option value="Food">Ovqat</option>
                  <option value="Sports">Sport</option>
                  <option value="Travel">Sayohat</option>
                  <option value="Education">Ta'lim</option>
                  <option value="Business">Biznes</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Music">Musiqa</option>
                  <option value="Other">Boshqa</option>
                </select>
              </Field>
            </div>
          </div>
        </>
      )}

      {errors.root && (
        <div className="flex items-start gap-2 px-3.5 py-3 rounded-xl bg-red-50 border border-red-200">
          <svg viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" className="w-4 h-4 mt-0.5 shrink-0">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-sm text-red-700 font-medium">{errors.root.message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: 'linear-gradient(135deg,#C62828,#E53935)',
          color: 'white',
          boxShadow: '0 4px 16px #C6282840',
        }}
      >
        {isSubmitting ? 'Yuborilmoqda...' : "Ro'yxatdan o'tish"}
      </button>

      <div className="text-center pt-1">
        <a href="/" className="text-red-600 text-xs hover:text-red-700 transition font-medium">
          ← Bosh sahifaga qaytish
        </a>
      </div>
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Register() {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{
              background: 'linear-gradient(135deg,#C62828,#E53935)',
              boxShadow: '0 8px 24px #C6282844',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900">
            Ad<span className="text-red-600">Bloger</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Blogger va biznes platformasi</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {[['login', 'Kirish'], ['register', "Ro'yxatdan o'tish"]].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-4 text-sm font-semibold transition-all relative"
                style={{ color: activeTab === tab ? '#C62828' : '#64748B' }}
              >
                {label}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-red-600" />
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>

      </div>
    </div>
  );
}
