import { HomePage } from "../pages";
import { AuthenticationPage } from "../pages/AuthenticationPage";
import { Routes, Route } from "react-router-dom";

export const RoutesContext = () => {

const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/d",
    element: <AuthenticationPage />,
  },
  {
    path: "*",
    element: <p>Error</p>,
  },
];

return <Routes>
      {routes.map((route, index) => (
  <   Route key={index} path={route.path} element={route.element} />
      ))}
</Routes>

}

export default RoutesContext