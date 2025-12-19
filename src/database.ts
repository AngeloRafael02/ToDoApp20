import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env['DATABASE_URL'],
});

export const queryHelper = async (
  query:string, 
  params:unknown[] = [],
  expectEmpty:boolean = false
) => {
  try {
    const result = await pool.query(query, params);
    if (expectEmpty && result.rows.length === 0) {
      return { 
        status: 'error', 
        message: `Request not found.` 
      }
    } else {
      return {
        status:'success',
        count:result.rowCount,
        data:result.rows
      }
      
    }
  } catch (error) {
    return { 
      status: 'error', 
      message: 'An error occurred while fetching the task.' 
    }
  }
}