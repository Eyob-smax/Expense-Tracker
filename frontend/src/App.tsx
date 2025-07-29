import { useState, type FormEvent } from "react";
import { Button } from "./components/ui/button";

// const supabase = createClient(
//   "https://psvusfqdkmfkayydmray.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzdnVzZnFka21ma2F5eWRtcmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NDEzNDIsImV4cCI6MjA2ODExNzM0Mn0.qw_5bnoHLV-GSEnZNsrF-9sRII0WbP353G_-dqWBJEI"
// );

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <div className="flex flex-col items-center justify-center shadow-md shadow-slate-900/10 min-w-[400px] rounded-md bg-white pb-10">
      <h1 className="mt-5 font-semibold text-[20px] mb-3 ">Supabase example</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-80">
        <div className="space-x-4 space-y-2 flex-col flex ">
          <label htmlFor="email" className="  font-semibold text-[#000000af]">
            Email
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className=" outline-2 outline-[#e4e4e4] px-2 py-1 rounded-[2px]"
          />
        </div>
        <div className="space-x-4 space-y-2 flex-col flex  ">
          <label
            htmlFor="password"
            className="  font-semibold text-[#000000af]"
          >
            Password
          </label>
          <input
            id="password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="************"
            className=" outline-2 outline-[#e4e4e4] px-2 py-1 rounded-[2px] "
          />
        </div>
        <div>
          <Button className="w-full">Submit</Button>
        </div>
      </form>
    </div>
  );
}
