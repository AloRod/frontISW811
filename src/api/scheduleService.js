import axios from './axios';

// Obtener horario semanal del usuario
export const getWeeklySchedule = async (userId) => {
    try {
        const response = await axios.get(`/schedules/user/${userId}/weekly`);
        return response.data;
    } catch (error) {
        console.error('Error getting weekly schedule:', error);
        throw error;
    }
};

// Obtener horarios por día específico
export const getSchedulesByDay = async (userId, dayOfWeek) => {
    try {
        const response = await axios.get(`/schedules/user/${userId}/day/${dayOfWeek}`);
        return response.data;
    } catch (error) {
        console.error('Error getting schedules by day:', error);
        throw error;
    }
};

// Crear nuevo horario
export const createSchedule = async (scheduleData) => {
    try {
        const response = await axios.post('/schedules', scheduleData);
        return response.data;
    } catch (error) {
        console.error('Error creating schedule:', error);
        throw error;
    }
};

// Actualizar horario existente
export const updateSchedule = async (scheduleId, scheduleData) => {
    try {
        const response = await axios.put(`/schedules/${scheduleId}`, scheduleData);
        return response.data;
    } catch (error) {
        console.error('Error updating schedule:', error);
        throw error;
    }
};

// Eliminar horario
export const deleteSchedule = async (scheduleId) => {
    try {
        const response = await axios.delete(`/schedules/${scheduleId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting schedule:', error);
        throw error;
    }
};

// Obtener el horario más cercano
export const getClosestSchedule = async (userId) => {
    try {
        const response = await axios.get(`/schedules/user/${userId}/closest`);
        return response.data;
    } catch (error) {
        console.error('Error getting closest schedule:', error);
        throw error;
    }
};
