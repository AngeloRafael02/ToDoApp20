import express from 'express';
import { pool } from '../database'

export const taskRouter = express.Router();

taskRouter.get('/',async (req, res) => {
    try{
        const result = await pool.query('SELECT * FROM task_view;');
        res.json(result.rows);
    } catch (error){
        console.error('Database Query Error:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Failed to retrieve data from database.' 
        });
    }
});


taskRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM task_view WHERE id = $1;', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({
                status: 'error',
                message: `Task with ID ${id} not found.`
            });
        } else {
            res.json(result.rows);
        }
    } catch (error) {
        console.error('Database Query Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching the task.'
        });
    }
});