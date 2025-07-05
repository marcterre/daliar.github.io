"use client";
import { useAuthentication } from "@/hooks/useAuthentication";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { toast } from "react-toastify";
import Toast from "../Toast";

export default function Authentication() {
  const [open, setOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const supabase = createClient();

  const { user } = useAuthentication();

  const signInWithEmail = async () => {
    if (!email || !password) {
      toast.error("Please fill out all fields");
      console.error("Please fill out all fields");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Error signing in: " + error.message);
      console.error("Error signing in:", error.message);
      return;
    }

    toast.success("Signed in successfully");
    setOpen(false);
    setEmail("");
    setPassword("");
  };

  const resetPassword = () => {
    setResetModalOpen(true);
  };

  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        alert("Error resetting password: " + error.message);
      } else {
        alert("Password reset email sent!");
        setResetModalOpen(false);
      }
    } catch (err) {
      console.error("Error resetting password:", err);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      toast.success("Signed out successfully");
      console.log("Signed out successfully");
    }
  };

  return (
    <div>
      <Toast />
      <div className="w-full flex justify-start">
        {!user ? (
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 text-white hover:underline"
          >
            Login
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white hover:underline"
          >
            Logout
          </button>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
              onClick={resetPassword}
              type="button"
              className="text-blue-600 mb-2"
            >
              Forgot password
            </button>
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
      {resetModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-xl mb-4">Reset Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="border p-2 w-full mb-4 rounded"
            />
            <button
              onClick={handlePasswordReset}
              className="w-full bg-blue-600 text-white py-2 rounded mb-2"
            >
              Send Reset Email
            </button>
            <button
              onClick={() => setResetModalOpen(false)}
              className="w-full text-gray-600 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
