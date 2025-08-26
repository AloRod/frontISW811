import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from '../api/axios';
import SocialAccountsPanel from '../components/SocialAccountsPanel';
import Alert from '../components/Alert';
import { BarChart3, Link, Calendar, TrendingUp, Users, Clock } from 'lucide-react';
import config from '../config/env';

const Dashboard = () => {
    const { user } = useAuth();
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalPosts: 0,
        scheduledPosts: 0,
        publishedPosts: 0,
        queuePosts: 0
    });

    useEffect(() => {
        fetchConnections();
        fetchStats();
    }, []);

    // Recargar conexiones cuando el usuario regrese de autorización OAuth
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const authSuccess = urlParams.get('auth_success');
        
        if (authSuccess === 'true') {
            // Recargar conexiones después de una autorización exitosa
            setTimeout(() => {
                fetchConnections();
                // Limpiar parámetros de URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }, 1000);
        }
    }, []);

    const fetchConnections = async () => {
        if (!user?.id) return;
        
        try {
            setLoading(true);
            // Obtener las conexiones reales del usuario desde el backend
            const response = await axios.get(`${config.API_URL}/connections/user/${user.id}/platform-status`);
            const statusData = response.data.data || response.data;
            
            if (Array.isArray(statusData)) {
                // Filtrar solo las conexiones activas y transformar el formato
                const activeConnections = statusData
                    .filter(item => item.status === true)
                    .map(item => ({
                        id: item.id,
                        platform: item.platform,
                        status: item.status,
                        user_id: item.user_id
                    }));
                
                setConnections(activeConnections);
            } else {
                setConnections([]);
            }
        } catch (err) {
            console.error('Error fetching connections:', err);
            setError('Error al cargar las conexiones');
            setConnections([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        if (!user?.id) return;
        
        try {
            // Aquí podrías hacer una llamada al backend para obtener estadísticas reales
            // Por ahora usamos datos de ejemplo
            setStats({
                totalPosts: 12,
                scheduledPosts: 3,
                publishedPosts: 8,
                queuePosts: 1
            });
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const handleConnectionUpdate = () => {
        fetchConnections();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Panel Principal</h1>
                <p className="mt-2 text-gray-600">
                    Resumen de tu actividad y conexiones sociales.
                </p>
            </div>

            {/* Alertas */}
            {error && (
                <Alert type="error" message={error} onClose={() => setError(null)} />
            )}

            {/* Grid principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Panel de conexiones */}
                <div className="lg:col-span-1">
                    <SocialAccountsPanel 
                        connections={connections}
                        onConnectionUpdate={handleConnectionUpdate}
                    />
                </div>

                {/* Acciones rápidas */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <a
                                href="/create-post"
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
                            >
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                    <BarChart3 className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Crear Publicación</h3>
                                    <p className="text-sm text-gray-500">Publica contenido inmediatamente o programa para más tarde</p>
                                </div>
                            </a>
                            
                            <a
                                href="/schedule"
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors duration-200"
                            >
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                    <Calendar className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Configurar Horarios</h3>
                                    <p className="text-sm text-gray-500">Define tus horarios semanales de publicación</p>
                                </div>
                            </a>
                            
                            <a
                                href="/queue"
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors duration-200"
                            >
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                                    <Clock className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Gestionar Cola</h3>
                                    <p className="text-sm text-gray-500">Revisa y gestiona tus publicaciones en cola</p>
                                </div>
                            </a>
                            
                            <a
                                href="/history"
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors duration-200"
                            >
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                                    <TrendingUp className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Ver Historial</h3>
                                    <p className="text-sm text-gray-500">Revisa todas tus publicaciones anteriores</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección de estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Publicaciones</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.totalPosts}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <Link className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Conexiones Activas</p>
                            <p className="text-2xl font-semibold text-gray-900">{connections.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Programadas</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.scheduledPosts}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Clock className="w-5 h-5 text-orange-600" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">En Cola</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.queuePosts}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
