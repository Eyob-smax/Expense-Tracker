import { supabase } from "../../supabase/supabaseClient";
import { store } from "../../app/store";
import { addExpense } from "../../features/expense/expenseSlice";

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

export async function addExpenseAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const { name, price, categoryIds, description, date, quantity, currency } =
    Object.fromEntries(formData);

  if (!name || !price || !categoryIds || !date) {
    console.log("incomplete data");
    console.log(name, categoryIds, description, date);
    return { success: false, error: "Incomplete Data" };
  }
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      throw new Error("Can't fetch user data");
    }
    if (!userData || !userData.user?.id) return;
    const { data: expenseData, error: expenseError } = await supabase
      .from("expense")
      .insert({
        amount: Number(price),
        date: date.toString(),
        user_id: userData.user?.id,
        name: name.toString(),
        currency: currency.toString(),
        description: description.toString(),
        quantity: quantity ? parseInt(quantity.toString(), 10) : 1,
      })
      .select("expense_id");

    if (expenseError) {
      throw new Error("Can't insert expense to db");
    }
    await store
      .dispatch(
        addExpense({
          amount: Number(price),
          date: date.toString(),
          user_id: userData.user?.id,
          name: name.toString(),
          currency: currency.toString(),
          description: description.toString(),
          expense_id: expenseData?.expense_id,
        })
      )
      .unwrap();
  } catch (error) {
    console.log(error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
  return { success: true };
}
