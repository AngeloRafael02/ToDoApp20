import { Router, Request, Response } from 'express';
import { query } from '../database'

export const taskRouter = Router();

taskRouter.get('/all/:status/:id',async (req:Request, res:Response) => {
    const { status,id } = req.params;
    query(res, `SELECT * FROM task_view WHERE "UID" = $1 AND "SID" = $2`, [id,status], true);
});

taskRouter.get('/one/:id', async (req:Request, res:Response) => {
    const { id } = req.params;
    query(res, 'SELECT * FROM task_view WHERE id = $1 LIMIT 1;', [id], true)
});

taskRouter.get('/columns/:table', async (req:Request, res:Response) => {
    const { table } = req.params;
    query(res,`SELECT column_name FROM information_schema.columns WHERE table_name = $1`,[table])
});