/* src/routes/details.route.ts */

import { Router } from 'express';
import { detailsController } from '../controllers/detailsController';

export const detailsRouter = Router();
detailsRouter.get('/:id', detailsController);
