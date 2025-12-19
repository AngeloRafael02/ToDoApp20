import express from 'express';
import { queryHelper } from '../database'

export const utilsRouter = express.Router();

utilsRouter.get('/categories', async (req,res)=> {
    res.json(queryHelper(`SELECT id, cat FROM categories;`));
});

utilsRouter.get('/status', async (req,res)=> {
    res.json(queryHelper(`SELECT id, stat FROM conditions;`));
});

utilsRouter.get('/threats', async (req,res)=> {
    res.json(queryHelper(`SELECT id, level FROM threats;`));
});