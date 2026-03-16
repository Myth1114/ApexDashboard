import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://asdtoaircrhbykoaczpq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZHRvYWlyY3JoYnlrb2FjenBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NzY5MTMsImV4cCI6MjA4OTE1MjkxM30.1IhefPda8j1UjbrJtA9iIDVEVZEmJfIkQS9acxTBC0Y";

export const supabase = createClient(supabaseUrl, supabaseKey);
