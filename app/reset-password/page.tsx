"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const supabase = createClient();

  const handlePasswordChange = async () => {
    setError("");
    setSuccess("");

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Password updated successfully!");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error("Error updating password:", err);
    }

    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2">{success}</p>}
        <button
          onClick={handlePasswordChange}
          className="w-full bg-blue-600 text-white py-2 rounded mb-2"
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
