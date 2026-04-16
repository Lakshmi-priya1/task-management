import React, { useRef } from "react";
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
      return <span style={{ ...style, backgroundColor: "#28a745" }}>Active</span>;
    case "INACTIVE":
      return <span style={{ ...style, backgroundColor: "#dc3545" }}>Inactive</span>;
    case "PENDING":
      return <span style={{ ...style, backgroundColor: "#f59e0b" }}>Pending</span>;
    case "IN_PROGRESS":
      return <span style={{ ...style, backgroundColor: "#3b82f6" }}>In Progress</span>;
    case "COMPLETED":
      return <span style={{ ...style, backgroundColor: "#22c55e" }}>Completed</span>;
    default:
      return <span style={{ ...style, backgroundColor: "#6c757d" }}>N/A</span>;
  }
};

function DataTable({
  title,
  data = [],
  columns = [],
  fields = [],
  idField = "id",
  handleEdit,
  handleDelete,
  handleView,
  fileName,
  isEmployeeTable = false,

  // loading
  loading = false,

  loadMore,
  hasMore,
  page = 0,
  totalPages = 1,
  onPageChange,
}) {
  const observer = useRef();

  const lastRowRef = (node) => {
    if (!loadMore) return;
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });

    if (node) observer.current.observe(node);
  };

  return (
    <div className="datatable-card">
      <div className="datatable-header">
        <h4>{title}</h4>
        <ExportButtons data={data} columns={fields} fileName={fileName} />
      </div>
      <div className="datatable-table-wrapper">
        <table className={`datatable-table ${loading ? "loading" : ""}`}>
          <thead>
            <tr>
              <th>Id</th>
              {columns.map((col, i) => (
                <th key={i}>{col}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && data.length === 0 ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={columns.length + 2}>
                    <div className="skeleton-row"></div>
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="text-center">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const isLast = index === data.length - 1;

                return (
                  <tr
                    key={item[idField] || index}
                    ref={isLast ? lastRowRef : null}
                    className="datatable-row"
                  >
                    <td>{index + 1}</td>

                    {fields.map((field, i) => (
                      <td key={i}>
                        {field === "dueDate"
                          ? formatDate(item[field])
                          : field === "status" && isEmployeeTable
                          ? renderStatusBadge(item[field])
                          : field === "status"
                          ? renderStatusBadge(item[field])
                          : item[field] || "N/A"}
                      </td>
                    ))}

                    <td>
                      <div className="datatable-actions">
                        <button
                          onClick={() => handleView?.(item[idField])}
                          className="btn-action btn-view"
                        >
                          <i className="bi bi-eye"></i>
                        </button>

                        <button
                          onClick={() => handleEdit?.(item)}
                          className="btn-action btn-edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        <button
                          onClick={() => handleDelete?.(item[idField])}
                          className="btn-action btn-delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION UI (NEW) ================= */}
      {onPageChange && (
        <div className="pagination-container">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
          >
            Prev
          </button>

      <div className="page-numbers">

  {/* First page */}
  <button
    onClick={() => onPageChange(0)}
    className={page === 0 ? "page-number active" : "page-number"}
  >
    1
  </button>

  {/* Left dots */}
  {page > 3 && <span className="dots">...</span>}

  {/* Middle pages */}
  {Array.from({ length: totalPages }, (_, i) => i)
    .slice(
      Math.max(1, page - 1),
      Math.min(totalPages - 1, page + 2)
    )
    .map((num) => (
      <button
        key={num}
        onClick={() => onPageChange(num)}
        className={`page-number ${page === num ? "active" : ""}`}
      >
        {num + 1}
      </button>
    ))}

  {/* Right dots */}
  {page < totalPages - 4 && <span className="dots">...</span>}

  {/* Last page */}
  {totalPages > 1 && (
    <button
      onClick={() => onPageChange(totalPages - 1)}
      className={page === totalPages - 1 ? "page-number active" : "page-number"}
    >
      {totalPages}
    </button>
  )}

</div>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page + 1 >= totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* infinite scroll loading */}
      {loadMore && loading && data.length > 0 && (
        <div className="text-center p-2">Loading more...</div>
      )}
    </div>
  );
}

export default React.memo(DataTable);