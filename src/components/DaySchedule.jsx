import React from 'react';
import { Clock, Edit, Trash2, Plus } from 'lucide-react';

const DaySchedule = ({ 
    day, 
    schedules = [], 
    onAddSchedule, 
    onEditSchedule, 
    onDeleteSchedule,
    isToday = false 
}) => {
    const formatTime = (time) => {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDayColor = (dayOfWeek) => {
        const colors = {
            1: 'bg-blue-50 border-blue-200 text-blue-700', // Lunes
            2: 'bg-green-50 border-green-200 text-green-700', // Martes
            3: 'bg-yellow-50 border-yellow-200 text-yellow-700', // Miércoles
            4: 'bg-orange-50 border-orange-200 text-orange-700', // Jueves
            5: 'bg-purple-50 border-purple-200 text-purple-700', // Viernes
            6: 'bg-pink-50 border-pink-200 text-pink-700', // Sábado
            7: 'bg-red-50 border-red-200 text-red-700' // Domingo
        };
        return colors[dayOfWeek] || colors[1];
    };

    return (
        <div className={`bg-white rounded-xl border-2 transition-all ${
            isToday 
                ? 'border-purple-300 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300'
        }`}>
            {/* Day Header */}
            <div className={`p-4 rounded-t-xl ${getDayColor(day.day_of_week)}`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">{day.day_name}</h3>
                        <p className="text-sm opacity-75">{day.day_abbreviation}</p>
                    </div>
                    {isToday && (
                        <div className="px-3 py-1 bg-white bg-opacity-80 rounded-full">
                            <span className="text-xs font-medium text-gray-700">Hoy</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Schedules List */}
            <div className="p-4">
                {schedules.length === 0 ? (
                    <div className="text-center py-8">
                        <Clock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-500 mb-4">No hay horarios programados</p>
                        <button
                            onClick={() => onAddSchedule(day.day_of_week)}
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="text-sm font-medium">Agregar horario</span>
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {schedules.map((schedule) => (
                            <div
                                key={schedule.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white rounded-lg">
                                        <Clock className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {formatTime(schedule.time)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {schedule.time_12h}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => onEditSchedule(schedule)}
                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Editar horario"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDeleteSchedule(schedule.id)}
                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Eliminar horario"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        {/* Add new schedule button */}
                        <button
                            onClick={() => onAddSchedule(day.day_of_week)}
                            className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="text-sm font-medium">Agregar otro horario</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DaySchedule;
