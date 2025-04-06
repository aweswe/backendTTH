// Test Supabase connectivity
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for admin access

console.log('Connecting to Supabase at:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public',
  },
});

async function testSupabase() {
  try {
    console.log('Testing Supabase connection...');
    
    // Try simple query that doesn't require specific table names
    console.log('Trying simple query...');
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error querying user table:', error);
      
      try {
        console.log('Trying to get schema with SQL query...');
        // Direct SQL query to get table names
        const { data: tables, error: sqlError } = await supabase
          .rpc('exec', { 
            query: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'" 
          });
          
        if (sqlError) {
          console.log('SQL query failed:', sqlError);
        } else {
          console.log('Tables in public schema:', tables);
        }
      } catch (sqlErr) {
        console.error('SQL query exception:', sqlErr);
      }
    } else {
      console.log('Successfully connected to Supabase!');
      console.log('User data:', data);
    }
  } catch (err) {
    console.error('Exception during Supabase test:', err);
  }
}

testSupabase(); 