import { createClient } from '@supabase/supabase-js';

import { Database } from './db_types';
// import type { Database } from '../database.types';

const client = createClient<Database>(
  process.env.NEXT_PUBLIC_SB_PROJECT_URL || ``,
  process.env.NEXT_PUBLIC_SB_ANON_KEY || ``
);

export default client;
