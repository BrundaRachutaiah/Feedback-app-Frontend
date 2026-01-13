import { Toast as BootstrapToast, ToastContainer } from "react-bootstrap";
import { useState, useEffect } from "react";

const Toast = ({ message, show, setShow, variant = "success" }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, setShow]);

  return (
    <ToastContainer position="bottom-end" className="p-3">
      <BootstrapToast
        onClose={() => setShow(false)}
        show={show}
        bg={variant}
        text="white"
      >
        <BootstrapToast.Header closeButton={false}>
          <strong className="me-auto">Notification</strong>
        </BootstrapToast.Header>
        <BootstrapToast.Body>{message}</BootstrapToast.Body>
      </BootstrapToast>
    </ToastContainer>
  );
};

export default Toast;