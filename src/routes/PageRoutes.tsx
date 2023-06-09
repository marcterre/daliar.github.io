import { HomePage } from "../pages";

export const PageRoutes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/Bananasplit",
    element: <p>Hello</p>,
  },
  {
    path: "*",
    element: <p>Error</p>,
  },
];
