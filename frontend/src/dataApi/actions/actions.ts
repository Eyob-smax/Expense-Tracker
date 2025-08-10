import { supabase } from "../../supabase/supabaseClient";
import { store } from "../../app/store";
import { addExpense, updateExpense } from "../../features/expense/expenseSlice";
import type { Params } from "react-router-dom";

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
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const categoryIds = (formData.get("categoryIds") as string)
    ? JSON.parse(formData.get("categoryIds") as string)
    : [];
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const quantity = formData.get("quantity") as string;
  const currency = formData.get("currency") as string;
  const priority = formData.get("priority") as "Low" | "Medium" | "High";

  if (categoryIds.includes("choose category")) {
    return { success: false, error: "Please select a valid category" };
  }

  if (!name || !price || !date) {
    return { success: false, error: "Title, price, and date are required" };
  }

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return { success: false, error: "User not authenticated" };
    }
    if (categoryIds.length > 0) {
      const { data: validCategories, error: categoriesError } = await supabase
        .from("category")
        .select("category_id")
        .in("category_id", categoryIds)
        .eq("user_id", userData.user.id);
      if (categoriesError || !validCategories) {
        return {
          success: false,
          error: "One or more category IDs are invalid",
        };
      }
    }

    const newExpense = await store
      .dispatch(
        addExpense({
          amount: Number(price),
          currency: currency || "USD",
          category_IDs: categoryIds,
          description: description,
          date: date,
          name,
          user_id: userData.user.id,
          quantity: Number(quantity) || 1,
          priority: priority || "Low",
        })
      )
      .unwrap();

    return {
      success: true,
      expense: newExpense,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to add expense";
    return { success: false, error: errorMessage };
  }
}

export async function editExpenseAction({
  request,
  params,
}: {
  request: Request;
  params: Params<string>;
}) {
  const { id } = params;
  const formData = await request.formData();
  const name = formData.get("title") as string;
  const price = formData.get("price") as string;
  const categoryIds = (formData.get("categoryIds") as string)
    ? JSON.parse(formData.get("categoryIds") as string)
    : [];
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const quantity = formData.get("quantity") as string;
  const currency = formData.get("currency") as string;
  const priority = formData.get("priority") as "Low" | "Medium" | "High";

  if (categoryIds.includes("choose category")) {
    return { success: false, error: "Please select a valid category" };
  }

  if (!name || !price || !date) {
    return { success: false, error: "Title, price, and date are required" };
  }
  if (!id) {
    return { success: false, error: "Expense ID mismatch" };
  }

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return { success: false, error: "User not authenticated" };
    }
    if (categoryIds.length > 0) {
      const { data: validCategories, error: categoriesError } = await supabase
        .from("category")
        .select("category_id")
        .in("category_id", categoryIds)
        .eq("user_id", userData.user.id);
      if (categoriesError || !validCategories) {
        return {
          success: false,
          error: "One or more category IDs are invalid",
        };
      }
    }

    const updatedExpense = await store
      .dispatch(
        updateExpense({
          id,
          updates: {
            amount: Number(price),
            currency: currency || "USD",
            category_IDs: categoryIds,
            description: description,
            date: date,
            name,
            user_id: userData.user.id,
            quantity: Number(quantity) || 1,
            priority: priority || "Medium",
          },
        })
      )
      .unwrap();

    return {
      success: true,
      expense: updatedExpense,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to edit expense";
    return { success: false, error: errorMessage };
  }
}
