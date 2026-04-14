import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaTelegramPlane, FaInstagram, FaMapMarkerAlt, FaUser, FaBriefcase } from 'react-icons/fa';
import { toast } from 'react-toastify';

const schema = yup.object({
  name: yup.string().required('Ismingizni kiriting'),
  email: yup.string().email('Email xato').required('Email majburiy'),
  phone: yup.string().optional(),
  message: yup.string().min(10, 'Xabar juda qisqa').required('Xabarni yozing'),
}).required();

const roles = [
  {
    id: 'blogger',
    label: 'Blogger',
    sub: 'Reklama joylashmoqchi',
    icon: <FaUser size={20} />,
    hint: 'Bloggerlar uchun: biz sizning auditoriyangizga mos brendlarni topamiz',
    placeholder: 'Blogingiz haqida yozing...',
  },
  {
    id: 'business',
    label: 'Biznesmen',
    sub: "Mahsulotni targ'ib qilmoqchi",
    icon: <FaBriefcase size={20} />,
    hint: "Biznesmenlar uchun: mahsulotingizni eng mos bloggerlarga ulap beramiz",
    placeholder: 'Mahsulot yoki xizmatingiz haqida yozing...',
  },
];

const RoleCard = ({ role, selected, onSelect }) => (
  <motion.button
    type="button"
    onClick={() => onSelect(role.id)}
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.97 }}
    className={`flex-1 relative flex flex-col items-center gap-2.5 p-4 rounded-2xl border-[1.5px] cursor-pointer transition-all duration-200
      ${selected
        ? 'border-[#e31e24] bg-red-50'
        : 'border-red-100 bg-white hover:border-[#e31e24] hover:bg-red-50/40'
      }`}
  >
    <div className={`absolute top-2.5 right-2.5 w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center transition-all duration-200
      ${selected ? 'bg-[#e31e24] border-[#e31e24]' : 'border-red-200'}`}>
      {selected && (
        <svg width="10" height="10" fill="white" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      )}
    </div>

    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
      ${selected ? 'bg-[#e31e24] text-white' : 'bg-red-100 text-[#e31e24]'}`}>
      {role.icon}
    </div>

    <div>
      <p className="text-sm font-medium text-gray-800 text-center">{role.label}</p>
      <p className="text-[11px] text-gray-400 text-center leading-tight mt-0.5">{role.sub}</p>
    </div>
  </motion.button>
);

const Contact = () => {
  const [selectedRole, setSelectedRole] = useState('blogger');
  const activeRole = roles.find(r => r.id === selectedRole);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    await new Promise(r => setTimeout(r, 1200));
    toast.success('Xabaringiz yuborildi!');
    reset();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 md:p-10 bg-red-50/30">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="max-w-5xl w-full bg-white rounded-[1.5rem] overflow-hidden border border-red-100 flex flex-col md:flex-row"
        style={{ boxShadow: '0 8px 40px rgba(227,30,36,0.07)' }}
      >
        <div className="md:w-[300px] flex-shrink-0 bg-[#e31e24] p-10 flex flex-col justify-between">
          <div>
            <div className="w-10 h-[3px] bg-white/40 rounded-full mb-6" />
            <h2 className="text-2xl font-medium text-white mb-2">Aloqa</h2>
            <p className="text-white/70 text-sm leading-relaxed mb-8">
              Biz bilan bog'laning va reklamangizni samarali qiling!
            </p>
            <div className="flex flex-col gap-1">
              {[
                { icon: <FaPhoneAlt size={13}/>, text: '+998 71 200 00 00' },
                { icon: <FaEnvelope size={13}/>, text: 'info@addblogger.uz' },
                { icon: <FaMapMarkerAlt size={13}/>, text: "Toshkent, O'zbekiston" },
              ].map(({ icon, text }, i) => (
                <motion.div key={i} whileHover={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-default transition-all">
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white flex-shrink-0">
                    {icon}
                  </div>
                  <span className="text-white text-sm">{text}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <div className="h-px bg-white/20 my-5" />
            <p className="text-white/50 text-[11px] tracking-widest uppercase mb-3">Ijtimoiy tarmoqlar</p>
            <div className="flex gap-2">
              {[FaTelegramPlane, FaInstagram].map((Icon, i) => (
                <motion.a key={i} href="#" whileHover={{ y: -2, backgroundColor: 'rgba(255,255,255,0.28)' }}
                  className="w-10 h-10 rounded-xl bg-white/12 flex items-center justify-center text-white transition-all">
                  <Icon size={17}/>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 md:p-12 bg-white">
          <div className="mb-6">
            <h3 className="text-xl font-medium text-gray-800 mb-1">Xabar yuborish</h3>
            <p className="text-sm text-gray-400">Barcha maydonlarni to'ldiring, tez javob beramiz</p>
          </div>

          <label className="block text-xs text-gray-400 tracking-wider uppercase mb-2.5">Siz kimsiz?</label>
          <div className="flex gap-3 mb-4">
            {roles.map(role => (
              <RoleCard key={role.id} role={role} selected={selectedRole === role.id} onSelect={setSelectedRole} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedRole}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 mb-5"
            >
              <svg className="mt-0.5 flex-shrink-0" width="14" height="14" fill="#e31e24" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <p className="text-xs text-red-800 leading-relaxed">{activeRole.hint}</p>
            </motion.div>
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <Field label="Ism" error={errors.name}>
                <input {...register('name')} placeholder="Sardor..." className={inputClass(errors.name)} />
              </Field>
              <Field label="Email" error={errors.email}>
                <input {...register('email')} placeholder="example@mail.com" className={inputClass(errors.email)} />
              </Field>
            </div>

            <Field label="Telefon">
              <input {...register('phone')} placeholder="+998 __ ___ __ __" className={inputClass()} />
            </Field>

            <Field label="Xabar" error={errors.message}>
              <textarea
                {...register('message')}
                rows={4}
                placeholder={activeRole.placeholder}
                className={inputClass(errors.message) + ' resize-none leading-relaxed'}
              />
            </Field>

            <motion.button type="submit" disabled={isSubmitting}
              whileHover={{ backgroundColor: '#c4191f' }} whileTap={{ scale: 0.98 }}
              className="w-full bg-[#e31e24] text-white font-medium py-3.5 rounded-xl tracking-wide transition-colors disabled:opacity-60 disabled:pointer-events-none text-sm mt-1">
              {isSubmitting ? 'Yuborilmoqda...' : 'Xabarni yuborish →'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const inputClass = (error) =>
  `w-full px-4 py-3 rounded-xl border-[1.5px] text-sm text-gray-800 bg-white outline-none transition-all duration-200
   ${error ? 'border-red-400' : 'border-red-100 hover:border-[#e31e24] focus:border-[#e31e24] focus:bg-red-50/30'}`;

const Field = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs text-gray-400 tracking-wider uppercase">{label}</label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="text-xs text-red-500">{error.message}</motion.p>
      )}
    </AnimatePresence>
  </div>
);

export default Contact;