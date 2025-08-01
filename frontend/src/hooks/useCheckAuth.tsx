import { useDispatch } from "react-redux";
import type { TAppDispatch } from "../app/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import { setLogout } from "../features/auth/authSlice";

export default function useCheckAuth() {
  const dispatch = useDispatch<TAppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login");
        dispatch(setLogout());
      }
    };
    checkAuth();
  }, [navigate, dispatch]);

  return null;
}
