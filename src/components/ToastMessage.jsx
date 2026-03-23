import { useEffect } from "react";
import { Toast } from "bootstrap";

function ToastMessage({ id, message, type = "success" }) {
  useEffect(() => {
    const toastElement = document.getElementById(id);

    if (toastElement) {
      const toast = new Toast(toastElement);
      toast.show();
    }
  }, [id, message]);

  const headerText = type === "success" ? "✅ Success" : "❌ Error";
  const headerClass =
    type === "success" ? "bg-success text-white" : "bg-danger text-white";
  const bodyClass = type === "success" ? "text-dark" : "text-dark";

  return (
    <div
      className="toast position-fixed top-0 end-0 m-3"
      id={id}
      role="alert"
      data-bs-delay="2000"
      style={{ zIndex: 99999 }}
    >
      <div className={`toast-header ${headerClass}`}>
        <strong className="me-auto">{headerText}</strong>
        <button
          type="button"
          className={`btn-close ${type === "success" ? "btn-close-dark" : "btn-close-white"}`}
          data-bs-dismiss="toast"
        ></button>
      </div>

      <div className={`toast-body ${bodyClass}`}>{message}</div>
    </div>
  );
}

export default ToastMessage;
