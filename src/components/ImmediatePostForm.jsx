import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import Alert from './Alert';
import { 
    Linkedin, 
    MessageSquare, 
    Globe, 
    Link
} from 'lucide-react';

const ImmediatePostForm = ({ connections, onPostSuccess }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        postText: '',
        selectedNetworks: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const getDateTime = () => {
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0];
        return { date, time };
    };

    const socialNetworks = [
        { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-500' },
        { id: 'reddit', name: 'Reddit', icon: MessageSquare, color: 'bg-orange-500' },
        { id: 'mastodon', name: 'Mastodon', icon: Globe, color: 'bg-purple-500' }
    ];

    const handleNetworkToggle = (networkId) => {
        setFormData(prev => ({
            ...prev,
            selectedNetworks: prev.selectedNetworks.includes(networkId)
                ? prev.selectedNetworks.filter(id => id !== networkId)
                : [...prev.selectedNetworks, networkId]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.selectedNetworks.length > 0) {
            setIsSubmitting(true);

            const dateTime = getDateTime();
            const body = {
                "date": dateTime.date,
                "time": dateTime.time,
                "status": "posted",
                "user_id": user.id,
                "post_text": formData.postText,
                "social_network": formData.selectedNetworks.toString()
            };

            try {
                const response = await axios.post('/histories', body);

                if (response.status === 201) {
                    setSuccess(true);
                    setFormData({
                        postText: '',
                        selectedNetworks: []
                    });
                    onPostSuccess?.();
                    
                    // Limpiar mensaje de éxito después de 3 segundos
                    setTimeout(() => setSuccess(false), 3000);
                }
            } catch (error) {
                console.error(error);
                const errorMessage = error.response?.data?.message || error.message || 'Error al publicar. Por favor, intenta de nuevo.';
                setError(errorMessage);
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setError('You must choose 1 social network');
        }
    };

    const hasConnectedNetworks = connections && connections.length > 0;

    if (!hasConnectedNetworks) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                        <Link className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No tienes redes sociales conectadas
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Conecta tus cuentas sociales para comenzar a publicar contenido.
                    </p>
                    <a
                        href="/connections"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                        Conectar redes sociales
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Publicación Inmediata</h2>
                <p className="text-gray-600">Publica contenido en tus redes sociales conectadas</p>
            </div>

            {error && (
                <Alert type="error" message={error} onClose={() => setError(null)} />
            )}

            {success && (
                <Alert type="success" message="¡Publicación enviada exitosamente!" onClose={() => setSuccess(false)} />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo de texto */}
                <div>
                    <label htmlFor="postText" className="block text-sm font-medium text-gray-700 mb-2">
                        Contenido de la publicación
                    </label>
                    <textarea
                        id="postText"
                        value={formData.postText}
                        onChange={(e) => setFormData(prev => ({ ...prev, postText: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Escribe tu publicación aquí..."
                        maxLength={280}
                    />
                    <div className="mt-1 text-sm text-gray-500 text-right">
                        {formData.postText.length}/280 caracteres
                    </div>
                </div>

                {/* Selección de redes sociales */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Selecciona las redes sociales ({formData.selectedNetworks.length} seleccionadas)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {socialNetworks.map((network) => {
                            const isConnected = connections.some(conn => conn.platform === network.id);
                            const isSelected = formData.selectedNetworks.includes(network.id);
                            
                            return (
                                <button
                                    key={network.id}
                                    type="button"
                                    onClick={() => handleNetworkToggle(network.id)}
                                    disabled={!isConnected}
                                    className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                                        isConnected
                                            ? isSelected
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                            : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-8 h-8 rounded-full ${network.color} flex items-center justify-center text-white`}>
                                            <network.icon className="w-4 h-4" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-medium text-gray-900">{network.name}</div>
                                            <div className="text-sm text-gray-500">
                                                {isConnected ? '✅ Conectado' : '❌ No conectado'}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {isSelected && (
                                        <div className="absolute top-2 right-2">
                                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    {connections.length === 0 && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="text-sm text-yellow-800">
                                💡 No tienes redes sociales conectadas. Ve a la sección de conexiones para conectar tus cuentas.
                            </p>
                        </div>
                    )}
                </div>

                {/* Botón de publicación */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || formData.selectedNetworks.length === 0}
                        className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition-all duration-200 ${
                            isSubmitting || formData.selectedNetworks.length === 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Publicando...
                            </>
                        ) : (
                            'Publicar ahora'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ImmediatePostForm;
