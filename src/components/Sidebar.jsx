import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, 
    Calendar, 
    Clock, 
    History, 
    Link, 
    Shield, 
    LogOut 
} from 'lucide-react';

const Sidebar = ({ onClose }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Programar', href: '/schedule', icon: Calendar },
        { name: 'Cola', href: '/queue', icon: Clock },
        { name: 'Historial', href: '/history', icon: History },
        { name: 'Conexiones', href: '/connections', icon: Link },
        { name: '2FA', href: '/two-factor-authentication', icon: Shield },
    ];

    return (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r border-gray-200">
            <div className="flex h-16 shrink-0 items-center">
                <h1 className="text-2xl font-bold text-gray-900">SocialHub</h1>
            </div>
            
            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <NavLink
                                        to={item.href}
                                        className={({ isActive }) =>
                                            `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors duration-200 ${
                                                isActive
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                            }`
                                        }
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </li>
                    
                    <li className="mt-auto">
                        <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                                {user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <span className="sr-only">Tu perfil</span>
                            <span aria-hidden="true">{user && user.name ? user.name : 'Usuario'}</span>
                        </div>
                        
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-6 py-2 text-sm font-semibold leading-6 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 flex items-center gap-x-3"
                        >
                            <LogOut className="w-5 h-5" />
                            Cerrar sesión
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
