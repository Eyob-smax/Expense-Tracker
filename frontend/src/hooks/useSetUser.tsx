import { useDispatch } from "react-redux";
import type { TAppDispatch } from "../app/store";
import { supabase } from "../supabase/supabaseClient";
import { setLoginData } from "../features/auth/authSlice";
import { useEffect } from "react";

export default function useSetUser() {
  const dispatch = useDispatch<TAppDispatch>();
  useEffect(() => {
    const setUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error || !session) {
        return;
      }
      const user = session.user;

      if (user) {
        const userData = {
          username: user.user_metadata.username || "",
          email: user.email || "",
          profilePicture: user.user_metadata.avatar_url || "",
        };
        dispatch(setLoginData(userData));
      } else {
        console.warn("No user found");
      }
    };
    setUser();
  });

  return null;
}
