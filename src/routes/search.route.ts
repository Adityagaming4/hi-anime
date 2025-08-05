import { Router, Request, Response } from 'express';
import { extractListPage } from '../extractors/extractListPage';
import { axiosInstance } from '../services/axiosInstance';

export const searchRouter = Router();

searchRouter.get('/', async (req: Request, res: Response) => {
  try {
    const keyword = req.query.keyword as string;
    const page = req.query.page as string || '1';

    if (!keyword) {
      return res.status(400).json({ error: 'keyword is required' });
    }

    const noSpaceKeyword = keyword.trim().toLowerCase().replace(/\s+/g, '+');
    const endpoint = `/search?keyword=${noSpaceKeyword}&page=${page}`;
    const result = await axiosInstance(endpoint);

    if (!result.success) {
      return res.status(500).json({ error: 'Failed to fetch search results' });
    }

    const response = extractListPage(result.data);

    if (response.response.length < 1) {
      return res.status(404).json({ error: 'No results found' });
    }

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
