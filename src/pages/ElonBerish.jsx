import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  LuUsers, LuBuilding2, LuArrowRight, LuArrowLeft,
  LuCheck, LuInstagram, LuYoutube, LuMessageCircle,
  LuImage, LuSend, LuCircleCheck, LuLoader, LuLock,
  LuX, LuCloudUpload,
} from "react-icons/lu";
import api from "../services/api";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "../components/ui/toast";
import { useState, useRef, useCallback } from "react";

/* ── Font ── */
if (!document.getElementById("elon-fonts")) {
  const l = document.createElement("link");
  l.id = "elon-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600;700&display=swap";
  document.head.appendChild(l);
}

/* ── Shared styles ── */
const INP = {
  width: "100%", padding: "11px 14px", fontSize: 14,
  border: "1.5px solid #e5e7eb", borderRadius: 10, outline: "none",
  background: "#fff", color: "#111827", boxSizing: "border-box",
  fontFamily: "inherit", transition: "border-color 0.2s",
};
const INP_ERR = { ...INP, borderColor: "#dc2626", background: "#fff9f9" };

/* ── API enum mapping ── */
const FOLLOWER_RANGE_MAP = {
  "1K – 10K": "1K-10K", "10K – 50K": "10K-50K",
  "50K – 100K": "50K-100K", "100K – 500K": "100K-500K",
  "500K – 1M": "500K-1M", "1M+": "1M+",
};
const NICHE_MAP = {
  "Lifestyle": "Lifestyle", "Fashion & Beauty": "Beauty",
  "Texnologiya": "Tech", "Ovqat": "Food",
  "Sport & Fitness": "Sports", "Ta'lim": "Education",
  "Sayohat": "Travel", "Biznes": "Business",
  "Gaming": "Gaming", "Musiqa": "Music",
};
const SERVICE_MAP = {
  "Post (feed)": "Post", "Story": "Story",
  "Reel / Shorts": "Reel", "YouTube video": "Video",
  "Live efir": "Live", "Telegram post": "Post",
  "Unboxing / Ko'rib chiqish": "Unboxing",
};
const BUDGET_MAP = {
  "500 000 – 1 000 000 so'm": "500K-1M",
  "1 000 000 – 3 000 000 so'm": "1M-3M",
  "3 000 000 – 5 000 000 so'm": "3M-5M",
  "5 000 000 – 10 000 000 so'm": "5M-10M",
  "10 000 000+ so'm": "10M+",
  "Kelishiladi": "Negotiable",
};
const BUSINESS_TYPE_MAP = {
  "Ishlab chiqarish (zavod, fabrika)": "Manufacturing",
  "Chakana savdo (do'kon, market)": "Retail",
  "Restoran / Cafe": "Restaurant",
  "Go'zallik va sog'liq": "Beauty",
  "Ko'chmas mulk": "RealEstate",
  "Ta'lim xizmatlari": "Education",
  "Texnologiya va dasturiy ta'minot": "Tech",
  "Turizm va dam olish": "Tourism",
  "Moliya va sug'urta": "Finance",
  "Boshqa": "Other",
};
const BLOGGER_TYPE_MAP = {
  "Lifestyle bloger": "Lifestyle", "Food bloger": "Food",
  "Beauty bloger": "Beauty", "Tech bloger": "Tech",
  "Travel bloger": "Travel", "Sport bloger": "Sports",
  "Biznes bloger": "Business", "Har qanday bloger": "Any",
};

