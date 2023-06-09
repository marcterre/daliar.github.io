import "./App.scss";
import { Route, Routes } from "react-router-dom";
import { PageRoutes } from "./routes/PageRoutes";

function App() {
  return (
    <div className="App">
      <Routes>
        {PageRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </div>
  );
}

export default App;
