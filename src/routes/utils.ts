import { Router, Request, Response } from 'express';

import { cacheMiddleware } from '../middleware/cache';
import { query } from '../database'

export const utilsRouter = Router();

utilsRouter.get('/categories', cacheMiddleware(), async (req: Request, res: Response) => {
    query(res, `SELECT id, cat, color FROM categories`)
});

utilsRouter.get('/status', cacheMiddleware(), async (req: Request, res: Response) => {
    query(res, `SELECT id, stat, color FROM conditions;`);
});

utilsRouter.get('/threats', cacheMiddleware(), async (req: Request, res: Response) => {
    query(res, `SELECT id, level, color FROM threats;`);
});