/* ── Static options ── */
const PLATFORMS = [
  { key: "instagram", label: "Instagram", Icon: LuInstagram, color: "#e1306c" },
  { key: "youtube",   label: "YouTube",   Icon: LuYoutube,   color: "#ff0000" },
  { key: "telegram",  label: "Telegram",  Icon: LuMessageCircle, color: "#0088cc" },
];
const BLOGGER_SERVICES = [
  "Post (feed)", "Story", "Reel / Shorts", "YouTube video",
  "Live efir", "Telegram post", "Unboxing / Ko'rib chiqish",
];
const BLOGGER_NICHES = [
  "Lifestyle", "Fashion & Beauty", "Texnologiya", "Ovqat",
  "Sport & Fitness", "Ta'lim", "Sayohat", "Biznes", "Gaming", "Musiqa",
];
const FOLLOWER_RANGES = [
  "1K – 10K", "10K – 50K", "50K – 100K",
  "100K – 500K", "500K – 1M", "1M+",
];
const BUSINESS_TYPES = [
  "Ishlab chiqarish (zavod, fabrika)", "Chakana savdo (do'kon, market)",
  "Restoran / Cafe", "Go'zallik va sog'liq", "Ko'chmas mulk",
  "Ta'lim xizmatlari", "Texnologiya va dasturiy ta'minot",
  "Turizm va dam olish", "Moliya va sug'urta", "Boshqa",
];
const BLOGGER_TYPES_NEEDED = [
  "Lifestyle bloger", "Food bloger", "Beauty bloger",
  "Tech bloger", "Travel bloger", "Sport bloger",
  "Biznes bloger", "Har qanday bloger",
];
const BUDGET_RANGES = [
  "500 000 – 1 000 000 so'm", "1 000 000 – 3 000 000 so'm",
  "3 000 000 – 5 000 000 so'm", "5 000 000 – 10 000 000 so'm",
  "10 000 000+ so'm", "Kelishiladi",
];
const DURATIONS = ["1 hafta", "2 hafta", "1 oy", "2–3 oy", "6 oy", "1 yil"];

/* ── Yup schemas ── */
const bloggerSchema = yup.object({
  name:      yup.string().required("Ism-familiya kiritish majburiy"),
  phone:     yup.string().required("Telefon raqam kiritish majburiy"),
  platforms: yup.array().min(1, "Kamida 1 ta platforma tanlang"),
  followers: yup.string().required("Obunachilar sonini tanlang"),
  niche:     yup.array().min(1, "Kamida 1 ta yo'nalish tanlang"),
  services:  yup.array().min(1, "Kamida 1 ta xizmat turi tanlang"),
  pricePost: yup.string().required("Post narxini kiriting"),
  about:     yup.string().required("O'zingiz haqida yozing"),
  portfolio: yup.string().url("To'g'ri URL kiriting").nullable().transform(v => v || null),
  priceStory: yup.string(),
  priceVideo: yup.string(),
});

const businessSchema = yup.object({
  companyName:    yup.string().required("Kompaniya nomi kiritish majburiy"),
  contactName:    yup.string().required("Aloqa shaxsi kiritish majburiy"),
  phone:          yup.string().required("Telefon raqam kiritish majburiy"),
  businessType:   yup.string().required("Faoliyat turini tanlang"),
  product:        yup.string().required("Mahsulot / xizmat nomini kiriting"),
  description:    yup.string().required("Mahsulot haqida batafsil yozing"),
  platforms:      yup.array().min(1, "Kamida 1 ta platforma tanlang"),
  bloggerTypes:   yup.array().min(1, "Qanday bloger kerakligini tanlang"),
  targetAudience: yup.string().required("Maqsadli auditoriyani kiriting"),
  budget:         yup.string().required("Byudjetni tanlang"),
  duration:       yup.string().required("Kampaniya davomiyligini tanlang"),
  location:       yup.string().required("Joylashuvni kiriting"),
  goal:           yup.string().required("Kampaniya maqsadini kiriting"),
  extra:          yup.string(),
});

/* ── Error message ── */
function ErrMsg({ msg }) {
  if (!msg) return null;
  return <p style={{ color: "#dc2626", fontSize: 11, marginTop: 4, fontWeight: 600 }}>⚠ {msg}</p>;
}

/* ── Multi-select chips ── */
function Chips({ options, selected = [], onChange, hasError }) {
  const toggle = v =>
    onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v]);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(o => {
        const active = selected.includes(o);
        return (
          <button key={o} type="button" onClick={() => toggle(o)} style={{
            padding: "7px 14px", borderRadius: 100, cursor: "pointer",
            fontSize: 12, fontWeight: 600, fontFamily: "inherit",
            border: `1.5px solid`,
            background: active ? "#fef2f2" : "#f9fafb",
            borderColor: active ? "#dc2626" : hasError ? "#fca5a5" : "#e5e7eb",
            color: active ? "#dc2626" : "#374151",
            transition: "all 0.15s",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            {active && <LuCheck size={11} strokeWidth={3} />}
            {o}
          </button>
        );
      })}
    </div>
  );
}

