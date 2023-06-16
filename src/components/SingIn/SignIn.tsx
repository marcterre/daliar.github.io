import { FormEvent, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { Button, Input } from "../Inputs";
import { useNavigate } from "react-router";

export const SingIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onSingIn = (e: FormEvent) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigate("/");
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };
  return (
    <>
      <main>
        <form>
          <div>
            <Input
              label="Email"
              labelId="email-address"
              type="email"
              handleChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Input
              label="password"
              type="password"
              handleChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Button handleClick={(e: FormEvent) => onSingIn(e)} label="Login" />
          </div>
        </form>
      </main>
    </>
  );
};

export default SingIn;
