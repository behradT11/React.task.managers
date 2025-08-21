import React, { useState, useEffect, useCallback, FormEvent, useMemo, useRef, createContext, useContext } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

// --- آیکون‌ها ---
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const EmptyStateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>;
const LoginIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const SearchIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> );
const PlusIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg> );
const EditIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg> );
const TrashIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> );
const CloseIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> );
const CheckCircleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const CircleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>);
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;

// --- تایپ‌ها ---
interface Task { id: number; title: string; description?: string; completed: boolean; }
interface User { username: string; password?: string; }
interface AuthContextType { user: User | null; login: (credentials: User) => Promise<{ success: boolean; message?: string; }>; logout: () => void; signup: (credentials: User) => Promise<{ success: boolean; message?: string; }>; }

// --- مدیریت احراز هویت ---
const AuthContext = createContext<AuthContextType>(null!);
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => { const storedUser = localStorage.getItem('user'); return storedUser ? JSON.parse(storedUser) : null; });
  const getUsers = () => JSON.parse(localStorage.getItem('app_users') || '[]');
  const saveUsers = (users: User[]) => localStorage.setItem('app_users', JSON.stringify(users));

  const login = async (credentials: User) => { const users = getUsers(); const foundUser = users.find((u: User) => u.username === credentials.username && u.password === credentials.password); if (foundUser) { const loggedInUser = { username: foundUser.username }; localStorage.setItem('user', JSON.stringify(loggedInUser)); setUser(loggedInUser); return { success: true }; } return { success: false, message: 'نام کاربری یا رمز عبور اشتباه است.' }; };
  const signup = async (credentials: User) => { const users = getUsers(); if (users.find((u: User) => u.username === credentials.username)) { return { success: false, message: 'این نام کاربری قبلا ثبت شده است.' }; } users.push(credentials); saveUsers(users); const loggedInUser = { username: credentials.username }; localStorage.setItem('user', JSON.stringify(loggedInUser)); setUser(loggedInUser); return { success: true }; };
  const logout = () => { localStorage.removeItem('user'); setUser(null); };

  return <AuthContext.Provider value={{ user, login, logout, signup }}>{children}</AuthContext.Provider>;
};
const useAuth = () => useContext(AuthContext);

// --- هوک سفارشی برای مدیریت وظایف ---
const useTasks = (username: string) => {
  const getTasksFromStorage = useCallback(() => { const allTasks = JSON.parse(localStorage.getItem('app_tasks') || '{}'); return allTasks[username] || null; }, [username]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { let userTasks = getTasksFromStorage(); if (userTasks === null) { userTasks = [{ id: Date.now(), title: 'به پنل مدیریت خوش آمدید!', description: 'این یک وظیفه نمونه است. برای فعال کردن حالت انتخاب چندگانه، روی این آیتم نگه دارید.', completed: false }]; } setTasks(userTasks); setIsLoading(false); }, [username, getTasksFromStorage]);

  const saveTasksToStorage = (newTasks: Task[]) => { const allTasks = JSON.parse(localStorage.getItem('app_tasks') || '{}'); allTasks[username] = newTasks; localStorage.setItem('app_tasks', JSON.stringify(allTasks)); setTasks(newTasks); };
  return { tasks, isLoading, saveTasks: saveTasksToStorage };
};


// --- کامپوننت‌ها ---
const Toast: React.FC<{ message: string; type: 'success' | 'error'; onDismiss: () => void; }> = ({ message, type, onDismiss }) => { useEffect(() => { const timer = setTimeout(onDismiss, 3000); return () => clearTimeout(timer); }, [onDismiss]); const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500'; return ( <div className={`fixed bottom-5 right-5 z-50 text-white px-6 py-3 rounded-xl shadow-lg animate-toast-in ${bgColor}`}>{message}</div> ); };
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; }> = ({ isOpen, onClose, title, children }) => { return ( <div className={`fixed inset-0 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}> <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-md mx-auto transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`} onClick={e => e.stopPropagation()}> <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700"><h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3><button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><CloseIcon /></button></div> <div className="p-6">{children}</div> </div> </div> ); };
const TaskForm: React.FC<{ onSubmit: (data: {title: string, description: string}) => void; initialData?: Partial<Task>; buttonText: string; }> = ({ onSubmit, initialData = {}, buttonText }) => { const [title, setTitle] = useState(initialData.title || ''); const [description, setDescription] = useState(initialData.description || ''); const handleSubmit = (e: FormEvent) => { e.preventDefault(); if (!title.trim()) return; onSubmit({title, description}); setTitle(''); setDescription(''); }; return ( <form onSubmit={handleSubmit} className="space-y-4"> <div> <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"> عنوان وظیفه </label> <input id="task-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="مثال: تکمیل گزارش پروژه" required autoFocus /> </div> <div> <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"> توضیحات (اختیاری) </label> <textarea id="task-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="جزئیات بیشتر در مورد این وظیفه..."></textarea> </div> <div className="flex justify-end"> <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"> {buttonText} </button> </div> </form> ); };

const TaskItem = React.memo<({ task: Task; isSelected: boolean; isMultiSelectMode: boolean; onSelect: (id: number) => void; onView: (task: Task) => void; onEdit: (task: Task) => void; onDelete: (task: Task) => void; onToggleStatus: (task: Task) => void; onStartMultiSelect: (task: Task) => void; style: React.CSSProperties })>(({ task, isSelected, isMultiSelectMode, onSelect, onView, onEdit, onDelete, onToggleStatus, onStartMultiSelect, style }) => {
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

// --- صفحه مدیریت وظایف ---
const TaskManager = () => {
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

// --- صفحه ورود و ثبت‌نام ---
const AuthPage = () => {
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

// --- کامپوننت اصلی برنامه ---
export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

const Main = () => {
  const { user } = useAuth();
  return user ? <TaskManager /> : <AuthPage />;
};
