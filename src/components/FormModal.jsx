import { useState, useEffect } from "react";
import "./../assets/FormModel.css";

function FormModal({
  modalId,
  title,
  fields = [],
  tabs = null,
  formData,
  setFormData,
  handleSubmit,
}) {
  const [activeTab, setActiveTab] = useState(tabs ? tabs[0].key : null);

  useEffect(() => {
    const modalEl = document.getElementById(modalId);

    if (modalEl) {
      const handleOpen = () => {
        if (tabs && tabs.length > 0) {
          setActiveTab(tabs[0].key);
        }
      };

      modalEl.addEventListener("show.bs.modal", handleOpen);

      return () => {
        modalEl.removeEventListener("show.bs.modal", handleOpen);
      };
    }
  }, [modalId, tabs]);

  const formatLabel = (name) => {
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const handleChange = (e) => {
    let value = e.target.value;

    if (e.target.name === "employeeIds" || e.target.name === "milestones") {
      value = value.replace(/\s*,\s*/g, ", ");
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const renderFields = (fieldsList) => (
    <div className="form-grid">
      {fieldsList.map((field) => (
        <div
          key={field.name}
          className={`form-group ${
            field.fullWidth ? "full-width" : ""
          }`}
        >
          <div className="floating-group input-with-icon">
            
            

            {/* INPUT / SELECT */}
            {field.type === "select" ? (
              <select
                name={field.name}
                className="form-control custom-input"
                value={formData[field.name] || ""}
                onChange={handleChange}
                required
              >
                <option value=""></option>
                {(field.options || []).map((opt, index) => (
                  <option key={index} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                className="form-control custom-input"
                value={formData[field.name] || ""}
                onChange={handleChange}
                required
                placeholder=" "
              />
            )}

            {/* FLOAT LABEL */}
            <label>{field.placeholder || formatLabel(field.name)}</label>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="modal fade custom-modal" id={modalId}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">

          {/* HEADER */}
          <div className="modal-header custom-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          {/* BODY */}
          <div className="modal-body">
            {tabs ? (
              <>
                <ul className="nav nav-tabs custom-tabs mb-3">
                  {tabs.map((tab) => (
                    <li className="nav-item" key={tab.key}>
                      <button
                        type="button"
                        className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
                        onClick={() => setActiveTab(tab.key)}
                      >
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>

                {tabs.map(
                  (tab) =>
                    activeTab === tab.key && (
                      <div key={tab.key}>{renderFields(tab.fields)}</div>
                    )
                )}
              </>
            ) : (
              renderFields(fields)
            )}
          </div>

          {/* FOOTER */}
          <div className="modal-footer custom-footer">
            <button className="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>

            <button className="btn btn-primary custom-save-btn" onClick={handleSubmit}>
              Save
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default FormModal;