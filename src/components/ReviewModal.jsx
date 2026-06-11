import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';
import { toast } from './ui/toast';

const STORAGE_KEY = 'adblogger_review_prompt';
const DAYS_BEFORE_PROMPT = 2;   // 2 kun o'tgach ko'rsatish
const DAYS_SNOOZE = 3;          // rad etilgandan keyin 3 kun kutish

function getPromptData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}
function savePromptData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, lineHeight: 1 }}
        >
          <svg viewBox="0 0 24 24" width="32" height="32" fill={n <= (hovered || value) ? '#fbbf24' : 'none'} stroke={n <= (hovered || value) ? '#fbbf24' : '#d1d5db'} strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function ReviewModal() {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [show, setShow] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  // Initialize first visit timestamp
  useEffect(() => {
    const data = getPromptData();
    if (!data.firstVisit) {
      savePromptData({ ...data, firstVisit: Date.now() });
    }
  }, []);

  // Check if should show modal
  useEffect(() => {
    // Don't show on auth/admin pages
    const blockedPaths = ['/kirish', '/royxatdan-otish', '/tasdiqlash-kutilmoqda', '/profil-toldirish', '/profil-tasdiqlash-kutilmoqda'];
    if (blockedPaths.some(p => location.pathname.startsWith(p))) return;
    if (location.pathname.startsWith('/admin')) return;

    const data = getPromptData();
    if (data.hasReviewed) return;

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    // Must be older than DAYS_BEFORE_PROMPT days
    if (!data.firstVisit || now - data.firstVisit < DAYS_BEFORE_PROMPT * dayMs) return;

    // If dismissed recently, wait DAYS_SNOOZE
    if (data.lastDismissed && now - data.lastDismissed < DAYS_SNOOZE * dayMs) return;

    // Check server if already reviewed (if logged in)
    if (token && user) {
      api.get('/site-reviews/my')
        .then(res => {
          if (res.data.data) {
            setHasReviewed(true);
            savePromptData({ ...getPromptData(), hasReviewed: true });
          } else {
            setTimeout(() => setShow(true), 2000);
          }
        })
        .catch(() => {
          setTimeout(() => setShow(true), 2000);
        });
    } else {
      // Not logged in — still show after timeout
      setTimeout(() => setShow(true), 2000);
    }
  }, [location.pathname, token, user]);

  // After login redirect back with modal intent
  useEffect(() => {
    const intent = localStorage.getItem('review_intent_after_login');
    if (intent && token && user && location.pathname === '/') {
      localStorage.removeItem('review_intent_after_login');
      setTimeout(() => setShow(true), 1000);
    }
  }, [token, user, location.pathname]);

  const handleDismiss = () => {
    setShow(false);
    savePromptData({ ...getPromptData(), lastDismissed: Date.now() });
  };

  const handleLoginRedirect = () => {
    setShow(false);
    localStorage.setItem('review_intent_after_login', '1');
    navigate('/kirish');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { toast.error('Iltimos, yulduz bering'); return; }
    setLoading(true);
    try {
      await api.post('/site-reviews', { rating, comment });
      setHasReviewed(true);
      savePromptData({ ...getPromptData(), hasReviewed: true });
      setShow(false);
      toast.success('Fikringiz uchun rahmat! 🙏');
    } catch (err) {
      if (err?.response?.status === 409) {
        // Already reviewed
        setHasReviewed(true);
        savePromptData({ ...getPromptData(), hasReviewed: true });
        setShow(false);
        toast.info('Siz allaqachon baholagan edingiz');
      } else {
        toast.error(err?.response?.data?.message || 'Xatolik yuz berdi');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!show || hasReviewed) return null;

  const isLoggedIn = !!token && !!user;

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) handleDismiss(); }}
    >
      <div style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 440, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.25)', animation: 'reviewModalIn .3s ease' }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)', padding: '28px 28px 24px', textAlign: 'center', position: 'relative' }}>
          <button
            onClick={handleDismiss}
            style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: 18 }}
          >×</button>
          <div style={{ fontSize: 40, marginBottom: 10 }}>⭐</div>
          <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>Platformani baholang!</h3>
          <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>
            {isLoggedIn ? `Salom, ${user.firstName}! ` : ''}Fikringiz bizga juda muhim
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px 28px' }}>
          {!isLoggedIn ? (
            // Not logged in state
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
                Baholash uchun akkauntingizga kiring. Baho qoldirib, boshqalarga yordam bering!
              </p>
              <button
                onClick={handleLoginRedirect}
                style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#dc2626,#b91c1c)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', marginBottom: 10, fontFamily: 'inherit' }}
              >
                Kirish / Ro'yxatdan o'tish
              </button>
              <button
                onClick={handleDismiss}
                style={{ width: '100%', padding: '11px', borderRadius: 12, border: '1px solid #e5e7eb', background: '#fff', color: '#6b7280', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Keyinroq
              </button>
            </div>
          ) : (
            // Logged in — show form
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20, textAlign: 'center' }}>
                <p style={{ margin: '0 0 12px', fontSize: 13, color: '#374151', fontWeight: 600 }}>Umumiy bahongiz:</p>
                <StarPicker value={rating} onChange={setRating} />
                {rating > 0 && (
                  <p style={{ margin: '8px 0 0', fontSize: 12, color: '#fbbf24', fontWeight: 700 }}>
                    {['', 'Juda yomon', 'Yomon', 'O\'rtacha', 'Yaxshi', 'Ajoyib!'][rating]}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Izoh (ixtiyoriy)
                </label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Platforma haqida fikringizni yozing..."
                  rows={3}
                  maxLength={500}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box', color: '#111827' }}
                  onFocus={e => { e.target.style.borderColor = '#dc2626'; }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={handleDismiss}
                  style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', color: '#6b7280', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Keyinroq
                </button>
                <button
                  type="submit"
                  disabled={loading || !rating}
                  style={{ flex: 2, padding: '11px', borderRadius: 10, border: 'none', background: rating ? 'linear-gradient(135deg,#dc2626,#b91c1c)' : '#e5e7eb', color: rating ? '#fff' : '#9ca3af', fontSize: 14, fontWeight: 700, cursor: rating ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all .2s' }}
                >
                  {loading ? 'Yuborilmoqda...' : 'Yuborish 🙏'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes reviewModalIn {
          from { opacity: 0; transform: scale(.94) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
