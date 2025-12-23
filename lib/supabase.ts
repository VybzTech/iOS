import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file and restart the app.');
}

export const supabase = createClient(SUPABASE_URL ,SUPABASE_ANON_KEY);

// SHOULD STILL WORK AS EXPECTED FOR SPECIFICITY
// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
//   auth: {
//     storage: AsyncStorage,
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   },
// });