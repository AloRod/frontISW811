import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { getLink } from '../api/helpers';
import Alert from './Alert';
import config from '../config/env';
import { 
    Linkedin, 
    MessageSquare, 
    Globe, 
    Lightbulb
} from 'lucide-react';

const SocialAccountsPanel = ({ connections, onConnectionUpdate }) => {
    const { user } = useAuth();
    const [platformStatus, setPlatformStatus] = useState({
        linkedin: { active: false, id: null, isLoading: false },
        reddit: { active: false, id: null, isLoading: false },
        mastodon: { active: false, id: null, isLoading: false }
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const socialNetworks = [
        { 
            id: 'linkedin', 
            name: 'LinkedIn', 
            icon: Linkedin, 
            color: 'bg-blue-500',
            description: 'Conecta tu perfil profesional',
            oauthUrl: config.LINKEDIN.AUTHORIZE_URL
        },
        { 
            id: 'reddit', 
            name: 'Reddit', 
            icon: MessageSquare, 
            color: 'bg-orange-500',
            description: 'Comparte en comunidades',
            oauthUrl: config.REDDIT.AUTHORIZE_URL
        },
        { 
            id: 'mastodon', 
            name: 'Mastodon', 
            icon: Globe, 
            color: 'bg-purple-500',
            description: 'Red social descentralizada',
            oauthUrl: config.MASTODON.AUTHORIZE_URL
        }
    ];

    // Obtener el estado inicial de las conexiones
    useEffect(() => {
        const fetchPlatformStatus = async () => {
            if (!user?.id) return;

            try {
                const response = await axios.get(`${config.API_URL}/connections/user/${user.id}/platform-status`);
                console.log('Raw API response:', response);
                const statusData = response.data.data || response.data;
                
                console.log('Platform status response:', statusData);

                // Verificar que statusData sea un array
                if (!Array.isArray(statusData)) {
                    console.error('Invalid response format:', statusData);
                    setError('Formato de respuesta inválido');
                    return;
                }

                const newStatus = {
                    linkedin: { active: false, id: null, isLoading: false },
                    reddit: { active: false, id: null, isLoading: false },
                    mastodon: { active: false, id: null, isLoading: false }
                };
                
                statusData.forEach(item => {
                    if (newStatus[item.platform]) {
                        newStatus[item.platform] = {
                            active: item.status === true,
                            id: item.id,
                            isLoading: false
                        };
                    }
                });

                console.log('Processed status:', newStatus);
                setPlatformStatus(newStatus);
                setError(null); // Limpiar errores previos si la carga es exitosa
            } catch (error) {
                console.error('Error fetching platform status:', error);
                setError('Error al obtener el estado de las conexiones');
            }
        };

        fetchPlatformStatus();
    }, [user?.id]);

    // Recargar el estado cuando el usuario regrese de la autorización OAuth
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const authSuccess = urlParams.get('auth_success');
        const authError = urlParams.get('auth_error');
        
        if (authSuccess === 'true') {
            setSuccess('Conexión establecida exitosamente');
            // Recargar el estado de las conexiones después de un breve delay
            setTimeout(() => {
                window.location.search = '';
                // Recargar la página para obtener el estado actualizado
                window.location.reload();
            }, 2000);
        } else if (authError) {
            setError(`Error en la autorización: ${authError}`);
            setTimeout(() => {
                window.location.search = '';
            }, 3000);
        }
    }, []);

    const handleClick = async (platformId) => {
        const platform = platformStatus[platformId];
        const network = socialNetworks.find(n => n.id === platformId);

        if (!network) return;

        // Actualizar estado de carga
        setPlatformStatus(prev => ({
            ...prev,
            [platformId]: { ...prev[platformId], isLoading: true }
        }));
        setError(null);
        setSuccess(null);

        try {
            if (platform.active) {
                // Desconectar
                if (!platform.id) {
                    throw new Error('ID de conexión no encontrado');
                }
                
                await axios.delete(`${config.API_URL}/connections/${platform.id}`);
                
                setPlatformStatus(prev => ({
                    ...prev,
                    [platformId]: { active: false, id: null, isLoading: false }
                }));
                
                setSuccess(`${network.name} desconectado exitosamente`);
                onConnectionUpdate?.();
                
                // Recargar el estado de las conexiones después de desconectar
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                // Conectar
                console.log('Attempting to connect to:', network.oauthUrl);
                const authResponse = await getLink(network.oauthUrl.replace(config.API_URL, ''));
                
                console.log('Auth response:', authResponse);
                
                if (authResponse.link || authResponse.url) {
                    const authUrl = authResponse.link || authResponse.url;
                    console.log('Redirecting to:', authUrl);
                    window.location.href = authUrl;
                } else {
                    throw new Error('No se pudo obtener el enlace de autorización');
                }
            }
        } catch (error) {
            console.error('Error handling connection:', error);
            const errorMessage = error.response?.data?.message || error.message || `Error al ${platform.active ? 'desconectar' : 'conectar'} con ${network.name}`;
            setError(errorMessage);
            
            // Restaurar estado de carga
            setPlatformStatus(prev => ({
                ...prev,
                [platformId]: { ...prev[platformId], isLoading: false }
            }));
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Conexiones Sociales</h2>
                <p className="text-gray-600">Gestiona tus cuentas conectadas</p>
            </div>

            {error && (
                <Alert type="error" message={error} onClose={() => setError(null)} />
            )}

            {success && (
                <Alert type="success" message={success} onClose={() => setSuccess(null)} />
            )}

            <div className="space-y-4">
                {socialNetworks.map((network) => {
                    const status = platformStatus[network.id];
                    const isConnected = status.active;
                    const isLoading = status.isLoading;
                    
                    return (
                        <div
                            key={network.id}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                isConnected
                                    ? 'border-green-200 bg-green-50'
                                    : 'border-gray-200 bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 rounded-full ${network.color} flex items-center justify-center text-white`}>
                                        <network.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{network.name}</h3>
                                        <p className="text-sm text-gray-500">{network.description}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    
                                    
                                    <button
                                        onClick={() => handleClick(network.id)}
                                        disabled={isLoading}
                                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md transition-colors duration-200 ${
                                            isLoading
                                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                                : isConnected
                                                ? 'bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                        }`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                {isConnected ? 'Desconectando...' : 'Conectando...'}
                                            </>
                                        ) : (
                                            isConnected ? 'Desconectar' : 'Conectar'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <Lightbulb className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Consejo</h3>
                        <div className="mt-1 text-sm text-blue-700">
                            <p>
                                Conecta al menos una red social para comenzar a publicar contenido desde tu dashboard.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialAccountsPanel;
