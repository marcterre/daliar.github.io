import { FunctionComponent } from "react";

type OwnItemsGridProps = {
  items: any[];
  isLoading: boolean;
  error: string | null;
};
const OwnItemsGrid: FunctionComponent<OwnItemsGridProps> = ({
  items,
  isLoading,
  error,
}) => {
  return (
    <div className="grid gap-2 mt-2 overflow-y-auto w-[600px] max-h-[350px] scrollbar-hide">
      <button className="w-fit hover:bg-slate-200 active:bg-slate-300 p-1">
        + add textblock
      </button>
      <div className="h-[2px] w-full bg-slate-300 mb-2"></div>
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          gridAutoRows: "150px",
        }}
      >
        {items.map((item, index) => {
          return (
            <div
              key={item.id || index}
              className="p-2 border border-gray-400 rounded text-center text-black flex items-center justify-center"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, #212222 25%, transparent 25%, transparent 75%, #212222 75%, #212222), linear-gradient(45deg, #212222 25%, #000 25%, #000 75%, #212222 75%, #212222)",
                backgroundSize: "45px 45px",
                backgroundPosition: "0 0, 20px 20px",
              }}
            >
              {isLoading ? (
                <div className="animate-pulse bg-gray-300 h-full w-full rounded"></div>
              ) : error ? (
                <p>{error}</p>
              ) : (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OwnItemsGrid;
