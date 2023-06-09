import { HomePage } from "../pages";
import { SingIn } from "../components/SingIn/SignIn";
// import SingIn from "../components/SignIn/SignIn";

export const PageRoutes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/d",
    element: <SingIn />,
  },
  {
    path: "*",
    element: <p>Error</p>,
  },
];
