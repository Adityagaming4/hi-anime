import { Request, Response } from 'express';

export const streamController = async (req: Request, res: Response) => {
  try {
    console.log('Controller received params:', req.params);  // Debug line

    const { episodeId } = req.params;
    let language = req.params.language;

    // Validate required episodeId param
    if (!episodeId) {
      return res.status(400).json({ error: 'Episode ID is required' });
    }

    const validLanguages = ['sub', 'dub'];

    // Default language to 'sub' only here, after confirming params from router
    if (!language || !validLanguages.includes(language)) {
      language = 'sub';
    }

    if (!/^[\w-]+$/.test(episodeId)) {
      return res.status(400).json({ error: 'Invalid episode ID format' });
    }

    const embedUrl = `https://megaplay.buzz/stream/s-2/${episodeId}/${language}`;

    return res.json({
      status: true,
      episodeId,
      language,
      embedUrl,
      iframe: `<iframe src="${embedUrl}" width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen></iframe>`,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      error: 'Failed to generate stream URL',
      details: error.message,
    });
  }
};
