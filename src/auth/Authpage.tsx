import React, { useState, FormEvent } from 'react';
import { useAuth } from './AuthContext';
import { LoginIcon, UserPlusIcon } from '../components/ui/Icons';

export const AuthPage = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, signup } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (username.length < 3) { setError('نام کاربری باید حداقل ۳ حرف باشد.'); return; }
        if (password.length < 4) { setError('رمز عبور باید حداقل ۴ حرف باشد.'); return; }
        setError('');
        const response = isLoginView ? await login({ username, password }) : await signup({ username, password });
        if (!response.success) { setError(response.message || 'خطایی رخ داد.'); }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-fixed bg-cover bg-center animate-gradient-bg" style={{backgroundImage: 'linear-gradient(to top right, #f3e7e9 0%, #e3eeff 100%)'}} dir="rtl">
            <div className="w-full max-w-md p-8 space-y-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl transition-all duration-500 animate-fade-in">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">{isLoginView ? 'ورود به پنل' : 'ایجاد حساب کاربری'}</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div><input id="username" name="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="نام کاربری" /></div>
                        <div><input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="رمز عبور" /></div>
                    </div>
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105">
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">{isLoginView ? <LoginIcon /> : <UserPlusIcon />}</span>
                            {isLoginView ? 'ورود' : 'ثبت نام'}
                        </button>
                    </div>
                </form>
                <div className="text-sm text-center">
                    <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                        {isLoginView ? 'حساب کاربری ندارید؟ ثبت نام کنید' : 'قبلا ثبت نام کرده‌اید؟ وارد شوید'}
                    </button>
                </div>
            </div>
        </div>
    );
};
