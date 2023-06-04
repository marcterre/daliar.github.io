import "./App.scss";
import { GalleryView } from "./views/GalleryView/GalleryView";
import { HomePage } from "./views/HomePage/HomePage";

function App() {
  return (
    <div className="App">
      <body>
        <HomePage />
        <GalleryView />
      </body>
    </div>
  );
}

export default App;
