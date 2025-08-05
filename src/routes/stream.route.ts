import { Router } from 'express';
import { streamController } from '../controllers/streamController';

export const streamRouter = Router();

// Use separate routes instead of optional parameter
streamRouter.get('/:episodeId/sub', streamController);
streamRouter.get('/:episodeId/dub', streamController);
streamRouter.get('/:episodeId', streamController);  // defaults to sub
