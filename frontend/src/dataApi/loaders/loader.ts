import { supabase } from "../../supabase/supabaseClient";

export default async function expenseLoader() {
  const { data, error } = await supabase.from("expense").select("*");
  return { data, error };
}

export async function categoryLoader() {
  const { data, error } = await supabase.from("category").select("*");
  return { data, error };
}