/* ── Platform chips ── */
function PlatformChips({ selected = [], onChange, hasError }) {
  const toggle = k =>
    onChange(selected.includes(k) ? selected.filter(x => x !== k) : [...selected, k]);
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {PLATFORMS.map(({ key, label, Icon, color }) => {
        const active = selected.includes(key);
        return (
          <button key={key} type="button" onClick={() => toggle(key)} style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "8px 16px", borderRadius: 10, cursor: "pointer",
            fontSize: 13, fontWeight: 600, fontFamily: "inherit",
            border: "1.5px solid",
            background: active ? "#fff" : "#f9fafb",
            borderColor: active ? color : hasError ? "#fca5a5" : "#e5e7eb",
            color: active ? color : "#374151",
            boxShadow: active ? `0 0 0 3px ${color}18` : "none",
            transition: "all 0.15s",
          }}>
            <Icon size={15} style={{ color: active ? color : "#9ca3af" }} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Field wrapper ── */
function Field({ label, required, hint, children, error }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
        {label}
        {required && <span style={{ color: "#dc2626" }}> *</span>}
        {hint && <span style={{ fontWeight: 400, color: "#9ca3af", marginLeft: 6 }}>{hint}</span>}
      </label>
      {children}
      <ErrMsg msg={error} />
    </div>
  );
}

/* ── Image Upload (local preview, upload on submit) ── */
function ImageUpload({ value = [], onChange, accentColor = "#dc2626" }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  // value = array of { file: File, preview: string }
  const addFiles = useCallback((files) => {
    const allowed = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (!allowed.length) { toast.error("Faqat rasm fayllar qabul qilinadi"); return; }
    if (value.length + allowed.length > 5) {
      toast.error(`Maksimal 5 ta rasm. ${5 - value.length} ta qo'shish mumkin`);
      return;
    }
    const oversized = allowed.filter(f => f.size > 5 * 1024 * 1024);
    if (oversized.length) { toast.error("Har bir rasm 5MB dan kichik bo'lishi kerak"); return; }

    const newItems = allowed.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    onChange([...value, ...newItems]);
  }, [value, onChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const remove = (idx) => {
    const next = value.filter((_, i) => i !== idx);
    // revoke old object URL to free memory
    URL.revokeObjectURL(value[idx].preview);
    onChange(next);
  };

  return (
    <div>
      {value.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
          {value.map((item, i) => (
            <div key={i} style={{ position: "relative", width: 82, height: 82 }}>
              <img
                src={item.preview}
                alt=""
                style={{ width: 82, height: 82, borderRadius: 10, objectFit: "cover", border: "1.5px solid #e5e7eb" }}
              />
              <button type="button" onClick={() => remove(i)} style={{
                position: "absolute", top: -6, right: -6,
                width: 20, height: 20, borderRadius: "50%",
                background: "#ef4444", border: "2px solid #fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <LuX size={10} color="#fff" strokeWidth={3} />
              </button>
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "rgba(0,0,0,0.45)", borderRadius: "0 0 8px 8px",
                fontSize: 9, color: "#fff", textAlign: "center", padding: "2px 0",
              }}>
                {(item.file.size / 1024).toFixed(0)} KB
              </div>
            </div>
          ))}
        </div>
      )}

      {value.length < 5 && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          style={{
            height: 96, border: `2px dashed ${dragging ? accentColor : "#e5e7eb"}`,
            borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
            gap: 10, cursor: "pointer",
            background: dragging ? `${accentColor}08` : "#fafafa",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.background = `${accentColor}06`; }}
          onMouseLeave={e => { if (!dragging) { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fafafa"; } }}
        >
          <LuCloudUpload size={22} style={{ color: accentColor, flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 12.5, color: "#374151", margin: 0, fontWeight: 600 }}>
              Rasm yuklash uchun bosing yoki sudrang
            </p>
            <p style={{ fontSize: 11, color: "#9ca3af", margin: "3px 0 0" }}>
              JPG, PNG, WEBP · max 5 MB · {5 - value.length} ta joy qoldi
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpg,image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={e => { addFiles(e.target.files); e.target.value = ""; }}
      />
    </div>
  );
}

/* ── Section header ── */
function SectionTitle({ label, color = "#dc2626" }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color, marginBottom: 16 }}>
      {label}
    </div>
  );
}

/* ── Submit button ── */
function SubmitBtn({ loading, color = "#dc2626", shadow = "rgba(220,38,38,0.35)" }) {
  return (
    <button type="submit" disabled={loading} style={{
      padding: "14px", borderRadius: 12,
      background: loading ? "#e5e7eb" : `linear-gradient(135deg,${color},${color}cc)`,
      color: loading ? "#9ca3af" : "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
      fontSize: 15, fontWeight: 700, fontFamily: "inherit",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      boxShadow: loading ? "none" : `0 4px 20px ${shadow}`,
      transition: "all 0.2s",
    }}>
      {loading
        ? <><LuLoader size={16} style={{ animation: "spin 1s linear infinite" }} /> Yuborilmoqda...</>
        : <><LuSend size={16} /> E'lonni joylash</>
      }
    </button>
  );
}

/* ── Blogger form ── */
function BloggerForm({ onSubmit, loading }) {
  const [images, setImages] = useState([]);
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(bloggerSchema),
    defaultValues: {
      name: "", phone: "", platforms: [], services: [], niche: [],
      followers: "", pricePost: "", priceStory: "", priceVideo: "",
      portfolio: "", about: "",
    },
  });

  const submitWithImages = (data) => onSubmit({ ...data, images });

  return (
    <form onSubmit={handleSubmit(submitWithImages)} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* Shaxsiy ma'lumot */}
      <div>
        <SectionTitle label="Shaxsiy ma'lumotlar" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Ism-familiya" required error={errors.name?.message}>
            <input
              {...register("name")}
              style={errors.name ? INP_ERR : INP}
              placeholder="To'liq ism"
            />
          </Field>
          <Field label="Telefon" required error={errors.phone?.message}>
            <input
              {...register("phone")}
              style={errors.phone ? INP_ERR : INP}
              placeholder="+998 90 000 00 00"
              type="tel"
            />
          </Field>
        </div>
      </div>

      {/* Platformalar */}
      <div>
        <SectionTitle label="Platformalar" />
        <Field label="Qaysi platformalarda faolsiz?" required error={errors.platforms?.message}>
          <Controller
            name="platforms"
            control={control}
            render={({ field }) => (
              <PlatformChips
                selected={field.value}
                onChange={field.onChange}
                hasError={!!errors.platforms}
              />
            )}
          />
        </Field>
      </div>

      {/* Auditoriya */}
      <div>
        <SectionTitle label="Auditoriya & yo'nalish" />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Jami obunachilar soni" required error={errors.followers?.message}>
            <select
              {...register("followers")}
              style={errors.followers ? { ...INP_ERR, color: "#111827" } : INP}
            >
              <option value="">Tanlang...</option>
              {FOLLOWER_RANGES.map(r => <option key={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Nisha (yo'nalishingiz)" required hint="(bir nechtasini tanlang)" error={errors.niche?.message}>
            <Controller
              name="niche"
              control={control}
              render={({ field }) => (
                <Chips
                  options={BLOGGER_NICHES}
                  selected={field.value}
                  onChange={field.onChange}
                  hasError={!!errors.niche}
                />
              )}
            />
          </Field>
        </div>
      </div>

      {/* Xizmatlar */}
      <div>
        <SectionTitle label="Xizmatlar & narxlar" />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Qanday reklama xizmatlarini taklif qilasiz?" required error={errors.services?.message}>
            <Controller
              name="services"
              control={control}
              render={({ field }) => (
                <Chips
                  options={BLOGGER_SERVICES}
                  selected={field.value}
                  onChange={field.onChange}
                  hasError={!!errors.services}
                />
              )}
            />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <Field label="Post narxi" required hint="(so'm)" error={errors.pricePost?.message}>
              <input
                {...register("pricePost")}
                style={errors.pricePost ? INP_ERR : INP}
                placeholder="500 000"
              />
            </Field>
            <Field label="Story narxi" hint="(so'm)">
              <input {...register("priceStory")} style={INP} placeholder="200 000" />
            </Field>
            <Field label="Video narxi" hint="(so'm)">
              <input {...register("priceVideo")} style={INP} placeholder="1 500 000" />
            </Field>
          </div>
        </div>
      </div>

      {/* Qo'shimcha */}
      <div>
        <SectionTitle label="Qo'shimcha ma'lumot" />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Portfolio yoki namuna" hint="(link)" error={errors.portfolio?.message}>
            <input
              {...register("portfolio")}
              style={errors.portfolio ? INP_ERR : INP}
              placeholder="https://..."
            />
          </Field>
          <Field label="O'zingiz haqida qisqacha" required error={errors.about?.message}>
            <textarea
              {...register("about")}
              style={errors.about ? { ...INP_ERR, resize: "vertical" } : { ...INP, resize: "vertical" }}
              rows={4}
              placeholder="Nima haqida post qilasiz, auditoriyangiznig xususiyatlari, avvalgi hamkorlaringiz..."
            />
          </Field>
          <Field label="Rasm / Screenshoot" hint="(ixtiyoriy)">
            <ImageUpload value={images} onChange={setImages} accentColor="#dc2626" />
          </Field>
        </div>
      </div>

      <SubmitBtn loading={loading} />
    </form>
  );
}

/* ── Business form ── */
function BusinessForm({ onSubmit, loading }) {
  const [images, setImages] = useState([]);
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(businessSchema),
    defaultValues: {
      companyName: "", contactName: "", phone: "",
      businessType: "", description: "", product: "",
      platforms: [], bloggerTypes: [],
      targetAudience: "", budget: "", duration: "",
      location: "", goal: "", extra: "",
    },
  });

  const submitWithImages = (data) => onSubmit({ ...data, images });

  return (
    <form onSubmit={handleSubmit(submitWithImages)} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* Kompaniya */}
      <div>
        <SectionTitle label="Kompaniya ma'lumotlari" color="#2563eb" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Kompaniya / Brend nomi" required error={errors.companyName?.message}>
            <input
              {...register("companyName")}
              style={errors.companyName ? INP_ERR : INP}
              placeholder="Masalan: Shirin Zavodi"
            />
          </Field>
          <Field label="Aloqa shaxsi" required error={errors.contactName?.message}>
            <input
              {...register("contactName")}
              style={errors.contactName ? INP_ERR : INP}
              placeholder="Ism-familiya"
            />
          </Field>
          <Field label="Telefon" required error={errors.phone?.message}>
            <input
              {...register("phone")}
              style={errors.phone ? INP_ERR : INP}
              placeholder="+998 90 000 00 00"
              type="tel"
            />
          </Field>
          <Field label="Faoliyat turi" required error={errors.businessType?.message}>
            <select
              {...register("businessType")}
              style={errors.businessType ? { ...INP_ERR, color: "#111827" } : INP}
            >
              <option value="">Tanlang...</option>
              {BUSINESS_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
        </div>
      </div>

      {/* Mahsulot */}
      <div>
        <SectionTitle label="Mahsulot / xizmat" color="#2563eb" />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Reklama qilinadigan mahsulot / xizmat" required error={errors.product?.message}>
            <input
              {...register("product")}
              style={errors.product ? INP_ERR : INP}
              placeholder="Masalan: Yangi konfet liniyamiz — Shirin Premium"
            />
          </Field>
          <Field label="Mahsulot / xizmat haqida batafsil" required error={errors.description?.message}>
            <textarea
              {...register("description")}
              style={errors.description ? { ...INP_ERR, resize: "vertical" } : { ...INP, resize: "vertical" }}
              rows={4}
              placeholder="Mahsulot qanday muammoni hal qiladi? Afzalliklari nima? Narxi, sifati, noyob xususiyatlari..."
            />
          </Field>
        </div>
      </div>

      {/* Kampaniya */}
      <div>
        <SectionTitle label="Kampaniya talablari" color="#2563eb" />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Qaysi platformalarda reklama kerak?" required error={errors.platforms?.message}>
            <Controller
              name="platforms"
              control={control}
              render={({ field }) => (
                <PlatformChips
                  selected={field.value}
                  onChange={field.onChange}
                  hasError={!!errors.platforms}
                />
              )}
            />
          </Field>
          <Field label="Qanday bloger kerak?" required hint="(bir nechtasini tanlang)" error={errors.bloggerTypes?.message}>
            <Controller
              name="bloggerTypes"
              control={control}
              render={({ field }) => (
                <Chips
                  options={BLOGGER_TYPES_NEEDED}
                  selected={field.value}
                  onChange={field.onChange}
                  hasError={!!errors.bloggerTypes}
                />
              )}
            />
          </Field>
          <Field label="Maqsadli auditoriya" required hint="(kim sotib olishi kerak)" error={errors.targetAudience?.message}>
            <input
              {...register("targetAudience")}
              style={errors.targetAudience ? INP_ERR : INP}
              placeholder="Masalan: 20–35 yosh, Toshkent, oilali ayollar"
            />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <Field label="Byudjet" required error={errors.budget?.message}>
              <select
                {...register("budget")}
                style={errors.budget ? { ...INP_ERR, color: "#111827" } : INP}
              >
                <option value="">Tanlang...</option>
                {BUDGET_RANGES.map(b => <option key={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="Kampaniya davomiyligi" required error={errors.duration?.message}>
              <select
                {...register("duration")}
                style={errors.duration ? { ...INP_ERR, color: "#111827" } : INP}
              >
                <option value="">Tanlang...</option>
                {DURATIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Joylashuv" required error={errors.location?.message}>
              <input
                {...register("location")}
                style={errors.location ? INP_ERR : INP}
                placeholder="Shahar / Viloyat"
              />
            </Field>
          </div>
        </div>
      </div>

      {/* Qo'shimcha */}
      <div>
        <SectionTitle label="Qo'shimcha" color="#2563eb" />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Kampaniya maqsadi" required error={errors.goal?.message}>
            <input
              {...register("goal")}
              style={errors.goal ? INP_ERR : INP}
              placeholder="Masalan: brend taniqliligini oshirish, sotuv, obunachilarni jalb qilish"
            />
          </Field>
          <Field label="Boshqa qo'shimcha talablar" hint="(ixtiyoriy)">
            <textarea
              {...register("extra")}
              style={{ ...INP, resize: "vertical" }}
              rows={3}
              placeholder="Bloger talablari, ko'rsatmalar, maxsus shartlar..."
            />
          </Field>
          <Field label="Mahsulot rasmlari / reklama materiallari" hint="(ixtiyoriy)">
            <ImageUpload value={images} onChange={setImages} accentColor="#2563eb" />
          </Field>
        </div>
      </div>

      <SubmitBtn loading={loading} color="#2563eb" shadow="rgba(37,99,235,0.35)" />
    </form>
  );
}

/* ══ MAIN ══════════════════════════════════════════════════════ */
export default function ElonBerish() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  const [step, setStep]           = useState(1);
  const [type, setType]           = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const handleSubmit = async (formData) => {
    if (!isLoggedIn()) {
      toast.error("E'lon berish uchun tizimga kiring!");
      navigate("/kirish");
      return;
    }

    setLoading(true);
    try {
      // 1-qadam: rasmlar bo'lsa /upload ga yuborish → cloudinary URL lar olish
      let imageUrls = [];
      const imageItems = formData.images || [];
      if (imageItems.length > 0) {
        const fd = new FormData();
        imageItems.forEach(item => fd.append("images", item.file));
        const uploadRes = await api.post("/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrls = uploadRes.data.urls || [];
      }

      // 2-qadam: /ads ga JSON yuborish
      let body = {};

      if (type === "blogger") {
        const services = [...new Set(formData.services.map(s => SERVICE_MAP[s]).filter(Boolean))];
        const niche    = formData.niche.map(n => NICHE_MAP[n]).filter(Boolean);

        body = {
          type:          "blogger",
          title:         formData.about?.slice(0, 80) || "Bloger e'loni",
          description:   formData.about || "",
          platforms:     formData.platforms,
          services,
          niche,
          followersRange: FOLLOWER_RANGE_MAP[formData.followers] || undefined,
          pricing: {
            post:  formData.pricePost  ? Number(formData.pricePost.replace(/\s/g, ""))  : undefined,
            story: formData.priceStory ? Number(formData.priceStory.replace(/\s/g, "")) : undefined,
            video: formData.priceVideo ? Number(formData.priceVideo.replace(/\s/g, "")) : undefined,
          },
          portfolio: formData.portfolio || undefined,
          phone:     formData.phone,
          images:    imageUrls,
        };
      } else {
        body = {
          type:               "business",
          companyName:        formData.companyName,
          contactPerson:      formData.contactName,
          phone:              formData.phone,
          businessType:       BUSINESS_TYPE_MAP[formData.businessType] || "Other",
          productName:        formData.product,
          productDescription: formData.description,
          targetPlatforms:    formData.platforms,
          bloggerTypesNeeded: formData.bloggerTypes.map(b => BLOGGER_TYPE_MAP[b]).filter(Boolean),
          targetAudience:     formData.targetAudience || undefined,
          budget:             formData.budget ? { range: BUDGET_MAP[formData.budget] } : undefined,
          campaignDuration:   formData.duration || undefined,
          campaignGoal:       formData.goal || undefined,
          requirements:       formData.extra || undefined,
          location:           formData.location || undefined,
          images:             imageUrls,
        };
      }

      await api.post("/ads", body);
      setSubmitted(true);
    } catch {
      // errors handled by api interceptor
    } finally {
      setLoading(false);
    }
  };

  /* ── Success screen ── */
  if (submitted) return (
    <div style={{ textAlign: "center", padding: "80px 20px", fontFamily: "'Inter', sans-serif", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <LuCircleCheck size={36} style={{ color: "#16a34a" }} strokeWidth={2} />
      </div>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 10 }}>
        E'lon muvaffaqiyatli yuborildi!
      </h2>
      <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 28, lineHeight: 1.65 }}>
        E'loningiz ko'rib chiqilgandan so'ng (24 soat ichida) nashr etiladi va
        {type === "blogger" ? " biznesmenlar siz bilan bog'lana boshlaydi." : " blogerlar zayavka yubora boshlaydi."}
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button
          onClick={() => { setSubmitted(false); setStep(1); setType(null); }}
          style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)", color: "#fff", padding: "12px 24px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "inherit" }}
        >
          Yangi e'lon berish
        </button>
        <a href="/profil?tab=my-ads" style={{ padding: "12px 24px", borderRadius: 12, background: "#eff6ff", border: "1.5px solid #bfdbfe", color: "#2563eb", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", fontFamily: "inherit" }}>
          E'lonlarimni ko'rish
        </a>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 760, margin: "0 auto", paddingBottom: 60 }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 32 }}>
        {step === 2 && (
          <button onClick={() => setStep(1)} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "none", border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 600, color: "#6b7280",
            fontFamily: "inherit", marginBottom: 16, padding: 0,
          }}>
            <LuArrowLeft size={15} /> Orqaga
          </button>
        )}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fef2f2", color: "#dc2626", fontSize: 10, fontWeight: 700, letterSpacing: "2px", padding: "5px 14px", borderRadius: 100, marginBottom: 14, textTransform: "uppercase" }}>
          E'LON BERISH
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>
          {step === 1 ? "Siz kim sifatida e'lon berasiz?" : (
            type === "blogger" ? "Bloger sifatida e'lon joylashtiring" : "Reklama beruvchi sifatida e'lon joylashtiring"
          )}
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
          {step === 1
            ? "E'lon turini tanlang — har biri uchun maxsus forma tayyorlanadi"
            : "Barcha maydonlarni to'ldiring, e'loningiz 24 soat ichida nashr etiladi"}
        </p>
      </div>

      {/* ── Auth warning ── */}
      {!isLoggedIn() && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 12, padding: "12px 16px", marginBottom: 24 }}>
          <LuLock size={16} style={{ color: "#d97706", flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: "#92400e" }}>
            E'lon berish uchun{" "}
            <a href="/kirish" style={{ color: "#dc2626", fontWeight: 700, textDecoration: "none" }}>tizimga kiring</a>
            {" "}yoki{" "}
            <a href="/auth" style={{ color: "#dc2626", fontWeight: 700, textDecoration: "none" }}>ro'yxatdan o'ting</a>
          </span>
        </div>
      )}

      {/* ── Progress ── */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 32 }}>
        {[1, 2].map(s => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: step >= s ? "#dc2626" : "#f3f4f6", color: step >= s ? "#fff" : "#9ca3af" }}>
              {step > s ? <LuCheck size={13} strokeWidth={3} /> : s}
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: step >= s ? "#111827" : "#9ca3af" }}>
              {s === 1 ? "Tur tanlash" : "Forma to'ldirish"}
            </span>
            {s < 2 && <div style={{ width: 32, height: 2, background: step > 1 ? "#dc2626" : "#e5e7eb", borderRadius: 2 }} />}
          </div>
        ))}
      </div>

      {/* ── Step 1: Type select ── */}
      {step === 1 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <button
            onClick={() => { setType("blogger"); setStep(2); }}
            style={{ padding: "36px 28px", borderRadius: 20, border: "2px solid #e5e7eb", background: "#fff", cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.2s", display: "flex", flexDirection: "column", gap: 16 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#dc2626"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(220,38,38,0.12)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
          >
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "#fef2f2", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LuUsers size={26} />
            </div>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 19, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Men blogeriman</div>
              <p style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.65, margin: 0 }}>
                Reklama xizmatlarimni taklif qilmoqchiman. Post, story, reels, video — narxlarim va shartlarimni ko'rsataman.
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["Post", "Story", "Reels", "Video", "Chegirma"].map(t => (
                <span key={t} style={{ padding: "3px 10px", borderRadius: 100, background: "#fef2f2", color: "#dc2626", fontSize: 11, fontWeight: 600, border: "1px solid #fecaca" }}>{t}</span>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#dc2626", fontSize: 13, fontWeight: 700 }}>
              Davom etish <LuArrowRight size={15} />
            </div>
          </button>

          <button
            onClick={() => { setType("business"); setStep(2); }}
            style={{ padding: "36px 28px", borderRadius: 20, border: "2px solid #e5e7eb", background: "#fff", cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.2s", display: "flex", flexDirection: "column", gap: 16 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(37,99,235,0.12)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
          >
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LuBuilding2 size={26} />
            </div>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 19, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Men biznesmenam</div>
              <p style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.65, margin: 0 }}>
                Mahsulot yoki xizmatimni reklama qildirish uchun bloger izlamoqdaman. Byudjet va talablarni ko'rsataman.
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["Zavod", "Do'kon", "Restoran", "Salon", "Startup"].map(t => (
                <span key={t} style={{ padding: "3px 10px", borderRadius: 100, background: "#eff6ff", color: "#2563eb", fontSize: 11, fontWeight: 600, border: "1px solid #bfdbfe" }}>{t}</span>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#2563eb", fontSize: 13, fontWeight: 700 }}>
              Davom etish <LuArrowRight size={15} />
            </div>
          </button>
        </div>
      )}

      {/* ── Step 2: Form ── */}
      {step === 2 && (
        <div style={{
          background: "#fff",
          border: `2px solid ${type === "blogger" ? "#fecaca" : "#bfdbfe"}`,
          borderRadius: 20, padding: "32px 28px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 12, marginBottom: 28, background: type === "blogger" ? "#fef2f2" : "#eff6ff", border: `1.5px solid ${type === "blogger" ? "#fecaca" : "#bfdbfe"}` }}>
            {type === "blogger"
              ? <LuUsers size={15} style={{ color: "#dc2626" }} />
              : <LuBuilding2 size={15} style={{ color: "#2563eb" }} />
            }
            <span style={{ fontSize: 13, fontWeight: 700, color: type === "blogger" ? "#dc2626" : "#2563eb" }}>
              {type === "blogger" ? "Bloger e'loni" : "Biznes e'loni (bloger izlash)"}
            </span>
          </div>

          {type === "blogger"
            ? <BloggerForm onSubmit={handleSubmit} loading={loading} />
            : <BusinessForm onSubmit={handleSubmit} loading={loading} />
          }
        </div>
      )}
    </div>
  );
}
