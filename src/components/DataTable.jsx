import { useState, useMemo } from "react";
import ExportButtons from "../components/ExportButtons";
import "./../assets/DataTable.css";

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const renderStatusBadge = (status) => {
  const s = status?.toUpperCase();
  const style = {
    padding: "4px 10px",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "0.85rem",
    display: "inline-block",
    minWidth: "70px",
    textAlign: "center",
    color: "#fff",
  };

  switch (s) {
    case "ACTIVE":
      return (
        <span style={{ ...style, backgroundColor: "#28a745" }}>Active</span>
      );
    case "INACTIVE":
      return (
        <span style={{ ...style, backgroundColor: "#dc3545" }}>Inactive</span>
      );
    default:
      return <span style={{ ...style, backgroundColor: "#6c757d" }}>N/A</span>;
  }
};

function DataTable({
  title,
  data,
  columns,
  fields,
  idField = "id",
  handleEdit,
  handleDelete,
  handleView,
  fileName,
  currentPage = 0,
  totalPages = 1,
  onPageChange = () => {},
  rowsPerPage = 5,
  onRowsChange = () => {},
  rowsPerPageOptions = [5, 10, 20],
  isEmployeeTable = false,
  loading = false,
}) {
  data = data || [];
  fields = fields || [];
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!data.length) return [];
    if (!searchQuery) return data;

    const q = searchQuery.toLowerCase();
    return data.filter((item) =>
      fields.some((f) =>
        String(item[f] || "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [data, fields, searchQuery]);

  return (
    <div className="datatable-card">
      <div className="datatable-header">
        <h4>{title}</h4>
        <ExportButtons data={data} columns={fields} fileName={fileName} />
      </div>

      <div className="datatable-controls">
        <input
          type="text"
          className="datatable-search"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="datatable-rows"
          value={rowsPerPage}
          onChange={(e) => onRowsChange(Number(e.target.value))}
        >
          {rowsPerPageOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt} rows
            </option>
          ))}
        </select>
      </div>

      <div className="datatable-table-wrapper">
        <table className={`datatable-table ${loading ? "loading" : ""}`}>
          <thead>
            <tr>
              <th>ID</th>
              {columns.map((col, i) => (
                <th key={i}>{col}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && data.length === 0 ? (
              Array.from({ length: rowsPerPage }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={columns.length + 2}>
                    <div className="skeleton-row"></div>
                  </td>
                </tr>
              ))
            ) : filteredData.length === 0 ? (
              <tr className="no-data-row">
                <td colSpan={columns.length + 2}>No data available</td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={item[idField] || index} className="datatable-row">
                  <td>{currentPage * rowsPerPage + index + 1}</td>

                  {fields.map((field, i) => (
                    <td key={i}>
                      {field === "dueDate"
                        ? formatDate(item[field])
                        : field === "status" && isEmployeeTable
                          ? renderStatusBadge(item[field])
                          : item[field] || "N/A"}
                    </td>
                  ))}

                  <td>
                    <div className="datatable-actions">
                      <button
                        onClick={() => handleView?.(item[idField])}
                        className="btn-action btn-view"
                        title="View"
                      >
                        <i className="bi bi-eye"></i>
                      </button>

                      <button
                        onClick={() => handleEdit?.(item)}
                        className="btn-action btn-edit"
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>

                      <button
                        onClick={() => handleDelete?.(item[idField])}
                        className="btn-action btn-delete"
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="datatable-pagination">
        <button
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i ? "active" : ""}
            onClick={() => onPageChange(i)}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DataTable;
