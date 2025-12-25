import { Router, Request, Response }from 'express';
import { query } from '../database'

export const utilsRouter = Router();

utilsRouter.get('/categories', async (req:Request,res:Response)=> {
    query(res,`SELECT id, cat FROM categories`)
});

utilsRouter.get('/status', async (req:Request,res:Response)=> {
    query(res,`SELECT id, stat FROM conditions;`);
});

utilsRouter.get('/threats', async (req:Request,res:Response)=> {
    query(res,`SELECT id, level FROM threats;`);
});