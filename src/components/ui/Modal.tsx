import React from 'react';
import { CloseIcon } from './Icons';

interface ModalProps { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; }

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => { 
    return ( 
        <div className={`fixed inset-0 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}> 
            <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-md mx-auto transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`} onClick={e => e.stopPropagation()}> 
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><CloseIcon /></button>
                </div> 
                <div className="p-6">{children}</div> 
            </div> 
        </div> 
    ); 
};
