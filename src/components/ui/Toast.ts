import React, { useEffect } from 'react';

interface ToastProps { message: string; type: 'success' | 'error'; onDismiss: () => void; }

export const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => { 
    useEffect(() => { 
        const timer = setTimeout(onDismiss, 3000); 
        return () => clearTimeout(timer); 
    }, [onDismiss]); 
    
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500'; 
    
    return ( 
        <div className={`fixed bottom-5 right-5 z-50 text-white px-6 py-3 rounded-xl shadow-lg animate-toast-in ${bgColor}`}>
            {message}
        </div> 
    ); 
};
