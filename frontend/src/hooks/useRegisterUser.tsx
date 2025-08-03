import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

export function useRegisterUser() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        setError(error?.message || "Failed to fetch session.");
      } else {
        const { error: upsertError } = await supabase.from("users").upsert({
          id: session?.user.id,
          username:
            session?.user.user_metadata.full_name ||
            session?.user.user_metadata.name ||
            "",
          email: session?.user.email || "",
          profile_picture: session?.user.user_metadata.avatar_url || "",
          role: session?.user.email === "eyobsmax@gmail.com" ? "admin" : "user",
        });
        if (upsertError) {
          setError(upsertError?.message || "Failed to upsert user data.");
        }
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { error, loading };
}
