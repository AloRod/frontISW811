import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
    const { user } = useAuth();

    return (
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                onClick={onMenuClick}
            >
                <span className="sr-only">Abrir sidebar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className="flex flex-1"></div>
                
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
                    
                    <div className="flex items-center gap-x-4">
                        <div className="flex items-center gap-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium">
                                {user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <span className="hidden text-sm font-medium text-gray-900 lg:block">
                                {user && user.name ? user.name : 'Usuario'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
