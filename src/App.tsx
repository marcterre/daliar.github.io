import "./App.scss";
import { Gallery } from "./components/Gallery/Gallery";
import { HomePage } from "./components/HomePage/HomePage";

function App() {
  return (
    <div className="App">
      <body>
        <HomePage />
        <Gallery />
      </body>
    </div>
  );
}

export default App;
