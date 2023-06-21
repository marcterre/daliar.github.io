import { FormEvent, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { Button, Input } from "../../components/Inputs";
import { useNavigate } from "react-router";
import "./AuthenticationView.styles.scss";

export const AuthenticationView = () => {
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
        <form className="login-form" onSubmit={(e: FormEvent) => onSingIn(e)}>
          <Input
            variant="login-form"
            label="Email"
            labelId="email-address"
            type="email"
            handleChange={(e) => setEmail(e.target.value)}
          />
          <Input
            variant="login-form"
            label="password"
            type="password"
            handleChange={(e) => setPassword(e.target.value)}
          />
          <div className="login-button-wrapper">
            <Button variant="login-form-submit" type="submit" label="Login" />
            <Button
              type="button"
              variant="login-cancel"
              label="Cancel and go back"
              handleClick={() => console.log("go back to home")}
            />
          </div>
        </form>
      </main>
    </>
  );
};

export default AuthenticationView;
