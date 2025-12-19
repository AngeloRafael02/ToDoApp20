import express from 'express';
import { queryHelper } from '../database'

export const chartsRouter = express.Router();

chartsRouter.get('/categories/:id',async (req,res) => {
    const { id } = req.params;
    res.json(
        queryHelper(
            `SELECT COUNT(*), "Category" FROM task_view WHERE "UID" = $1 GROUP BY "Category";`,
            [id],
            true
        )
    );
});

chartsRouter.get('/status/:id',async (req,res) => {
    const { id } = req.params;
    res.json(
        queryHelper(
            `SELECT COUNT(*), "Status" FROM task_view WHERE "UID" = $1 GROUP BY "Status";`,
            [id],
            true
        )
    );
});

chartsRouter.get('/threats/:id',async (req,res) => {
    const { id } = req.params;
    res.json(
        queryHelper(
            `SELECT COUNT(*), "Threat Level" FROM task_view WHERE "UID" = $1 GROUP BY "Threat Level";`,
            [id],
            true
        )
    );
});