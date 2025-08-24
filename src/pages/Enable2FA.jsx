import React from 'react';
import { Shield } from 'lucide-react';

const Enable2FA = () => {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Autenticación de Dos Factores</h1>
                <p className="mt-2 text-gray-600">
                    Configura la autenticación de dos factores para mayor seguridad.
                </p>
            </div>

            {/* Contenido placeholder */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                        <Shield className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Configuración de 2FA
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Esta funcionalidad estará disponible próximamente. Podrás habilitar y configurar 
                        la autenticación de dos factores para proteger tu cuenta.
                    </p>
                    <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-medium text-green-900 mb-2">Funcionalidades próximas:</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                            <li>• Habilitar/deshabilitar autenticación de dos factores</li>
                            <li>• Generación de códigos QR para aplicaciones</li>
                            <li>• Códigos de respaldo para recuperación de cuenta</li>
                            <li>• Configuración de métodos de verificación</li>
                            <li>• Historial de dispositivos autorizados</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Enable2FA;
