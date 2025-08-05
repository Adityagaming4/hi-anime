import { Request, Response } from 'express';
import axios from 'axios';
import config from '../config/config';
import { extractEpisodes } from '../extractors/extractEpisodes';

export const episodesController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    const Referer = `/watch/${id}`;
    const idNum = id.split('-').at(-1);
    const ajaxUrl = `/ajax/v2/episode/list/${idNum}`;

    const { data } = await axios.get(config.baseurl + ajaxUrl, {
      headers: {
        Referer,
        ...config.headers,
      },
    });

    const episodes = extractEpisodes(data.html);

    res.json({
      status: true,
      totalItems: episodes.length,
      episodes,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      error: 'Failed to fetch episodes',
      suggestion: 'Make sure the anime ID is correct (e.g., one-piece-100)',
      details: error.message,
    });
  }
};
