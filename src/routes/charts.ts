import { Router, Request, Response } from 'express';
import { query } from '../database'

export const chartsRouter = Router();

chartsRouter.get('/categories/:id',async (req:Request,res:Response) => {
    const { id } = req.params;
    query(res,`SELECT COUNT(*) AS "value", "Category" AS "name"  FROM task_view WHERE "UID" = $1 GROUP BY "Category";`,[id],true)
});

chartsRouter.get('/status/:id',async (req:Request,res:Response) => {
    const { id } = req.params;
    query(res,`SELECT COUNT(*) AS "value", "Status" AS "name" FROM task_view WHERE "UID" = $1 GROUP BY "Status";`,[id],true)
});

chartsRouter.get('/threats/:id',async (req:Request,res:Response) => {
    const { id } = req.params;
    query(res,`SELECT COUNT(*) AS "value", "Threat Level" AS "name"  FROM task_view WHERE "UID" = $1 GROUP BY "Threat Level";`,[id],true)
});