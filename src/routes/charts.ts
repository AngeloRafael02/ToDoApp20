import { Router, Request, Response } from 'express';
import { query } from '../database'

export const chartsRouter = Router();

chartsRouter.get('/categories/:id',async (req:Request,res:Response) => {
    const { id } = req.params;
    query(res,`SELECT COUNT(*), "Category" FROM task_view WHERE "UID" = $1 GROUP BY "Category";`,[id],true)
});

chartsRouter.get('/status/:id',async (req:Request,res:Response) => {
    const { id } = req.params;
    query(res,`SELECT COUNT(*), "Status" FROM task_view WHERE "UID" = $1 GROUP BY "Status";`,[id],true)
});

chartsRouter.get('/threats/:id',async (req,res) => {
    const { id } = req.params;
    query(res,`SELECT COUNT(*), "Threat Level" FROM task_view WHERE "UID" = $1 GROUP BY "Threat Level";`,[id],true)
});