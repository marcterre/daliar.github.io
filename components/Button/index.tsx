import { FunctionComponent } from "react";

type ButtonType = "black" | "link";

type ButtonProps = {
  text?: string;
  handleClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
  type: ButtonType;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  handleMouseEnter?: (e: React.MouseEvent<Element, MouseEvent>) => void;
  handleMouseLeave?: (e: React.MouseEvent<Element, MouseEvent>) => void;
  handleMouseDown?: (e: React.MouseEvent<Element, MouseEvent>) => void;
};

const Button: FunctionComponent<ButtonProps> = ({
  text,
  handleClick,
  type,
  className,
  icon,
  disabled,
  handleMouseEnter,
  handleMouseLeave,
  handleMouseDown,
}) => {
  const renderStyle = (type: ButtonType) => {
    const baseStyle = `w-fit flex m-2 px-3 py-1 transition-all duration-200 ease-in-out transform active:scale-95 shadow-md hover:shadow-lg ${className}`;

    switch (type) {
      case "black":
        return `${baseStyle} hover:text-pink-500 outline outline-offset-2 hover:outline-pink-700 text-white bg-black`;
      case "link":
        return `${baseStyle} hover:underline hover:text-pink-500 hover:underline-pink-700 text-white bg-transparent`;
      default:
        return baseStyle;
    }
  };

  return (
    <button
      className={renderStyle(type)}
      onClick={handleClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
    >
      {icon && <span>{icon}</span>}
      {text && text}
    </button>
  );
};

export default Button;
