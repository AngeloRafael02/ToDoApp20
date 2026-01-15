import { Router, Request, Response }from 'express';
import { query } from '../database'

export const utilsRouter = Router();

utilsRouter.get('/categories', async (req:Request,res:Response)=> {
    query(res,`SELECT id, cat, color FROM categories`)
});

utilsRouter.get('/status', async (req:Request,res:Response)=> {
    query(res,`SELECT id, stat, color FROM conditions;`);
});

utilsRouter.get('/threats', async (req:Request,res:Response)=> {
    query(res,`SELECT id, level, color FROM threats;`);
});
