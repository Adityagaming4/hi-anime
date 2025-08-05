import { Request, Response } from 'express';
import { axiosInstance } from '../services/axiosInstance';
import { extractDetailpage } from '../extractors/extractDetailPage'; // filename matches exactly

export const detailsController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const result = await axiosInstance(`/${id}`);
    if (!result.success) {
      return res.status(404).json({ error: `Anime not found: ${id}` });
    }

    const data = extractDetailpage(result.data);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

