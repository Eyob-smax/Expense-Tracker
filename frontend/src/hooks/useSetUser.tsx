import { useDispatch } from "react-redux";
import type { TAppDispatch } from "../app/store";
import { supabase } from "../supabase/supabaseClient";
import { setLoginData } from "../features/auth/authSlice";

export default function useSetUser() {
  const dispatch = useDispatch<TAppDispatch>();

  const setUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error);
      return;
    }
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
  return null;
}
