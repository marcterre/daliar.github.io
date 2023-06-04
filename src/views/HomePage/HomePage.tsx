import InstaSvg from "../../asset/instagram.svg";
import EmailSvg from "../../asset/email-outline.svg";
import arrowDown from "../../asset/arrow-down.svg";
import "./HomePage.scss";

export const HomePage = () => {
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
  );
};
