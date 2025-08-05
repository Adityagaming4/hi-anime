import { Request, Response } from 'express';
import { axiosInstance } from '../services/axiosInstance';
import { extractHomepage } from '../extractors/extractHomepage';

export const homepageController = async (req: Request, res: Response) => {
  try {
    const result = await axiosInstance('/home');

    if (!result.success) {
      return res.status(500).json({ 
        error: 'Failed to fetch homepage data',
        details: result.message 
      });
    }

    const response = extractHomepage(result.data);
    
    res.json({
      status: true,
      data: response,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      error: 'Failed to fetch homepage data',
      details: error.message,
    });
  }
};
