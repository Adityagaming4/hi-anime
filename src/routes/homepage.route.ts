import { Router } from 'express';
import { homepageController } from '../controllers/homepageController';

export const homepageRouter = Router();
homepageRouter.get('/', homepageController);
