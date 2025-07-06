import { FunctionComponent } from "react";

type ModalOverlayProps = {
  children: React.ReactNode;
};

const ModalOverlay: FunctionComponent<ModalOverlayProps> = ({ children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {children}
    </div>
  );
};

export default ModalOverlay;
