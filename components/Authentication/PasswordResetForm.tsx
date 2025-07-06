import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";
import Button from "../Button";

interface PasswordResetFormProps {
  resetEmail: string;
  setResetEmail: (email: string) => void;
  handleClose: () => void;
}

const PasswordResetForm = ({
  resetEmail,
  setResetEmail,
  handleClose,
}: PasswordResetFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handlePasswordReset = async () => {
    if (!resetEmail.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast.error("Error resetting password: " + error.message);
      } else {
        toast.success("Password reset email sent!");
        handleClose();
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black border border-white p-6 rounded-sm w-80">
      <h2 className="text-xl mb-4 text-white">Reset Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={resetEmail}
        onChange={(e) => setResetEmail(e.target.value)}
        className="border p-2 w-full mb-4 rounded text-black"
        disabled={isLoading}
      />
      <div className="flex justify-evenly gap-2">
        <Button text="Cancel" handleClick={handleClose} type="link" />
        <Button
          text="Send Email"
          handleClick={handlePasswordReset}
          disabled={isLoading}
          type="black"
        />
      </div>
    </div>
  );
};

export default PasswordResetForm;
