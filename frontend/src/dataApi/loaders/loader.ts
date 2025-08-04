import { supabase } from "../../supabase/supabaseClient";

export default async function expenseLoader() {
  const { data, error } = await supabase.from("expense").select("*");
  return { data, error };
}
