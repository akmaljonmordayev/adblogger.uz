import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaTelegramPlane, FaInstagram, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Валидация
const schema = yup.object({
  name: yup.string().required('Ismingizni kiriting'),
  email: yup.string().email('Email xato').required('Email majburiy'),
  message: yup.string().min(10, 'Xabar juda qisqa').required('Xabarni yozing'),
}).required();

const Contact = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Xabaringiz yuborildi!");
    reset();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 md:p-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row"
      >
        {/* Инфо-блок (Красный) */}
        <div className="md:w-1/3 bg-[#e31e24] p-10 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-black uppercase mb-6 tracking-tight">Aloqa</h2>
            <p className="text-white/80 mb-10 text-lg">Biz bilan bog'laning va reklamangizni samarali qiling!</p>
            
            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="bg-white/20 p-3 rounded-xl"><FaPhoneAlt /></div>
                <span className="font-bold">+998 71 200 00 00</span>
              </div>
              <div className="flex items-center gap-5">
                <div className="bg-white/20 p-3 rounded-xl"><FaEnvelope /></div>
                <span className="font-bold">info@addblogger.uz</span>
              </div>
              <div className="flex items-center gap-5">
                <div className="bg-white/20 p-3 rounded-xl"><FaMapMarkerAlt /></div>
                <span className="font-bold">Toshkent, O'zbekiston</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-12">
            <a href="#" className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all text-2xl"><FaTelegramPlane /></a>
            <a href="#" className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all text-2xl"><FaInstagram /></a>
          </div>
        </div>

        {/* Форма */}
        <div className="md:w-2/3 p-8 md:p-14 bg-white">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase ml-1">Ism</label>
                <input {...register("name")} className={`w-full p-4 bg-gray-50 rounded-2xl border-2 ${errors.name ? 'border-red-400' : 'border-transparent'} focus:border-[#e31e24] outline-none transition-all`} placeholder="Sardor..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase ml-1">Email</label>
                <input {...register("email")} className={`w-full p-4 bg-gray-50 rounded-2xl border-2 ${errors.email ? 'border-red-400' : 'border-transparent'} focus:border-[#e31e24] outline-none transition-all`} placeholder="example@mail.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase ml-1">Xabar</label>
              <textarea {...register("message")} rows="5" className={`w-full p-4 bg-gray-50 rounded-2xl border-2 ${errors.message ? 'border-red-400' : 'border-transparent'} focus:border-[#e31e24] outline-none transition-all resize-none`} placeholder="Savolingizni yozing..."></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#e31e24] text-white font-black py-5 rounded-2xl shadow-xl shadow-red-200 hover:bg-[#c4191f] transition-all active:scale-[0.98] uppercase tracking-widest disabled:opacity-50"
            >
              {isSubmitting ? "Yuborilmoqda..." : "Xabarni yuborish"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;