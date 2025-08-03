import { supabase } from "../../supabase/supabaseClient";

export async function formAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const type = formData.get("type") as "login" | "signup";
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string | null;

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  if (type === "signup") {
    if (!username) {
      return { success: false, error: "Username is required for signup." };
    }

    // Check if user with email or username already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .or(
        `email.eq.${encodeURIComponent(email)},username.eq.${encodeURIComponent(
          username
        )}`
      )
      .maybeSingle();

    if (checkError) {
      return { success: false, error: "Failed to validate user existence." };
    }

    if (existingUser) {
      return {
        success: false,
        error: "User already exists with this email or username.",
      };
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
        options: {
          data: { username },
        },
      }
    );

    if (signUpError || !signUpData.user) {
      return {
        success: false,
        error: signUpError?.message || "Signup failed.",
      };
    }

    // Add additional user data to your `users` table
    const { error: insertError } = await supabase.from("users").insert({
      email,
      username,
      role: email === "eyobsmax@gmail.com" ? "admin" : "user",
      id: signUpData.user.id,
    });

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    return {
      success: true,
      user: {
        username: signUpData.user.user_metadata?.username || "",
        email: signUpData.user.email,
        profilePicture: signUpData.user.user_metadata?.avatar_url || "",
      },
    };
  }

  // LOGIN
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (signInError || !signInData.user) {
    return { success: false, error: signInError?.message || "Login failed." };
  }

  const userMeta = signInData.user.user_metadata;

  return {
    success: true,
    user: {
      username: userMeta?.username || userMeta?.full_name || "",
      email: signInData.user.email,
      profilePicture: userMeta?.avatar_url || "",
    },
  };
}
