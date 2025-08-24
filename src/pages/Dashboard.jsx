import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import ImmediatePostForm from '../components/ImmediatePostForm';
import SocialAccountsPanel from '../components/SocialAccountsPanel';
import Alert from '../components/Alert';
import { BarChart3, Link, Calendar } from 'lucide-react';
import config from '../config/env';

const Dashboard = () => {
    const { user } = useAuth();
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchConnections();
    }, [user?.id]);

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
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">
                    Gestiona tus publicaciones y conexiones sociales desde un solo lugar.
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

                {/* Formulario de publicación */}
                <div className="lg:col-span-2">
                    <ImmediatePostForm 
                        connections={connections}
                        onPostSuccess={() => {
                            // Opcional: mostrar mensaje de éxito
                        }}
                    />
                </div>
            </div>

            {/* Sección de estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Publicaciones</p>
                            <p className="text-2xl font-semibold text-gray-900">0</p>
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
                            <p className="text-sm font-medium text-gray-500">Conexiones</p>
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
                            <p className="text-2xl font-semibold text-gray-900">0</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
