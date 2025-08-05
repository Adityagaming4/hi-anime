import { Request, Response } from 'express';

export const streamController = async (req: Request, res: Response) => {
  try {
    const { episodeId, language = 'sub' } = req.params;

    if (!episodeId) {
      return res.status(400).json({ 
        error: 'Episode ID is required' 
      });
    }

    const validLanguages = ['sub', 'dub'];
    const lang = validLanguages.includes(language) ? language : 'sub';

    const embedUrl = `https://megaplay.buzz/stream/s-2/${episodeId}/${lang}`;

    res.json({
      status: true,
      episodeId,
      language: lang,
      embedUrl,
      iframe: `<iframe src="${embedUrl}" width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen></iframe>`
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      error: 'Failed to generate stream URL',
      details: error.message,
    });
  }
};
