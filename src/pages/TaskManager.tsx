import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useAuth } from '../auth/AuthContext';
import { useTasks, Task } from '../hooks/useTasks';
import { TaskItem } from '../components/TaskItem';
import { TaskForm } from '../components/TaskForm';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { PlusIcon, LogoutIcon, SearchIcon, XMarkIcon, EmptyStateIcon } from '../components/ui/Icons';

export const TaskManager = () => {
  const { user, logout } = useAuth();
  const { tasks, isLoading, saveTasks } = useTasks(user!.username);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<number>>(new Set());
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });
  
  const sortedTasks = useMemo(() => [...tasks].sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1)), [tasks]);
  const filteredTasks = useMemo(() => sortedTasks.filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase())), [sortedTasks, searchTerm]);
  
  const rowVirtualizer = useVirtualizer({ count: filteredTasks.length, getScrollElement: () => parentRef.current, estimateSize: () => 88, overscan: 5, });
  
  useEffect(() => { if (selectedTaskIds.size === 0) setIsMultiSelectMode(false); }, [selectedTaskIds]);

  const handleStartMultiSelect = (task: Task) => { setIsMultiSelectMode(true); setSelectedTaskIds(new Set([task.id])); };
  const handleSelectTask = (taskId: number) => { setSelectedTaskIds(prev => { const newSet = new Set(prev); if (newSet.has(taskId)) newSet.delete(taskId); else newSet.add(taskId); return newSet; }); };
  const cancelMultiSelect = () => { setIsMultiSelectMode(false); setSelectedTaskIds(new Set()); };

  const handleCreateTask = (data: {title: string, description: string}) => { const newTask = { ...data, completed: false, id: Date.now() }; saveTasks([newTask, ...tasks]); setCreateModalOpen(false); showToast('وظیفه با موفقیت ایجاد شد.', 'success'); };
  const handleViewClick = (task: Task) => { setSelectedTask(task); setDetailsModalOpen(true); };
  const handleEditClick = (task: Task) => { setSelectedTask(task); setEditModalOpen(true); };
  const handleUpdateTask = (data: {title: string, description: string}) => { if (!selectedTask) return; const updatedTasks = tasks.map(t => t.id === selectedTask.id ? { ...t, ...data } : t); saveTasks(updatedTasks); setEditModalOpen(false); setSelectedTask(null); showToast('وظیفه با موفقیت به‌روزرسانی شد.', 'success'); };
  const handleToggleStatus = (taskToToggle: Task) => { const updatedTasks = tasks.map(t => t.id === taskToToggle.id ? { ...t, completed: !t.completed } : t); saveTasks(updatedTasks); };
  const handleDeleteClick = (task: Task) => { setSelectedTask(task); setDeleteModalOpen(true); };
  const confirmDelete = () => { if (!selectedTask) return; const updatedTasks = tasks.filter(t => t.id !== selectedTask.id); saveTasks(updatedTasks); const newSelected = new Set(selectedTaskIds); newSelected.delete(selectedTask.id); setSelectedTaskIds(newSelected); setDeleteModalOpen(false); setSelectedTask(null); showToast('وظیفه حذف شد.', 'success'); };
  const confirmBulkDelete = () => { const updatedTasks = tasks.filter(t => !selectedTaskIds.has(t.id)); saveTasks(updatedTasks); setSelectedTaskIds(new Set()); setBulkDeleteModalOpen(false); showToast(`${selectedTaskIds.size} وظیفه حذف شد.`, 'success'); };

  return (
    <div className="min-h-screen font-sans text-gray-800 dark:text-gray-200 bg-fixed bg-cover bg-center animate-gradient-bg" style={{backgroundImage: 'linear-gradient(to top right, #f3e7e9 0%, #e3eeff 100%)'}} dir="rtl">
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="flex flex-col items-center sm:items-start">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">مدیریت وظایف</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">خوش آمدید، {user?.username}!</p>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse mt-4 sm:mt-0">
            <button onClick={() => setCreateModalOpen(true)} className="flex items-center space-x-2 rtl:space-x-reverse px-5 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105"><PlusIcon /><span>وظیفه جدید</span></button>
            <button onClick={logout} className="p-3 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105" aria-label="خروج"><LogoutIcon /></button>
          </div>
        </header>

        <div className="mb-6 relative">
            <input type="text" placeholder="جستجوی وظایف..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border-2 border-transparent rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/60 dark:bg-gray-700/60 dark:border-gray-600 dark:text-white" />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div>
        </div>

        <div className={`transition-all duration-300 overflow-hidden ${isMultiSelectMode ? 'max-h-40' : 'max-h-0'}`}>
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-xl shadow-md p-3 mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <button onClick={cancelMultiSelect} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><XMarkIcon /></button>
                    <span className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">{selectedTaskIds.size} مورد انتخاب شده</span>
                </div>
                <button onClick={() => setBulkDeleteModalOpen(true)} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors">حذف موارد انتخاب شده</button>
            </div>
        </div>

        <main ref={parentRef} className="h-[60vh] overflow-y-auto pr-2">
          {isLoading ? ( <div className="flex justify-center items-center h-full"><p>بارگذاری...</p></div> ) 
          : (
            <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
              {rowVirtualizer.getVirtualItems().length > 0 ? rowVirtualizer.getVirtualItems().map(virtualItem => {
                const task = filteredTasks[virtualItem.index];
                if (!task) return null;
                return ( <TaskItem key={task.id} task={task} isSelected={selectedTaskIds.has(task.id)} isMultiSelectMode={isMultiSelectMode} onSelect={handleSelectTask} onStartMultiSelect={handleStartMultiSelect} onView={handleViewClick} onEdit={handleEditClick} onDelete={handleDeleteClick} onToggleStatus={handleToggleStatus} style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${virtualItem.start}px)`, paddingBottom: '1rem' }} /> );
              }) : (
                <div className="text-center py-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg flex flex-col items-center">
                    <EmptyStateIcon />
                    <p className="mt-4 text-lg font-semibold">{searchTerm ? 'هیچ وظیفه‌ای با این مشخصات یافت نشد.' : 'لیست شما خالی است!'}</p>
                    <p className="text-gray-500">اولین وظیفه خود را ایجاد کنید.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      
      <Modal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} title="ایجاد وظیفه جدید"> <TaskForm onSubmit={handleCreateTask} buttonText="ایجاد" /> </Modal>
      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title="ویرایش وظیفه"> <TaskForm onSubmit={handleUpdateTask} initialData={selectedTask || {}} buttonText="ذخیره تغییرات" /> </Modal>
      <Modal isOpen={isDetailsModalOpen} onClose={() => setDetailsModalOpen(false)} title="جزئیات وظیفه"> <div className="space-y-4"> <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedTask?.title}</h3> <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{selectedTask?.description || 'توضیحاتی برای این وظیفه ثبت نشده است.'}</p> </div> </Modal>
      <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="تایید حذف"> <div className="text-center"> <p className="mb-6 text-lg">آیا از حذف وظیفه "{selectedTask?.title}" مطمئن هستید؟</p> <div className="flex justify-center space-x-4 rtl:space-x-reverse"> <button onClick={() => setDeleteModalOpen(false)} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"> انصراف </button> <button onClick={confirmDelete} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"> حذف </button> </div> </div> </Modal>
      <Modal isOpen={isBulkDeleteModalOpen} onClose={() => setBulkDeleteModalOpen(false)} title="تایید حذف گروهی"> <div className="text-center"> <p className="mb-6 text-lg">آیا از حذف {selectedTaskIds.size} وظیفه انتخاب شده مطمئن هستید؟</p> <div className="flex justify-center space-x-4 rtl:space-x-reverse"> <button onClick={() => setBulkDeleteModalOpen(false)} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"> انصراف </button> <button onClick={confirmBulkDelete} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"> حذف همه </button> </div> </div> </Modal>
    </div>
  );
};
