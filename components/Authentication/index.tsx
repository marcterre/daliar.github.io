"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

const Authentication = () => {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);

  const signInWithEmail = async () => {
    if (!email || !password) {
      console.error("Please fill out all fields");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error.message);
      return;
    }

    console.log("Signed In as:", data.user);
    setOpen(false);
    setEmail("");
    setPassword("");
  };

  return (
    <div>
      <div className="w-full flex justify-end">
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 text-white hover:underline"
        >
          Login
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-xl mb-4">Login</h2>
            <input
              type="email"
              placeholder="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full mb-3 rounded"
            />
            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full mb-4 rounded"
            />
            <button
              onClick={signInWithEmail}
              className="w-full bg-blue-600 text-white py-2 rounded mb-2"
            >
              Login
            </button>
            <button
              onClick={() => setOpen(false)}
              className="w-full text-gray-600 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Authentication;
