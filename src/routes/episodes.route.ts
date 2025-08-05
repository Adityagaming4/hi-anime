import { Router } from 'express';
import { episodesController } from '../controllers/episodesController';

export const episodesRouter = Router();
episodesRouter.get('/:id', episodesController);
