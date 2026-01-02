import { Router, Request, Response } from 'express';
import { pool,query } from '../database'

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

taskRouter.post(`/new`, async (req:Request, res:Response)=> {
    try {
        const { task } = req.body;
        const values = [
            task.title, 
            task.note || null,
            task.cat_id, 
            task.prio,
            task.stat_id, 
            task.threat_id,
            task.deadline || null, 
            task.owner_id
        ];
        const result = await pool.query(`
            INSERT INTO task ( title, note, cat_id, prio, stat_id, threat_id, deadline, owner_id ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *;
            `, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error});
    }
});

taskRouter.put(`/update/:id`, async (req:Request, res:Response) => {
    try {
        const { id } = req.params;
        const { task } = req.body;
        const updateTask = await pool.query(
            `UPDATE task 
                SET title = $1, 
                    note = $2,
                    cat_id = $3,
                    prio = $4, 
                    stat_id = $5, 
                    threat_id = $6, 
                    deadline = $7, 
                    owner_id = $8
            WHERE id = $9 RETURNING *`,
            [ task.title, task.note, task.cat_id, task.prio, task.stat_id, task.threat_id, task.deadline, task.owner_id, id  ]
        );
        res.status(200).json(updateTask.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error});
    }
});
