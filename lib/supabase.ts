import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
}

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseSecretKey
);