import express from 'express';
import { queryHelper } from '../database'

export const taskRouter = express.Router();

taskRouter.get('/tasks:id',async (req, res) => {
    const { id } = req.params;
    res.json(
        queryHelper(
            `SELECT * FROM task_view WHERE "UID" = $1 AND "Status" NOT IN('Finished','Cancelled');`,
            [id],
            true
        )
    );
});

taskRouter.get('/task/:id', async (req, res) => {
    const { id } = req.params;
    res.json(
        queryHelper(
            'SELECT * FROM task_view WHERE id = $1 LIMIT 1;',
            [id]
        )
    );
});

taskRouter.get('/columns/:table', async (req, res) => {
    const { table } = req.params;
    res.json(
        queryHelper(
            ` SELECT column_name FROM information_schema.columns WHERE table_name = $1 `,
            [table]
        )
    );
});