import { Router, Request, Response, NextFunction } from 'express';
import { streamController } from '../controllers/streamController';

export const streamRouter = Router();

// Route without language (defaults to 'sub')
streamRouter.get('/:episodeId', (req: Request, res: Response, next: NextFunction) => {
  req.params.language = 'sub';
  streamController(req, res).catch(next);
});

// Route with language provided
streamRouter.get('/:episodeId/:language', (req: Request, res: Response, next: NextFunction) => {
  req.params.language = (req.params.language ?? 'sub').toLowerCase();
  streamController(req, res).catch(next);
});
