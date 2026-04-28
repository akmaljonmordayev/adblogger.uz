import React, { useState } from 'react';

export default function Register() {
    const [activeTab, setActiveTab] = useState('login'); // 'login' yoki 'register'
    const [registerData, setRegisterData] = useState({
        ism: '',
        familiya: '',
        email: '',
        telefon: '',
        parol: '',
        kategoriya: 'Biznes / Reklama beruvchi'
    });

    const [loginData, setLoginData] = useState({
        emailOrPhone: '',
        parol: ''
    });

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        console.log('Ro\'yxatdan o\'tish:', registerData);
        // Backend'ga yuborish
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        console.log('Kirish:', loginData);
        // Backend'ga yuborish
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
                        {/* EMAIL YO KI TELEFON */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                EMAIL YOKI TELEFON
                            </label>
                            <input
                                type="text"
                                name="emailOrPhone"
                                value={loginData.emailOrPhone}
                                onChange={handleLoginChange}
                                placeholder="email@example.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* PAROL */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                PAROL
                            </label>
                            <input
                                type="password"
                                name="parol"
                                value={loginData.parol}
                                onChange={handleLoginChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-700 transition duration-300 transform hover:scale-105 mt-6"
                        >
                            Kirish
                        </button>

                        {/* Back Link */}
                        <div className="text-center mt-4">
                            <a href="#" className="text-red-600 text-sm hover:text-red-700 transition">
                                ← Bosh sahifaga qaytish
                            </a>
                        </div>
                    </form>
                )}

                {/* REGISTRATION FORMASI */}
                {activeTab === 'register' && (
                    <form onSubmit={handleRegisterSubmit} className="space-y-5">
                        {/* ISM va FAMILIYA */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    ISM
                                </label>
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
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    FAMILIYA
                                </label>
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

                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                EMAIL
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={registerData.email}
                                onChange={handleRegisterChange}
                                placeholder="email@example.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* TELEFON */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                TELEFON
                            </label>
                            <input
                                type="tel"
                                name="telefon"
                                value={registerData.telefon}
                                onChange={handleRegisterChange}
                                placeholder="+998 90 000 00 00"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* PAROL */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                PAROL
                            </label>
                            <input
                                type="password"
                                name="parol"
                                value={registerData.parol}
                                onChange={handleRegisterChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* SIZ KIMINGIZ? */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                SIZ KIMINGIZ?
                            </label>
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-700 transition duration-300 transform hover:scale-105 mt-6"
                        >
                            Ro'yxatdan o'tish
                        </button>

                        {/* Back Link */}
                        <div className="text-center mt-4">
                            <a href="#" className="text-red-600 text-sm hover:text-red-700 transition">
                                ← Bosh sahifaga qaytish
                            </a>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
