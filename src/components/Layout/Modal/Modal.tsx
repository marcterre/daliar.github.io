import "./Modal.styles.scss";

type ModalProps = {
  children: React.ReactNode;
};

export const Modal = (props: ModalProps) => {
  const { children } = props;
  return <div className="modal">{children}</div>;
};
