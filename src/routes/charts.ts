import express from 'express';
import { pool } from '../database'

export const chartsRouter = express.Router();

chartsRouter.get('/categories',async (req,res) => {
    try {
        const result = await pool.query(`SELECT COUNT(*), "Category" FROM task_view GROUP BY "Category";`);
        res.json(result.rows);
    } catch (error){
        console.error('Database Query Error:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Failed to retrieve data from database.' 
        });
    }
});

chartsRouter.get('/status',async (req,res) => {
    try {
        const result = await pool.query(`SELECT COUNT(*), "Status" FROM task_view GROUP BY "Status";`);
        res.json(result.rows);
    } catch (error){
        console.error('Database Query Error:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Failed to retrieve data from database.' 
        });
    }
});

chartsRouter.get('/threats',async (req,res) => {
    try {
        const result = await pool.query(`SELECT COUNT(*), "Threat Level" FROM task_view GROUP BY "Threat Level";`);
        res.json(result.rows);
    } catch (error){
        console.error('Database Query Error:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Failed to retrieve data from database.' 
        });
    }
});