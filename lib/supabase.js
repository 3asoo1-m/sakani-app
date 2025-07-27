import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xegvkhwjrrvsprykxdcg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZ3ZraHdqcnJ2c3ByeWt4ZGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NjgzMzksImV4cCI6MjA2OTE0NDMzOX0.cece4I2j8FPT3GNH-vf7pngEcgUXsX2TWNp127i2ALU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)