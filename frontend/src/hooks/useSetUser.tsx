import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoginData } from "../features/auth/authSlice";
import { supabase } from "../supabase/supabaseClient";

export default function useSetUser() {
  const dispatch = useDispatch();
  useEffect(() => {
    const restoreUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        dispatch(
          setLoginData({
            username: user.user_metadata?.user_name || user.user_metadata?.name,
            email: user.email,
            profilePicture: user.user_metadata?.avatar_url,
          })
        );
      }
    };

    restoreUser();
  }, [dispatch]);
}
