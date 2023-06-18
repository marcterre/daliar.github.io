import "./LogoutButton.styles.scss";
import { signOut } from "@firebase/auth";
import { auth } from "../../../../utils/auth/firebase";
import { Link } from "react-router-dom";
import Logout from "../../../../asset/logout.svg";

type LogoutButtonProps = {
  // props
};

export const LogoutButton = () => {
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        window.location.reload();
        console.log("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
      });
  };
  return (
    <Link
      to="/"
      style={{
        width: "48px",
        position: "absolute",
        top: "6rem",
        right: "2rem",
      }}
      className="link"
      onClick={() => handleLogout()}
    >
      <img src={Logout} alt="logout" />
    </Link>
  );
};

export default LogoutButton;
