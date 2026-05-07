import { useEffect } from "react";
import { toast } from "react-toastify";

function ToastMessage({ message, type = "success" }) {
  useEffect(() => {
    if (type === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
  }, [message, type]);

  return null; // Since react-toastify handles the display
}

export default ToastMessage;
