import InstaSvg from "../../asset/instagram.svg";
import EmailSvg from "../../asset/email-outline.svg";
import { AddImage } from "../../components/Inputs/Button/AddImageButton/AddImage";
import "./HomePageView.styles.scss";
import { GalleryView } from "../GalleryView/GalleryView";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { LogoutLink } from "../../components/Auth/LogoutButton";

export const HomePageView = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        setIsAuth(true);
        // ...
        console.log("uid", uid);
      } else {
        // User is signed out
        // ...
        console.log("user is logged out");
      }
    });
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  return (
    <>
      <header>
        <div className="logoWrapper">
          <a
            target="_blank"
            href="https://instagram.com/da__liar?igshid=MzRlODBiNWFlZA=="
            rel="noreferrer"
          >
            <img className="svg" src={InstaSvg} alt="link to instagram" />
          </a>
          <a href="mailto:marc.terre10@gmail.com">
            <img className="svg" src={EmailSvg} alt="link to email" />
          </a>
        </div>
        {isAuth && (
          <>
            <AddImage />
            <LogoutLink />
          </>
        )}
        <div className="wrapper">
          <h1>Lia Dingeldein</h1>
          <h2>character designer</h2>
        </div>
      </header>
      <GalleryView />
    </>
  );
};
