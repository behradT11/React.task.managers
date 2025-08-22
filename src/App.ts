import React from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { TaskManager } from './pages/TaskManager';
import { AuthPage } from './auth/AuthPage';

const Main = () => {
  const { user } = useAuth();
  return user ? <TaskManager /> : <AuthPage />;
};

export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}
