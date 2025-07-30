import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://psvusfqdkmfkayydmray.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzdnVzZnFka21ma2F5eWRtcmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NDEzNDIsImV4cCI6MjA2ODExNzM0Mn0.qw_5bnoHLV-GSEnZNsrF-9sRII0WbP353G_-dqWBJEI"
);
