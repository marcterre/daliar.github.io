import { SearchContextManager } from "@giphy/react-components";
import Components from "./Components";

const API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY;

const GiphyGrid = () => {
  return (
    <div className="h-[350px] w-[600px] overflow-scroll scrollbar-hide">
      <SearchContextManager
        apiKey={API_KEY as string}
        options={{
          type: "stickers",
        }}
      >
        <Components />
      </SearchContextManager>
    </div>
  );
};
export default GiphyGrid;
