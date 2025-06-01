import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase

export type Idea = {
  id: number
  rank: number | null
  idea: string
  username: string
  user_id: string
  votes: number
  created_at: string
  updated_at: string
}

export type Vote = {
  id: number
  idea_id: number
  user_identifier: string
  vote_type: "up" | "down"
  created_at: string
}
