import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Si no hay usuario autenticado, redirigir al login
    if (!user || !user.id) {
        navigate('/');
        return null;
    }


    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar para desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <Sidebar onClose={closeSidebar} />
            </div>

            {/* Sidebar móvil */}
            {sidebarOpen && (
                <div className="relative z-50 lg:hidden">
                    <div className="fixed inset-0 bg-gray-900/80 z-20" onClick={() => setSidebarOpen(false)} />
                    <div className="fixed flex z-30">
                        <div className="relative mr-16 flex max-w-xs flex-1 h-screen">
                            <Sidebar />
                        </div>
                    </div>
                </div>
            )}

            {/* Contenido principal */}
            <div className="lg:pl-72">
                <Navbar onMenuClick={() => setSidebarOpen(true)} />
                
                <main className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
