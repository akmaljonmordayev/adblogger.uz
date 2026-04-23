import React, { useState, useMemo, useCallback } from 'react';

const PAGE_SIZE = 5;

const INITIAL_ADS = [
  { id: 1, title: "iPhone 15 Pro Max batafsil sharhi", price: 15000000, author: "MrBeast", status: "Kutilmoqda", date: "2026-04-22", category: "Texnologiya", views: 1240 },
  { id: 2, title: "MacBook M2 Pro — loyiq mi?", price: 12000000, author: "Marques Brownlee", status: "Faol", date: "2026-04-21", category: "Texnologiya", views: 8820 },
  { id: 3, title: "Kundalik vlog: Nyu-York", price: 400000, author: "Casey Neistat", status: "Rad etilgan", date: "2026-04-20", category: "Vlog", views: 302 },
  { id: 4, title: "Samsung Galaxy S24 Ultra test", price: 9500000, author: "Linus Tech Tips", status: "Kutilmoqda", date: "2026-04-19", category: "Texnologiya", views: 540 },
  { id: 5, title: "Ovqat pishirish — 10 daqiqada", price: 1200000, author: "Tasty Uzbekistan", status: "Faol", date: "2026-04-18", category: "Ovqat", views: 3100 },
  { id: 6, title: "Fitness dasturi: 30 kun", price: 2500000, author: "AthleanX", status: "Faol", date: "2026-04-17", category: "Sport", views: 4500 },
  { id: 7, title: "DJI Mavic 3 Pro unboxing", price: 7800000, author: "Peter McKinnon", status: "Kutilmoqda", date: "2026-04-16", category: "Foto/Video", views: 980 },
  { id: 8, title: "Python dasturlash asoslari", price: 3200000, author: "Tech With Tim", status: "Faol", date: "2026-04-15", category: "Ta'lim", views: 6700 },
  { id: 9, title: "Sayohat: Maldiv orollari", price: 18000000, author: "Lost LeBlancs", status: "Rad etilgan", date: "2026-04-14", category: "Sayohat", views: 220 },
  { id: 10, title: "Sony WH-1000XM5 tahlil", price: 5500000, author: "Headphones Addict", status: "Kutilmoqda", date: "2026-04-13", category: "Audio", views: 410 },
  { id: 11, title: "Minecraft survival challenge", price: 800000, author: "Dream", status: "Faol", date: "2026-04-12", category: "O'yin", views: 9900 },
  { id: 12, title: "Adobe Premiere Pro darslari", price: 4100000, author: "Justin Odisho", status: "Faol", date: "2026-04-11", category: "Ta'lim", views: 2200 },
];

const fmt = (n) => Number(n).toLocaleString('uz-UZ');
const initials = (name) => name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

// ─── Icons ────────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" />
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);
const EyeIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const SearchIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  'Faol':        { bg: '#EAF3DE', color: '#3B6D11' },
  'Kutilmoqda':  { bg: '#FAEEDA', color: '#854F0B' },
  'Rad etilgan': { bg: '#FCEBEB', color: '#A32D2D' },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || {};
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 500,
      background: s.bg, color: s.color,
    }}>
      {status}
    </span>
  );
};

// ─── Toast Notification ───────────────────────────────────────────────────────
const TOAST_STYLES = {
  ok:   { bg: '#EAF3DE', border: '#C0DD97', color: '#3B6D11' },
  warn: { bg: '#FAEEDA', border: '#FAC775', color: '#854F0B' },
  err:  { bg: '#FCEBEB', border: '#F7C1C1', color: '#A32D2D' },
};

