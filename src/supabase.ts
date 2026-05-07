import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xptkmjzdmaprhxkwmtep.supabase.co'
const supabaseKey = 'sb_publishable_NWDGAft1CYr-1BDXEeZkiA_5gVCauEV'

export const supabase = createClient(supabaseUrl, supabaseKey)