import { useEffect, useRef } from "react";
import "./../assets/ViewDrawer.css";

function ViewDrawer({
  isOpen,
  onClose,
  title,
  icon,
  status, // ✅ NEW PROP
  sections = [],
  footer,
}) {
  const drawerRef = useRef(null);

  /* Close on Escape key */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKey);
    }

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  /* Lock body scroll */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      drawerRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const renderValue = (field) => {
    if (field.badge) {
      const s = String(field.value || "").toUpperCase();

      const colorMap = {
        ACTIVE: "#28a745",
        INACTIVE: "#dc3545",
        PENDING: "#ffc107",
        COMPLETED: "#17a2b8",
        IN_PROGRESS: "#fd7e14",
      };

      const bg = field.badgeColor || colorMap[s] || "#6c757d";

      return (
        <span className="vd-badge" style={{ backgroundColor: bg }}>
          {field.value || "N/A"}
        </span>
      );
    }

    return <span className="vd-value">{field.value || "N/A"}</span>;
  };

  return (
    <>
      {/* Backdrop */}
      <div className="vd-backdrop" onClick={onClose} />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="vd-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="vd-header">
          <div className="vd-header__left">
            {icon && (
              <span className="vd-header__icon">
                <i className={`bi ${icon}`}></i>
              </span>
            )}
            <h5 className="vd-header__title">{title}</h5>
          </div>

          <button className="vd-close" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* 🔥 STATUS BANNER AT TOP */}
        {status && (
          <div
            className={`vd-status-banner ${
              status === "ACTIVE"
                ? "vd-status-active"
                : "vd-status-inactive"
            }`}
          >
            {status === "ACTIVE" ? "● ACTIVE" : "● INACTIVE"}
          </div>
        )}

        {/* Body */}
        <div className="vd-body">
          {sections.map((section, si) => (
            <div key={si} className="vd-section">
              {section.heading && (
                <p className="vd-section__heading">
                  {section.heading}
                </p>
              )}

              <div className="vd-fields">
                {section.fields.map((field, fi) => (
                  <div key={fi} className="vd-field">
                    <span className="vd-label">{field.label}</span>
                    {renderValue(field)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {footer && <div className="vd-footer">{footer}</div>}
      </aside>
    </>
  );
}

export default ViewDrawer;