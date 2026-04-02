import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white/80 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/20">
      <h2 className="text-3xl font-black text-center mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Tizimga kirish</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input {...register("email")} type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition" placeholder="example@mail.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
          <input {...register("password")} type="password" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition" placeholder="••••••••" />
        </div>
        <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition transform">Kirish</button>
      </form>
      <p className="mt-8 text-center text-gray-500">
        Hisobingiz yo'qmi? <Link to="/auth/register" className="text-blue-600 font-semibold hover:underline">Ro'yxatdan o'ting</Link>
      </p>
    </div>
  );
};

export default Login;
