import express from 'express';
import { pool } from '../database'

export const utilsRouter = express.Router();

utilsRouter.get('categories',async (req,res)=> {
    try{
        const result = await pool.query('SELECT id, cat FROM categories;');
        res.json({
            status: 'success',
            count: result.rowCount,
            data: result.rows,
        });
    } catch (error){
        console.error('Database Query Error:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Failed to retrieve data from database.' 
        });
    }
});

utilsRouter.get('status',async (req,res)=> {
    try{
        const result = await pool.query('SELECT id, stat FROM conditions;');
        res.json({
            status: 'success',
            count: result.rowCount,
            data: result.rows,
        });
    } catch (error){
        console.error('Database Query Error:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Failed to retrieve data from database.' 
        });
    }
});

utilsRouter.get('threats',async (req,res)=> {
    try{
        const result = await pool.query('SELECT id, level FROM threats;');
        res.json({
            status: 'success',
            count: result.rowCount,
            data: result.rows,
        });
    } catch (error){
        console.error('Database Query Error:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Failed to retrieve data from database.' 
        });
    }
});