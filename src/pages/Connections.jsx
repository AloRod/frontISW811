import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SocialAccountsPanel from '../components/SocialAccountsPanel';
import Alert from '../components/Alert';
import { 
    Linkedin, 
    MessageSquare, 
    Globe, 
    Check 
} from 'lucide-react';

const Connections = () => {
    const { user } = useAuth();
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchConnections();
    }, []);

    const fetchConnections = async () => {
        try {
            setLoading(true);
            // Aquí deberías hacer una llamada al backend para obtener las conexiones del usuario
            // Por ahora usaremos un estado local
            setConnections([]);
        } catch (err) {
            setError('Error al cargar las conexiones');
            console.error(err);
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
                <h1 className="text-3xl font-bold text-gray-900">Conexiones</h1>
                <p className="mt-2 text-gray-600">
                    Gestiona tus cuentas de redes sociales conectadas.
                </p>
            </div>

            {/* Alertas */}
            {error && (
                <Alert type="error" message={error} onClose={() => setError(null)} />
            )}

            {/* Panel de conexiones expandido */}
            <div className="max-w-4xl">
                <SocialAccountsPanel 
                    connections={connections}
                    onConnectionUpdate={handleConnectionUpdate}
                />
            </div>

            {/* Información adicional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Por qué conectar redes sociales?</h3>
                    <ul className="space-y-3 text-gray-600">
                        <li className="flex items-start">
                            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                            Publica en múltiples plataformas desde un solo lugar
                        </li>
                        <li className="flex items-start">
                            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                            Ahorra tiempo gestionando todas tus redes
                        </li>
                        <li className="flex items-start">
                            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                            Mantén consistencia en tu contenido
                        </li>
                        <li className="flex items-start">
                            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                            Programa publicaciones para el momento perfecto
                        </li>
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Redes sociales soportadas</h3>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                <Linkedin className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">LinkedIn</p>
                                <p className="text-sm text-gray-500">Perfil profesional</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Reddit</p>
                                <p className="text-sm text-gray-500">Comunidades</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">
                                <Globe className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Mastodon</p>
                                <p className="text-sm text-gray-500">Red descentralizada</p>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Connections;
