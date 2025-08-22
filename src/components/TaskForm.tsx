import React, { useState, FormEvent } from 'react';
import { Task } from '../hooks/useTasks';

interface TaskFormProps { onSubmit: (data: {title: string, description: string}) => void; initialData?: Partial<Task>; buttonText: string; }

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialData = {}, buttonText }) => { 
    const [title, setTitle] = useState(initialData.title || ''); 
    const [description, setDescription] = useState(initialData.description || ''); 

    const handleSubmit = (e: FormEvent) => { 
        e.preventDefault(); 
        if (!title.trim()) return; 
        onSubmit({title, description}); 
        setTitle(''); 
        setDescription(''); 
    }; 

    return ( 
        <form onSubmit={handleSubmit} className="space-y-4"> 
            <div> 
                <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"> عنوان وظیفه </label> 
                <input id="task-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="مثال: تکمیل گزارش پروژه" required autoFocus /> 
            </div> 
            <div> 
                <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"> توضیحات (اختیاری) </label> 
                <textarea id="task-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="جزئیات بیشتر در مورد این وظیفه..."></textarea> 
            </div>
            <div className="flex justify-end"> 
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"> {buttonText} </button> 
            </div> 
        </form> 
    ); 
};
