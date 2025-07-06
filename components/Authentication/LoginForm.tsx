import { toast } from "react-toastify";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { FunctionComponent } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "../Button";

type LoginFormProps = {
  handlePasswordReset: () => void;
  handleClose: () => void;
};

const LoginForm: FunctionComponent<LoginFormProps> = ({
  handlePasswordReset,
  handleClose,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const supabase = createClient();

  const signInWithEmail = async () => {
    if (!email || !password) {
      toast.error("Please fill out all fields");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Error signing in: " + error.message);
      return;
    }

    toast.success("Signed in successfully");
    handleClose();
    setEmail("");
    setPassword("");
  };

  return (
    <div className="bg-black border border-white p-6 rounded-sm w-80">
      <h2 className="text-xl mb-4 text-white">Login</h2>
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border text-black p-2 w-full mb-3 rounded"
      />
      <div className="relative mb-2">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border text-white p-2 w-full rounded pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <Button
        text="Forgot password"
        handleClick={handlePasswordReset}
        type="link"
        className="text-sm ml-0 pl-0"
      />
      <div className="flex justify-evenly gap-2">
        <Button text="Cancel" handleClick={handleClose} type="link" />
        <Button text="Login" handleClick={signInWithEmail} type="black" />
      </div>
    </div>
  );
};

export default LoginForm;
