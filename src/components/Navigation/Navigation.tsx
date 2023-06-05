import { Link } from "react-router-dom";
import "./Navigation.scss";

export const Navigation = () => {
  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/add">+</Link>
      </li>
    </ul>
  );
};
