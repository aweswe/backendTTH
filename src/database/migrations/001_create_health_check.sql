-- Create health_check table
CREATE TABLE IF NOT EXISTS public.health_check (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL DEFAULT 'healthy',
    last_checked TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    details JSONB DEFAULT '{}'::jsonb
); 