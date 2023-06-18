declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
interface Window {
  cloudinary: any; // Typisierung für die 'cloudinary'-Eigenschaft
}
