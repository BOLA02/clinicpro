-- Migration: Add missing columns to users and appointments tables
-- Run this in Supabase SQL editor (copy-paste whole file)

-- 1) Add phone column to users table if it doesn't exist
ALTER TABLE IF EXISTS public.users
ADD COLUMN IF NOT EXISTS phone text;

-- 2) Add service and mode columns to appointments table if they don't exist
ALTER TABLE IF EXISTS public.appointments
ADD COLUMN IF NOT EXISTS service text,
ADD COLUMN IF NOT EXISTS mode text;

-- End of file
