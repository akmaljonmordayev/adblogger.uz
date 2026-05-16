import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from '../components/ui/toast';

export default function Register() {
    const navigate = useNavigate();
    const { register: registerFn, login: loginFn } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('login');

    const [registerData, setRegisterData] = useState({
        ism: '',
        familiya: '',
        email: '',
        telefon: '',
        parol: '',
        kategoriya: 'Biznes / Reklama beruvchi'
    });

    const [loginData, setLoginData] = useState({
        email: '',
        parol: ''
    });

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({ ...prev, [name]: value }));
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
    };

    const roleMap = {
        'Blogger': 'blogger',
        'Biznes / Reklama beruvchi': 'business',
        'Shaxs': 'user',
        'Boshqa': 'user',
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (!registerData.ism || !registerData.email || !registerData.parol) {
            toast.error("Majburiy maydonlarni to'ldiring");
            return;
        }
        if (registerData.parol.length < 6) {
            toast.error("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
            return;
        }
        setLoading(true);
        try {
            const result = await registerFn({
                firstName: registerData.ism,
                lastName: registerData.familiya,
                email: registerData.email,
                phone: registerData.telefon,
                password: registerData.parol,
                role: roleMap[registerData.kategoriya] || 'user',
            });
            if (result?.status === 'pending') {
                toast.success("Arizangiz qabul qilindi! Admin tasdiqlashini kuting.");
                navigate('/pending-approval');
            } else {
                toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
                navigate('/');
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Ro'yxatdan o'tish xatosi");
        } finally {
            setLoading(false);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!loginData.email || !loginData.parol) {
            toast.error("Email va parolni kiriting");
            return;
        }
        setLoading(true);
        try {
            const user = await loginFn({ email: loginData.email, password: loginData.parol });
            toast.success(`Xush kelibsiz, ${user.firstName}!`);
            navigate(user?.role === 'admin' ? '/admin' : '/');
        } catch (err) {
            toast.error(err?.response?.data?.message || "Kirish xatosi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="text-red-600">Blog</span>
                        <span className="text-yellow-500">Hub</span>
                    </h1>
                    <p className="text-gray-500 text-sm">Platformaga xush kelibsiz</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8">
                    <button
                        onClick={() => setActiveTab('login')}
                        className={`flex-1 py-3 rounded-lg font-semibold transition ${activeTab === 'login'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Kirish
                    </button>
                    <button
                        onClick={() => setActiveTab('register')}
                        className={`flex-1 py-3 rounded-lg font-semibold transition ${activeTab === 'register'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Ro'yxatdan o'tish
                    </button>
                </div>

                {/* LOGIN FORMASI */}
                {activeTab === 'login' && (
                    <form onSubmit={handleLoginSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">EMAIL</label>
                            <input
                                type="email"
                                name="email"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                placeholder="email@example.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">PAROL</label>
                            <input
                                type="password"
                                name="parol"
                                value={loginData.parol}
                                onChange={handleLoginChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-700 transition duration-300 disabled:opacity-70 mt-6"
                        >
                            {loading ? "Kirish..." : "Kirish"}
                        </button>

                        <div className="text-center mt-4">
                            <a href="/" className="text-red-600 text-sm hover:text-red-700 transition">
                                ← Bosh sahifaga qaytish
                            </a>
                        </div>
                    </form>
                )}

                {/* REGISTRATION FORMASI */}
                {activeTab === 'register' && (
                    <form onSubmit={handleRegisterSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">ISM</label>
                                <input
                                    type="text"
                                    name="ism"
                                    value={registerData.ism}
                                    onChange={handleRegisterChange}
                                    placeholder="Ismingiz"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">FAMILIYA</label>
                                <input
                                    type="text"
                                    name="familiya"
                                    value={registerData.familiya}
                                    onChange={handleRegisterChange}
                                    placeholder="Familiyangiz"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">EMAIL</label>
                            <input
                                type="email"
                                name="email"
                                value={registerData.email}
                                onChange={handleRegisterChange}
                                placeholder="email@example.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">TELEFON</label>
                            <input
                                type="tel"
                                name="telefon"
                                value={registerData.telefon}
                                onChange={handleRegisterChange}
                                placeholder="+998 90 000 00 00"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">PAROL</label>
                            <input
                                type="password"
                                name="parol"
                                value={registerData.parol}
                                onChange={handleRegisterChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">SIZ KIMINGIZ?</label>
                            <select
                                name="kategoriya"
                                value={registerData.kategoriya}
                                onChange={handleRegisterChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition bg-white cursor-pointer"
                            >
                                <option>Biznes / Reklama beruvchi</option>
                                <option>Shaxs</option>
                                <option>Blogger</option>
                                <option>Boshqa</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-700 transition duration-300 disabled:opacity-70 mt-6"
                        >
                            {loading ? "Yuklanmoqda..." : "Ro'yxatdan o'tish"}
                        </button>

                        <div className="text-center mt-4">
                            <a href="/" className="text-red-600 text-sm hover:text-red-700 transition">
                                ← Bosh sahifaga qaytish
                            </a>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
