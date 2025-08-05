import axios from 'axios';
import config from '../config/config';

export const axiosInstance = async (endpoint: string) => {
  try {
    const response = await axios.get(config.baseurl + endpoint, {
      headers: config.headers,
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
