import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://eesnxqgmcpmhdqtjykcu.supabase.co";
const SUPABASE_KEY = "sb_publishable_SVlxt2M5IVlvDyUOmZc9qw_v-L9c1l8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
