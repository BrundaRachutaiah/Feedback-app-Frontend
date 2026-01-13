import { Button as BootstrapButton } from "react-bootstrap";

const Button = ({ children, onClick, type = "button", disabled = false, variant = "primary", className = "" }) => {
  return (
    <BootstrapButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      className={className}
    >
      {children}
    </BootstrapButton>
  );
};

export default Button;