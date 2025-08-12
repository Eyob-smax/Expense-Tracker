import { useState } from "react";
import Swal from "sweetalert2";
import { Button } from "../components/ui/button";
import { supabase } from "../supabase/supabaseClient";

export default function PasswordRecovery() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      Swal.fire("Error", "Email is required.", "error");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    setLoading(false);

    if (error) {
      Swal.fire("Error", error.message, "error");
      return;
    }

    Swal.fire("Success", "Password recovery email sent.", "success");
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Password Recovery</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <Button
          type="submit"
          className="w-full bg-stone-700 text-white p-2 rounded hover:bg-stone-800 transition "
        >
          {loading ? "Sending..." : "Send Recovery Email"}
        </Button>
      </form>
    </div>
  );
}
