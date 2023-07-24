import "./LogoutLink.styles.scss";
import { signOut } from "@firebase/auth";
import { auth } from "../../../utils/firebase";
import { Link } from "react-router-dom";

export const LogoutLink = () => {
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
      className="logout-link button--add-image"
      onClick={() => handleLogout()}
    >
      Logout
    </Link>
  );
};

export default LogoutLink;
