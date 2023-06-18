import InstaSvg from "../../asset/instagram.svg";
import EmailSvg from "../../asset/email-outline.svg";
import arrowDown from "../../asset/arrow-down.svg";
import "./HomePageView.styles.scss";
import { GalleryView } from "../GalleryView/GalleryView";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../utils/auth/firebase";
import { LogoutButton } from "../../components/Inputs/Button/LogoutButton";
import ButtonExpander from "../../components/Inputs/Button/ButtonExpander/ButtonExpander";
import { HomePageViewExpander } from "./contents";

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
  }, [isAuth]);

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
            <HomePageViewExpander />
            <LogoutButton />
          </>
        )}
        <div className="wrapper">
          <h1>Lia Dingeldein</h1>
          <h2>character designer</h2>
        </div>
        <div className="button-wrapper">
          <button
            type="button"
            className="gallery-link"
            onClick={() => scrollToSection("gallery")}
          >
            <img className="svg" src={arrowDown} alt="go to gallery" />
          </button>
          <p>go to my gallery</p>
        </div>
      </header>
      <GalleryView />
    </>
  );
};
