import React from 'react';
import { Calendar } from 'lucide-react';

const Schedule = () => {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Programar Publicaciones</h1>
                <p className="mt-2 text-gray-600">
                    Programa tus publicaciones para el momento perfecto.
                </p>
            </div>

            {/* Contenido placeholder */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mb-4">
                        <Calendar className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Programación de publicaciones
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Esta funcionalidad estará disponible próximamente. Podrás programar publicaciones 
                        para que se publiquen automáticamente en el momento que elijas.
                    </p>
                    <div className="bg-purple-50 rounded-lg p-4">
                        <h4 className="font-medium text-purple-900 mb-2">Funcionalidades próximas:</h4>
                        <ul className="text-sm text-purple-700 space-y-1">
                            <li>• Programar publicaciones para fechas y horas específicas</li>
                            <li>• Vista de calendario para gestionar publicaciones</li>
                            <li>• Repetición de publicaciones (diaria, semanal, mensual)</li>
                            <li>• Análisis de mejores horarios para publicar</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Schedule;
