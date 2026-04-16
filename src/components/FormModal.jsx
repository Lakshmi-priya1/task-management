import { useState } from "react";
import ReactDOM from "react-dom";
import "./../assets/FormModel.css";
 
function FormModal({
  isOpen,
  handleClose,
  title,
  tabs = [],       
  fields = [],     
  formData,
  setFormData,
  handleSubmit,
}) {
  const hasTabs = tabs.length > 0;
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || "");
 
  // Always call hooks before any early return
  if (!isOpen) return null;
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
 
  const renderField = (field) => {
    if (field.type === "select") {
      return (
        <div key={field.name} className="form-group mb-3">
          <label className="form-label fw-semibold">
            {field.label || field.name}
          </label>
          <select
            className="form-select"
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
          >
            <option value="">Select</option>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    }
 
    return (
      <div key={field.name} className="form-group mb-3">
        <label className="form-label fw-semibold">
          {field.label || field.name}
        </label>
        <input
          className="form-control"
          type={field.type || "text"}
          name={field.name}
          placeholder={field.placeholder || ""}
          value={formData[field.name] || ""}
          onChange={handleChange}
        />
      </div>
    );
  };
 
  const modalContent = (
    <>
      {/* Backdrop */}
      <div className="custom-backdrop" onClick={handleClose} />
 
      {/* Modal box */}
      <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
 
          {/* Header */}
          <div className="custom-header">
            <span>{title}</span>
            <button className="close" onClick={handleClose}>
              ×
            </button>
          </div>
 
          {/* Tabs (only in tabbed mode) */}
          {hasTabs && (
            <ul className="custom-tabs nav nav-pills px-3 pt-2">
              {tabs.map((tab) => (
                <li key={tab.key} className="nav-item">
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
          )}
 
          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-grid px-3 pt-3">
              {hasTabs
                ? tabs
                    .filter((tab) => tab.key === activeTab)
                    .flatMap((tab) => tab.fields.map(renderField))
                : fields.map(renderField)}
            </div>
 
            <div className="custom-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn custom-save-btn">
                Submit
              </button>
            </div>
          </form>
 
        </div>
      </div>
    </>
  );
 
  // Portal renders outside Dashboard stacking context — always on top
  return ReactDOM.createPortal(modalContent, document.body);
}
 
export default FormModal;