const Toast = ({ toast }) => {
  if (!toast) return null;
  const s = TOAST_STYLES[toast.type] || TOAST_STYLES.ok;
  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 999,
      padding: '10px 18px', borderRadius: 8,
      border: `0.5px solid ${s.border}`,
      background: s.bg, color: s.color,
      fontSize: 13, fontWeight: 500,
      boxShadow: '0 4px 12px rgba(0,0,0,.08)',
      animation: 'fadeIn .2s ease',
    }}>
      {toast.msg}
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, valueColor }) => (
  <div style={{
    background: '#fff', border: '0.5px solid #e5e7eb',
    borderRadius: 12, padding: '1rem 1.25rem',
  }}>
    <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 500, color: valueColor || '#111' }}>{value}</div>
    {sub && <div style={{ fontSize: 12, marginTop: 4, color: '#9ca3af' }}>{sub}</div>}
  </div>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal = ({ ad, onClose, onApprove, onReject, onDelete }) => {
  if (!ad) return null;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="w-[480px] max-w-[95vw] rounded-2xl overflow-hidden 
        bg-gradient-to-br from-[#0f172a] to-[#43518f] 
        border border-white/10 shadow-[0_0_40px_rgba(0,255,255,0.15)]">

        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white tracking-wide">
            E'lon #{ad.id} — {ad.title}
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-red-400 transition text-lg"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {[
            ['Sarlavha', ad.title],
            ['Bloger', ad.author],
            ['Narx', `${fmt(ad.price)} so'm`],
            ['Kategoriya', ad.category],
            ["Ko'rishlar", fmt(ad.views)],
            ['Sana', ad.date],
          ].map(([label, val]) => (
            <div key={label}>
              <div className="text-[10px] text-cyan-400 uppercase tracking-widest mb-1">
                {label}
              </div>
              <div className="text-white text-sm font-medium">
                {val}
              </div>
            </div>
          ))}

          <div>
            <div className="text-[10px] text-purple-400 uppercase tracking-widest mb-1">
              Joriy status
            </div>
            <StatusBadge status={ad.status} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 justify-end px-5 py-4 border-t border-white/10">

          <button
            onClick={() => onApprove(ad.id)}
            className="px-4 py-2 text-xs font-semibold rounded-lg 
            bg-green-500/10 text-green-400 border border-green-500/30
            hover:bg-green-500/20 hover:shadow-[0_0_10px_#22c55e] transition"
          >
            Tasdiqlash
          </button>

          <button
            onClick={() => onReject(ad.id)}
            className="px-4 py-2 text-xs font-semibold rounded-lg 
            bg-yellow-500/10 text-yellow-400 border border-yellow-500/30
            hover:bg-yellow-500/20 hover:shadow-[0_0_10px_#eab308] transition"
          >
            Rad etish
          </button>

          <button
            onClick={() => { onDelete(ad.id); onClose(); }}
            className="px-4 py-2 text-xs font-semibold rounded-lg 
            bg-red-500/10 text-red-400 border border-red-500/30
            hover:bg-red-500/20 hover:shadow-[0_0_10px_#ef4444] transition"
          >
            O'chirish
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg 
            bg-white/5 text-white/60 border border-white/10
            hover:bg-white/10 transition"
          >
            Yopish
          </button>

        </div>
      </div>
    </div>
  );
};

// ─── Action Button ────────────────────────────────────────────────────────────
const ActionBtn = ({ onClick, title, hoverBg, hoverColor, hoverBorder, children }) => {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 6, border: hover ? `0.5px solid ${hoverBorder}` : '0.5px solid #e5e7eb',
        background: hover ? hoverBg : 'transparent',
        cursor: 'pointer', color: hover ? hoverColor : '#6b7280',
        transition: 'all .12s',
      }}
    >
      {children}
    </button>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminAds() {
  const [ads, setAds] = useState(INITIAL_ADS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortType, setSortType] = useState('newest');
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(1);
  const [modalAd, setModalAd] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = useCallback((type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let res = ads.filter(a => {
      const matchQ = a.title.toLowerCase().includes(q) || a.author.toLowerCase().includes(q);
      const matchS = filterStatus === 'all' || a.status === filterStatus;
      return matchQ && matchS;
    });
    if (sortType === 'newest') res.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sortType === 'oldest') res.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (sortType === 'price_desc') res.sort((a, b) => b.price - a.price);
    else if (sortType === 'price_asc') res.sort((a, b) => a.price - b.price);
    else if (sortType === 'title') res.sort((a, b) => a.title.localeCompare(b.title));
    return res;
  }, [ads, search, filterStatus, sortType]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const updateStatus = useCallback((id, status) => {
    setAds(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    setModalAd(prev => prev?.id === id ? { ...prev, status } : prev);
    notify(status === 'Faol' ? 'ok' : status === 'Rad etilgan' ? 'warn' : 'err', `Status yangilandi: ${status}`);
  }, [notify]);

  const deleteAd = useCallback((id) => {
    setAds(prev => prev.filter(a => a.id !== id));
    setSelected(prev => { const s = new Set(prev); s.delete(id); return s; });
    notify('err', "E'lon o'chirildi");
  }, [notify]);

  const bulkAction = (action) => {
    const cnt = selected.size;
    if (!cnt) return;
    if (action === 'delete') {
      setAds(prev => prev.filter(a => !selected.has(a.id)));
      notify('err', `${cnt} ta e'lon o'chirildi`);
    } else {
      setAds(prev => prev.map(a => selected.has(a.id) ? { ...a, status: action } : a));
      notify('ok', `${cnt} ta e'lon: ${action}`);
    }
    setSelected(new Set());
  };

  const toggleOne = (id, checked) => {
    setSelected(prev => {
      const s = new Set(prev);
      checked ? s.add(id) : s.delete(id);
      return s;
    });
  };

  const toggleAll = (checked) => {
    setSelected(prev => {
      const s = new Set(prev);
      pageItems.forEach(a => checked ? s.add(a.id) : s.delete(a.id));
      return s;
    });
  };

  const allChecked = pageItems.length > 0 && pageItems.every(a => selected.has(a.id));
  const someChecked = pageItems.some(a => selected.has(a.id));

  // Stats
  const total = ads.length;
  const faolCount = ads.filter(a => a.status === 'Faol').length;
  const waitCount = ads.filter(a => a.status === 'Kutilmoqda').length;
  const totalPrice = ads.reduce((s, a) => s + a.price, 0);

  const FILTERS = ['all', 'Kutilmoqda', 'Faol', 'Rad etilgan'];
  const FILTER_LABELS = { all: 'Barchasi', 'Kutilmoqda': 'Kutilmoqda', 'Faol': 'Faol', 'Rad etilgan': 'Rad etilgan' };

  return (
    <div style={{ padding: '1.5rem', background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <Toast toast={toast} />
      <Modal
        ad={modalAd}
        onClose={() => setModalAd(null)}
        onApprove={(id) => updateStatus(id, 'Faol')}
        onReject={(id) => updateStatus(id, 'Rad etilgan')}
        onDelete={deleteAd}
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: '1.5rem' }}>
        <StatCard label="Jami e'lonlar" value={total} sub="barcha statuslar" />
        <StatCard label="Faol" value={faolCount} valueColor="#3B6D11" sub={`${total ? Math.round(faolCount / total * 100) : 0}% ulushi`} />
        <StatCard label="Kutilmoqda" value={waitCount} valueColor="#854F0B" sub="ko'rib chiqish kerak" />
        <StatCard label="Umumiy narx" value={`${(totalPrice / 1000000).toFixed(1)}M`} sub="so'm" />
      </div>

      {/* Toolbar */}
      <div style={{
        background: '#fff', border: '0.5px solid #e5e7eb', borderRadius: 12,
        padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12,
        flexWrap: 'wrap', marginBottom: '1rem',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}>
            <SearchIcon />
          </span>
          <input
        
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Sarlavha yoki bloger bo'yicha qidirish..."
            style={{
              width: '100%', padding: '7px 12px 7px 34px',
              border: '0.5px solid #d1d5db', borderRadius: 8,
              fontSize: 13, background: '#f9fafb', color: '#111',
              outline: 'none',
              transition: 'all .15s',
              '&:focus': { borderColor: '#3b82f6', boxShadow: '0 0 0 1px #3b82f6' },

            }}
          />
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 4, background: '#f3f4f6', borderRadius: 8, padding: 3 }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => { setFilterStatus(f); setPage(1); setSelected(new Set()); }}
              style={{
                padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                cursor: 'pointer', border: filterStatus === f ? '0.5px solid #e5e7eb' : 'none',
                background: filterStatus === f ? '#fff' : 'transparent',
                color: filterStatus === f ? '#111' : '#6b7280',

                transition: 'all .15s',
                
              }}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sortType}
          onChange={e => setSortType(e.target.value)}
          style={{ padding: '7px 10px', border: '0.5px solid #d1d5db', borderRadius: 8, fontSize: 13, background: '#f9fafb', color: '#111' }}
        >
          <option value="newest">Yangi avval</option>
          <option value="oldest">Eski avval</option>
          <option value="price_desc">Narx: ko'pdan kam</option>
          <option value="price_asc">Narx: kamdan ko'p</option>
          <option value="title">Sarlavha A-Z</option>
        </select>
      </div>

      {/* Bulk bar */}
      {selected.size > 0 && (
        <div style={{
          background: '#EFF6FF', border: '0.5px solid #BFDBFE', borderRadius: 8,
          padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 10, fontSize: 13, color: '#1D4ED8',
        }}>
          <span>{selected.size} ta tanlandi</span>
          {[
            { label: 'Tasdiqlash', action: 'Faol', bg: '#EAF3DE', border: '#C0DD97', color: '#3B6D11' },
            { label: 'Rad etish', action: 'Rad etilgan', bg: '#FAEEDA', border: '#FAC775', color: '#854F0B' },
            { label: "O'chirish", action: 'delete', bg: '#FCEBEB', border: '#F7C1C1', color: '#A32D2D' },
          ].map(b => (
            <button
              key={b.action}
              onClick={() => bulkAction(b.action)}
              style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: `0.5px solid ${b.border}`, background: b.bg, color: b.color }}
            >
              {b.label}
            </button>
          ))}
          <button
            onClick={() => setSelected(new Set())}
            style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '0.5px solid #e5e7eb', background: '#f9fafb', color: '#6b7280' }}
          >
            Bekor qilish
          </button>
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#fff', border: '0.5px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: 32 }} />
            <col style={{ width: 32 }} />
            <col />
            <col style={{ width: 130 }} />
            <col style={{ width: 120 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 120 }} />
          </colgroup>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['', '#', 'Sarlavha', 'Bloger', 'Narx (so\'m)', 'Sana', 'Status', 'Amallar'].map((h, i) => (
                <th key={i} style={{
                  padding: '10px 14px', textAlign: i === 7 ? 'center' : 'left',
                  fontSize: 11, fontWeight: 500, color: '#6b7280',
                  textTransform: 'uppercase', letterSpacing: '.05em',
                  borderBottom: '0.5px solid #e5e7eb',
                }}>
                  {i === 0 ? (
                    <input
                      type="checkbox"
                      checked={allChecked}
                      ref={el => { if (el) el.indeterminate = !allChecked && someChecked; }}
                      onChange={e => toggleAll(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                  ) : h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', fontSize: 14 }}>
                  Hech qanday e'lon topilmadi
                </td>
              </tr>
            ) : pageItems.map((ad, i) => (
              <tr
                key={ad.id}
                style={{
                  borderBottom: '0.5px solid #f3f4f6',
                  background: selected.has(ad.id) ? '#EFF6FF' : 'transparent',
                  transition: 'background .1s',
                }}
                onMouseEnter={e => { if (!selected.has(ad.id)) e.currentTarget.style.background = '#f9fafb'; }}
                onMouseLeave={e => { e.currentTarget.style.background = selected.has(ad.id) ? '#EFF6FF' : 'transparent'; }}
              >
                <td style={{ padding: '11px 14px' }}>
                  <input
                    type="checkbox"
                    checked={selected.has(ad.id)}
                    onChange={e => toggleOne(ad.id, e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                <td style={{ padding: '11px 14px', color: '#9ca3af', fontSize: 12 }}>
                  {(safePage - 1) * PAGE_SIZE + i + 1}
                </td>
                <td style={{ padding: '11px 14px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {ad.title}
                </td>
                <td style={{ padding: '11px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%',
                      background: '#EFF6FF', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 10, fontWeight: 600,
                      color: '#1D4ED8', flexShrink: 0,
                    }}>
                      {initials(ad.author)}
                    </div>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ad.author}</span>
                  </div>
                </td>
                <td style={{ padding: '11px 14px', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
                  {fmt(ad.price)}
                </td>
                <td style={{ padding: '11px 14px', color: '#6b7280', fontSize: 12 }}>{ad.date}</td>
                <td style={{ padding: '11px 14px' }}>
                  <StatusBadge status={ad.status} />
                </td>
                <td style={{ padding: '11px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
                    <ActionBtn onClick={() => updateStatus(ad.id, 'Faol')} title="Tasdiqlash" hoverBg="#EAF3DE" hoverColor="#3B6D11" hoverBorder="#C0DD97">
                      <CheckIcon />
                    </ActionBtn>
                    <ActionBtn onClick={() => updateStatus(ad.id, 'Rad etilgan')} title="Rad etish" hoverBg="#FAEEDA" hoverColor="#854F0B" hoverBorder="#FAC775">
                      <XIcon />
                    </ActionBtn>
                    <ActionBtn onClick={() => deleteAd(ad.id)} title="O'chirish" hoverBg="#FCEBEB" hoverColor="#A32D2D" hoverBorder="#F7C1C1">
                      <TrashIcon />
                    </ActionBtn>
                    <ActionBtn onClick={() => setModalAd(ad)} title="Ko'rish" hoverBg="#EFF6FF" hoverColor="#1D4ED8" hoverBorder="#BFDBFE">
                      <EyeIcon />
                    </ActionBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', borderTop: '0.5px solid #e5e7eb',
        }}>
          <span style={{ fontSize: 12, color: '#6b7280' }}>
            {filtered.length} ta natija · {safePage}/{totalPages} sahifa
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            <PgBtn disabled={safePage <= 1} onClick={() => setPage(p => p - 1)}>‹</PgBtn>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
              const show = totalPages <= 7 || p === 1 || p === totalPages || Math.abs(p - safePage) <= 1;
              const ellipsis = Math.abs(p - safePage) === 2 && totalPages > 7;
              if (ellipsis) return <span key={p} style={{ padding: '0 4px', color: '#9ca3af', fontSize: 12, lineHeight: '28px' }}>…</span>;
              if (!show) return null;
              return <PgBtn key={p} active={p === safePage} onClick={() => setPage(p)}>{p}</PgBtn>;
            })}
            <PgBtn disabled={safePage >= totalPages} onClick={() => setPage(p => p + 1)}>›</PgBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function PgBtn({ children, onClick, disabled, active }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 28, height: 28, padding: '0 6px',
        borderRadius: 6, border: active ? '0.5px solid #BFDBFE' : '0.5px solid #e5e7eb',
        background: active ? '#EFF6FF' : 'transparent',
        fontSize: 12, cursor: disabled ? 'not-allowed' : 'pointer',
        color: active ? '#1D4ED8' : '#6b7280',
        fontWeight: active ? 500 : 400,
        opacity: disabled ? .4 : 1,
      }}
    >
      {children}
    </button>
  );
}