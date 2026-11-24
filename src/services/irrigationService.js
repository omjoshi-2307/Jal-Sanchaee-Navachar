import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const irrigationService = {
  generateSchedule: async (userId, formData) => {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      const response = await axios.post(`${API_URL}/irrigation/generate-schedule`, {
        userId,
        formData,
        timeZone
      });
      return response.data.schedule;
    } catch (error) {
      console.error('Error in irrigationService:', error);
      throw error.response?.data?.error || 'Failed to generate schedule';
    }
  }
};
