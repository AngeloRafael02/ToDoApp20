import { Response } from 'express';
import { Pool } from 'pg';
require('dotenv').config();

export const pool = new Pool({
  connectionString: process.env['DATABASE_URL'] as string,
});

/**
 * Helper function to handle database queries and standard responses
 * @param { string } query - The SQL string to execute
 * @param { Response } res - The Express response object
 * @param { unknown[] } params - Query Parameters
 * @param { boolean } expectEmpty - if empty must not return error 404
 */
export const query = async (
  res:Response,
  query:string,
  params:unknown[] = [],
  expectEmpty:boolean = false
) => {
    try {
        const result = await pool.query(query, params);
        if (expectEmpty === false && result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                data: ['Request not found.']
            });
        }
        return res.status(200).json({
            status: 'success',
            count: result.rowCount,
            data: result.rows
        });
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({
            status: 'error',
            data: ['Internal Server Error']
        });
    }
};
