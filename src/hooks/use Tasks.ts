import { useState, useEffect, useCallback } from 'react';

export interface Task { id: number; title: string; description?: string; completed: boolean; }

export const useTasks = (username: string) => {
  const getTasksFromStorage = useCallback(() => {
    const allTasks = JSON.parse(localStorage.getItem('app_tasks') || '{}');
    return allTasks[username] || null;
  }, [username]);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let userTasks = getTasksFromStorage();
    if (userTasks === null) { 
      userTasks = [{ id: Date.now(), title: 'به پنل مدیریت خوش آمدید!', description: 'این یک وظیفه نمونه است. برای فعال کردن حالت انتخاب چندگانه، روی این آیتم نگه دارید.', completed: false }];
    }
    setTasks(userTasks);
    setIsLoading(false);
  }, [username, getTasksFromStorage]);

  const saveTasksToStorage = (newTasks: Task[]) => {
    const allTasks = JSON.parse(localStorage.getItem('app_tasks') || '{}');
    allTasks[username] = newTasks;
    localStorage.setItem('app_tasks', JSON.stringify(allTasks));
    setTasks(newTasks);
  };

  return { tasks, isLoading, saveTasks: saveTasksToStorage };
};
