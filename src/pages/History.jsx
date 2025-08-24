import React from 'react';
import { History as HistoryIcon } from 'lucide-react';

const History = () => {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Historial de Publicaciones</h1>
                <p className="mt-2 text-gray-600">
                    Revisa todas tus publicaciones anteriores y su rendimiento.
                </p>
            </div>

            {/* Contenido placeholder */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                        <HistoryIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Historial de publicaciones
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Esta funcionalidad estará disponible próximamente. Podrás ver un historial completo 
                        de todas tus publicaciones con estadísticas y métricas de rendimiento.
                    </p>
                    <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Funcionalidades próximas:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Historial completo de publicaciones</li>
                            <li>• Estadísticas de engagement por red social</li>
                            <li>• Filtros por fecha, red social y estado</li>
                            <li>• Exportación de datos y reportes</li>
                            <li>• Análisis de rendimiento y tendencias</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History;
