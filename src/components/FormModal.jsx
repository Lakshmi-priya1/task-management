import { useState } from "react";

function FormModal({
  modalId,
  title,
  fields = [],
  tabs = null, // 🔥 NEW
  formData,
  setFormData,
  handleSubmit,
}) {

  const [activeTab, setActiveTab] = useState(
    tabs ? tabs[0].key : null
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 Reusable field renderer
  const renderFields = (fieldsList) => (
    <div className="form-grid">
      {fieldsList.map((field) =>
        field.type === "select" ? (
          <select
            key={field.name}
            name={field.name}
            className={`form-control mb-2 ${field.fullWidth ? "full-width" : ""}`}
            value={formData[field.name] || ""}
            onChange={handleChange}
          >
            <option value="">Select {field.name}</option>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            key={field.name}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            className={`form-control mb-2 ${field.fullWidth ? "full-width" : ""}`}
            value={formData[field.name] || ""}
            onChange={handleChange}
          />
        )
      )}
    </div>
  );

  return (
    <div className="modal fade" id={modalId}>
      <div className="modal-dialog"> {/* 🔥 wider */}
        <div className="modal-content">

          {/* HEADER */}
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          {/* BODY */}
          <div className="modal-body">

            {/* 🔥 TABS MODE */}
            {tabs ? (
              <>
                <ul className="nav nav-tabs mb-3">
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
                      <div key={tab.key}>
                        {renderFields(tab.fields)}
                      </div>
                    )
                )}
              </>
            ) : (
              // ✅ NORMAL MODE (Task modal stays same)
              renderFields(fields)
            )}

          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button
              className="btn btn-primary w-100"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default FormModal;