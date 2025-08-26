import React, { useState, useEffect, useContext } from 'react';
import { Calendar, Plus, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { 
    getWeeklySchedule, 
    createSchedule, 
    updateSchedule, 
    deleteSchedule, 
    getClosestSchedule 
} from '../api/scheduleService';
import ScheduleModal from '../components/ScheduleModal';
import DaySchedule from '../components/DaySchedule';
import Alert from '../components/Alert';

const Schedule = () => {
    const { user } = useContext(AuthContext);
    const [weeklySchedule, setWeeklySchedule] = useState([]);
    const [closestSchedule, setClosestSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [closestLoading, setClosestLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [alert, setAlert] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);

    // Obtener el día actual (1-7, donde 1 es lunes)
    const getCurrentDay = () => {
        const today = new Date().getDay();
        return today === 0 ? 7 : today; // Convertir domingo (0) a 7
    };

    const showAlert = (type, message) => {
        setAlert({ type, message });
        setTimeout(() => setAlert(null), 5000);
    };

    const loadWeeklySchedule = async () => {
        try {
            setLoading(true);
            const response = await getWeeklySchedule(user.id);
            setWeeklySchedule(response.data);
        } catch (error) {
            console.error('Error loading weekly schedule:', error);
            showAlert('error', 'Error al cargar los horarios');
        } finally {
            setLoading(false);
        }
    };

    const loadClosestSchedule = async () => {
        try {
            setClosestLoading(true);
            const response = await getClosestSchedule(user.id);
            setClosestSchedule(response.data);
        } catch (error) {
            console.error('Error loading closest schedule:', error);
            // No mostrar error si no hay horarios
            if (error.response?.status !== 404) {
                showAlert('error', 'Error al cargar el próximo horario');
            }
        } finally {
            setClosestLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            loadWeeklySchedule();
            loadClosestSchedule();
        }
    }, [user?.id]);

    const handleAddSchedule = (selectedDay = null) => {
        setEditingSchedule(null);
        setModalOpen(true);
        if (selectedDay) {
            setSelectedDay(selectedDay);
        } else {
            setSelectedDay(null);
        }
    };

    const handleEditSchedule = (schedule) => {
        setEditingSchedule(schedule);
        setModalOpen(true);
    };

    const handleDeleteSchedule = async (scheduleId) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este horario?')) {
            return;
        }

        try {
            await deleteSchedule(scheduleId);
            showAlert('success', 'Horario eliminado correctamente');
            loadWeeklySchedule();
            loadClosestSchedule();
        } catch (error) {
            console.error('Error deleting schedule:', error);
            showAlert('error', 'Error al eliminar el horario');
        }
    };

    const handleSaveSchedule = async (formData, scheduleId) => {
        try {
            if (scheduleId) {
                await updateSchedule(scheduleId, formData);
                showAlert('success', 'Horario actualizado correctamente');
            } else {
                await createSchedule(formData);
                showAlert('success', 'Horario creado correctamente');
            }
            loadWeeklySchedule();
            loadClosestSchedule();
        } catch (error) {
            console.error('Error saving schedule:', error);
            throw error; // Re-throw para que el modal maneje el error
        }
    };

    const handleRefresh = () => {
        loadWeeklySchedule();
        loadClosestSchedule();
        showAlert('info', 'Datos actualizados');
    };

    const getAllSchedules = () => {
        const allSchedules = [];
        weeklySchedule.forEach(day => {
            day.times.forEach(schedule => {
                allSchedules.push({
                    id: schedule.id,
                    day_of_week: day.day_of_week,
                    time: schedule.time,
                    time_formatted: schedule.time_formatted,
                    time_12h: schedule.time_12h
                });
            });
        });
        return allSchedules;
    };


    if (loading) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Horario Semanal</h1>
                        <p className="mt-2 text-gray-600">
                            Gestiona tus horarios de publicación semanales.
                        </p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6">
                    {[...Array(7)].map((_, index) => (
                        <div key={index} className="bg-white rounded-xl border-2 border-gray-200 animate-pulse">
                            <div className="h-32 bg-gray-200 rounded-t-xl"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Alert */}
            {alert && (
                <Alert type={alert.type} message={alert.message} />
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Horario Semanal</h1>
                    <p className="mt-2 text-gray-600">
                        Gestiona tus horarios de publicación semanales para automatizar tus publicaciones.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleRefresh}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span className="hidden sm:inline">Actualizar</span>
                    </button>
                    <button
                        onClick={() => handleAddSchedule(1)}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Nuevo Horario</span>
                    </button>
                </div>
            </div>

            {/* Next Schedule Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Weekly Schedule Grid */}
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {weeklySchedule.map((day) => (
                            <DaySchedule
                                key={day.day_of_week}
                                day={day}
                                schedules={day.times}
                                onAddSchedule={(selectedDay) => handleAddSchedule(selectedDay)}
                                onEditSchedule={handleEditSchedule}
                                onDeleteSchedule={handleDeleteSchedule}
                                isToday={day.day_of_week === getCurrentDay()}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {weeklySchedule.length === 0 && !loading && (
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mb-4">
                        <Calendar className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No hay horarios configurados
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Comienza configurando tus horarios de publicación semanales para automatizar tus publicaciones.
                    </p>
                    <button
                        onClick={() => handleAddSchedule(1)}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Configurar primer horario</span>
                    </button>
                </div>
            )}

            {/* Stats */}
            {weeklySchedule.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de horarios</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Días con horarios</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {weeklySchedule.filter(day => day.times.length > 0).length} de 7
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total de horarios</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {weeklySchedule.reduce((total, day) => total + day.times.length, 0)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Próxima publicación</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {closestSchedule ? 'Programada' : 'Sin programar'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            <ScheduleModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingSchedule(null);
                    setSelectedDay(null);
                }}
                onSave={handleSaveSchedule}
                schedule={editingSchedule}
                userId={user?.id}
                existingSchedules={getAllSchedules()}
                selectedDay={selectedDay}
            />
        </div>
    );
};

export default Schedule;
