import {
  Grid,
  SearchBar,
  SearchContext,
  SuggestionBar,
} from "@giphy/react-components";
import { useContext } from "react";

const Components = () => {
  const { fetchGifs, searchKey } = useContext(SearchContext);
  return (
    <div className="max-w-[600px]">
      <div className="grid gap-2 sticky top-0 z-10 w-[600px] scrollbar-hide bg-slate-100">
        <SearchBar />
        <SuggestionBar />
      </div>
      <Grid key={searchKey} columns={3} width={600} fetchGifs={fetchGifs} />
    </div>
  );
};

export default Components;
