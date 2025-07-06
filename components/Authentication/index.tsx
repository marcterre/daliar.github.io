"use client";
import { useAuthentication } from "@/hooks/useAuthentication";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { toast } from "react-toastify";
import Toast from "../Toast";
import Button from "../Button";
import LoginForm from "./LoginForm";
import ModalOverlay from "../ModalOverlay";
import PasswordResetForm from "./PasswordResetForm";

export default function Authentication() {
  const [open, setOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const supabase = createClient();
  const { user } = useAuthentication();

  const handlePasswordReset = () => {
    setOpen(false);
    setResetModalOpen(true);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out: " + error.message);
    } else {
      toast.success("Signed out successfully");
    }
  };

  return (
    <div>
      <Toast />
      <div className="w-full flex justify-start fixed top-2 -right-2 z-50">
        {!user ? (
          <Button text="Login" handleClick={() => setOpen(true)} type="black" />
        ) : (
          <Button text="Logout" handleClick={handleLogout} type="black" />
        )}
      </div>
      {open && (
        <ModalOverlay>
          <LoginForm
            handlePasswordReset={handlePasswordReset}
            handleClose={() => setOpen(false)}
          />
        </ModalOverlay>
      )}
      {resetModalOpen && (
        <ModalOverlay>
          <PasswordResetForm
            resetEmail={resetEmail}
            setResetEmail={setResetEmail}
            handleClose={() => setResetModalOpen(false)}
          />
        </ModalOverlay>
      )}
    </div>
  );
}
