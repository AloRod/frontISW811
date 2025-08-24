import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
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
    const [connectingStates, setConnectingStates] = useState({
        linkedin: false,
        reddit: false,
        mastodon: false
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const socialNetworks = [
        { 
            id: 'linkedin', 
            name: 'LinkedIn', 
            icon: Linkedin, 
            color: 'bg-blue-500',
            description: 'Conecta tu perfil profesional'
        },
        { 
            id: 'reddit', 
            name: 'Reddit', 
            icon: MessageSquare, 
            color: 'bg-orange-500',
            description: 'Comparte en comunidades'
        },
        { 
            id: 'mastodon', 
            name: 'Mastodon', 
            icon: Globe, 
            color: 'bg-purple-500',
            description: 'Red social descentralizada'
        }
    ];

    const handleConnect = async (networkId) => {
        setConnectingStates(prev => ({ ...prev, [networkId]: true }));
        setError(null);
        setSuccess(null);

        try {
            // Obtener el enlace de autorización usando la configuración
            const authUrl = config[networkId.toUpperCase()]?.AUTHORIZE_URL;
            if (!authUrl) {
                throw new Error('URL de autorización no configurada');
            }
            
            const authResponse = await axios.get(authUrl.replace(config.API_URL, ''));
            
            if (authResponse.data.link) {
                // Redirigir en la misma ventana en lugar de abrir una nueva
                window.location.href = authResponse.data.link;
            }
        } catch (err) {
            console.error('Error al iniciar conexión:', err);
            setError('Error al conectar con la red social');
            setConnectingStates(prev => ({ ...prev, [networkId]: false }));
        }
    };

    const handleDisconnect = async (networkId) => {
        try {
            // Aquí deberías hacer una llamada al backend para desconectar
            // Por ahora solo actualizamos el estado local
            setSuccess(`${socialNetworks.find(n => n.id === networkId)?.name} desconectado`);
            onConnectionUpdate?.();
            
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Error al desconectar');
        }
    };

    const isConnected = (networkId) => {
        return connections.some(conn => conn.platform === networkId);
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
                    const connected = isConnected(network.id);
                    const isConnecting = connectingStates[network.id];
                    
                    return (
                        <div
                            key={network.id}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                connected
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
                                    {connected ? (
                                        <>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Conectado
                                            </span>
                                            <button
                                                onClick={() => handleDisconnect(network.id)}
                                                className="text-sm text-red-600 hover:text-red-800 font-medium"
                                            >
                                                Desconectar
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleConnect(network.id)}
                                            disabled={isConnecting}
                                            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md transition-colors duration-200 ${
                                                isConnecting
                                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                            }`}
                                        >
                                            {isConnecting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Conectando...
                                                </>
                                            ) : (
                                                'Conectar'
                                            )}
                                        </button>
                                    )}
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
