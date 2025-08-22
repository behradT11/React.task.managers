import React, { useState, createContext, useContext } from 'react';

// --- تایپ‌ها ---
interface User { username: string; password?: string; }
interface AuthContextType { user: User | null; login: (credentials: User) => Promise<{ success: boolean; message?: string; }>; logout: () => void; signup: (credentials: User) => Promise<{ success: boolean; message?: string; }>; }

// --- مدیریت احراز هویت ---
const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => { const storedUser = localStorage.getItem('user'); return storedUser ? JSON.parse(storedUser) : null; });
  const getUsers = () => JSON.parse(localStorage.getItem('app_users') || '[]');
  const saveUsers = (users: User[]) => localStorage.setItem('app_users', JSON.stringify(users));

  const login = async (credentials: User) => { const users = getUsers(); const foundUser = users.find((u: User) => u.username === credentials.username && u.password === credentials.password); if (foundUser) { const loggedInUser = { username: foundUser.username }; localStorage.setItem('user', JSON.stringify(loggedInUser)); setUser(loggedInUser); return { success: true }; } return { success: false, message: 'نام کاربری یا رمز عبور اشتباه است.' }; };
  const signup = async (credentials: User) => { const users = getUsers(); if (users.find((u: User) => u.username === credentials.username)) { return { success: false, message: 'این نام کاربری قبلا ثبت شده است.' }; } users.push(credentials); saveUsers(users); const loggedInUser = { username: credentials.username }; localStorage.setItem('user', JSON.stringify(loggedInUser)); setUser(loggedInUser); return { success: true }; };
  const logout = () => { localStorage.removeItem('user'); setUser(null); };

  return <AuthContext.Provider value={{ user, login, logout, signup }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
