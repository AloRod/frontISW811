import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, Save, Loader2 } from 'lucide-react';

const ScheduleModal = ({ isOpen, onClose, onSave, schedule = null, userId }) => {
    const [formData, setFormData] = useState({
        day_of_week: 1,
        time: '09:00',
        user_id: userId
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const daysOfWeek = [
        { value: 1, label: 'Lunes', abbr: 'L' },
        { value: 2, label: 'Martes', abbr: 'K' },
        { value: 3, label: 'Miércoles', abbr: 'M' },
        { value: 4, label: 'Jueves', abbr: 'J' },
        { value: 5, label: 'Viernes', abbr: 'V' },
        { value: 6, label: 'Sábado', abbr: 'S' },
        { value: 7, label: 'Domingo', abbr: 'D' }
    ];

    useEffect(() => {
        if (schedule) {
            setFormData({
                day_of_week: schedule.day_of_week,
                time: schedule.time,
                user_id: userId
            });
        } else {
            setFormData({
                day_of_week: 1,
                time: '09:00',
                user_id: userId
            });
        }
        setErrors({});
    }, [schedule, userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await onSave(formData, schedule?.id);
            onClose();
        } catch (error) {
            if (error.response?.data) {
                setErrors(error.response.data);
            } else {
                setErrors({ general: 'Error al guardar el horario' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Clock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {schedule ? 'Editar Horario' : 'Nuevo Horario'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {schedule ? 'Modifica los detalles del horario' : 'Configura un nuevo horario de publicación'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {errors.general && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{errors.general}</p>
                        </div>
                    )}

                    {/* Day Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            <Calendar className="w-4 h-4 inline mr-2" />
                            Día de la semana
                        </label>
                        <div className="grid grid-cols-7 gap-2">
                            {daysOfWeek.map((day) => (
                                <button
                                    key={day.value}
                                    type="button"
                                    onClick={() => handleInputChange('day_of_week', day.value)}
                                    className={`p-3 rounded-lg border-2 transition-all ${
                                        formData.day_of_week === day.value
                                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    <div className="text-xs font-medium">{day.abbr}</div>
                                    <div className="text-xs opacity-75">{day.label}</div>
                                </button>
                            ))}
                        </div>
                        {errors.day_of_week && (
                            <p className="mt-2 text-sm text-red-600">{errors.day_of_week[0]}</p>
                        )}
                    </div>

                    {/* Time Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            <Clock className="w-4 h-4 inline mr-2" />
                            Hora de publicación
                        </label>
                        <div className="relative">
                            <input
                                type="time"
                                value={formData.time}
                                onChange={(e) => handleInputChange('time', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-medium"
                            />
                        </div>
                        {errors.time && (
                            <p className="mt-2 text-sm text-red-600">{errors.time[0]}</p>
                        )}
                    </div>

                    {/* Preview */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Vista previa:</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                                {daysOfWeek.find(d => d.value === formData.day_of_week)?.label} a las{' '}
                                {new Date(`2000-01-01T${formData.time}`).toLocaleTimeString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Guardando...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>{schedule ? 'Actualizar' : 'Crear'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleModal;
