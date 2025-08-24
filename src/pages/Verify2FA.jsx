import React from 'react';
import { Shield } from 'lucide-react';

const Verify2FA = () => {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Verificación 2FA</h1>
                <p className="mt-2 text-gray-600">
                    Verifica tu identidad con autenticación de dos factores.
                </p>
            </div>

            {/* Contenido placeholder */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                        <Shield className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Verificación de dos factores
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Esta funcionalidad estará disponible próximamente. Podrás configurar y usar 
                        autenticación de dos factores para mayor seguridad en tu cuenta.
                    </p>
                    <div className="bg-yellow-50 rounded-lg p-4">
                        <h4 className="font-medium text-yellow-900 mb-2">Funcionalidades próximas:</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• Configuración de autenticación de dos factores</li>
                            <li>• Códigos QR para aplicaciones autenticadoras</li>
                            <li>• Códigos de respaldo para recuperación</li>
                            <li>• Verificación en cada inicio de sesión</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Verify2FA;
