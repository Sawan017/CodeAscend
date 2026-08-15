import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

// I can't run SET ROLE over the REST API using anon key. 
// I need the user to run it in SQL Editor.
