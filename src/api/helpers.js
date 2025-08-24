import axios from './axios';

export const getLink = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error getting link:', error);
        throw error;
    }
};
