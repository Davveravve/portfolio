// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase URL and key
const supabaseUrl = 'https://omlfnsmwhfqihdtqbwnt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbGZuc213aGZxaWhkdHFid250Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MjYxODAsImV4cCI6MjA1NjAwMjE4MH0.wuEp9xLqhmKi9TDz5Sba3BZqpBf4CQL377ze-7kV1_w';

// For debugging
console.log("Initializing Supabase client with:", { supabaseUrl, supabaseAnonKey });

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;