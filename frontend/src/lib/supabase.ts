import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bwvykwcbuxefyrxpzebg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3dnlrd2NidXhlZnlyeHB6ZWJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTE3MjIsImV4cCI6MjA4ODc4NzcyMn0.kkZq8DV_11TzWqRHzxhxzYhYs1iw0G9A7fRmU0rXQfk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
