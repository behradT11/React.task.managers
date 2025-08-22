import React, { useRef } from 'react';
import { Task } from '../hooks/useTasks';
import { EyeIcon, EditIcon, TrashIcon, CheckCircleIcon, CircleIcon } from './ui/Icons';

interface TaskItemProps { 
    task: Task; 
    isSelected: boolean; 
    isMultiSelectMode: boolean; 
    onSelect: (id: number) => void; 
    onView: (task: Task) => void; 
    onEdit: (task: Task) => void; 
    onDelete: (task: Task) => void; 
    onToggleStatus: (task: Task) => void; 
    onStartMultiSelect: (task: Task) => void; 
    style: React.CSSProperties;
}

export const TaskItem = React.memo<TaskItemProps>(({ task, isSelected, isMultiSelectMode, onSelect, onView, onEdit, onDelete, onToggleStatus, onStartMultiSelect, style }) => {
    const timerRef = useRef<number | null>(null);

    const handleMouseDown = () => {
        timerRef.current = window.setTimeout(() => {
            onStartMultiSelect(task);
        }, 500);
    };

    const handleMouseUpOrLeave = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    };

    const handleClick = () => {
        if (isMultiSelectMode) {
            onSelect(task.id);
        } else {
            onView(task);
        }
    };

    return ( 
        <div style={style} 
             className={`flex items-center justify-between p-4 rounded-xl shadow-lg transition-all duration-500 transform hover:-translate-y-1 select-none ${isSelected ? 'bg-indigo-100 dark:bg-gray-700 ring-2 ring-indigo-500' : 'bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm'}`}
             onMouseDown={handleMouseDown}
             onMouseUp={handleMouseUpOrLeave}
             onMouseLeave={handleMouseUpOrLeave}
             onTouchStart={handleMouseDown}
             onTouchEnd={handleMouseUpOrLeave}
             onClick={handleClick}
        >
            <div className="flex items-center space-x-4 rtl:space-x-reverse flex-grow">
                <div className={`transition-all duration-300 overflow-hidden ${isMultiSelectMode ? 'w-5 opacity-100' : 'w-0 opacity-0'}`}>
                    <input type="checkbox" checked={isSelected} onChange={() => onSelect(task.id)} className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 bg-transparent" />
                </div>
                <button onClick={(e) => { e.stopPropagation(); onToggleStatus(task); }} className={`transition-colors duration-300 ${task.completed ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'}`}>{task.completed ? <CheckCircleIcon /> : <CircleIcon />}</button>
                <span className={`text-lg transition-all duration-300 ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>{task.title}</span>
            </div>
            <div className={`flex items-center space-x-1 rtl:space-x-reverse transition-opacity duration-300 ${isMultiSelectMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <button onClick={(e) => { e.stopPropagation(); onView(task); }} className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full" aria-label="مشاهده جزئیات"><EyeIcon /></button>
                <button onClick={(e) => { e.stopPropagation(); onEdit(task); }} className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-full" aria-label="ویرایش"><EditIcon /></button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(task); }} className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 rounded-full" aria-label="حذف"><TrashIcon /></button>
            </div>
        </div> 
    ); 
});
