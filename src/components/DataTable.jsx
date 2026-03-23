import { useState, useMemo, useEffect } from "react";
import ExportButtons from "../components/ExportButtons";
import "./../assets/DataTable.css";

// ✅ Date formatter
const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function DataTable({
  title,
  data,
  columns,
  fields,
  handleEdit,
  handleDelete,
  handleView,
  fileName,
  rowsPerPageOptions = [5, 10, 20],
  defaultRowsPerPage = 5,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // 🔍 Filter
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const q = searchQuery.toLowerCase();

    return data.filter((item) =>
      fields.some((f) =>
        String(item[f] || "").toLowerCase().includes(q)
      )
    );
  }, [data, fields, searchQuery]);

  // 📄 Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchQuery, rowsPerPage, data]);

  return (
    <div className="datatable-card">
      {/* Header */}
      <div className="datatable-header">
        <h4>{title}</h4>
        <ExportButtons data={data} columns={fields} fileName={fileName} />
      </div>

      {/* Controls */}
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
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
        >
          {rowsPerPageOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt} rows
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="datatable-table-wrapper">
        <table className="datatable-table">
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
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="text-center">
                  No data available
                </td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => (
                <tr key={item.id} className="datatable-row">
                  <td>{(currentPage - 1) * rowsPerPage + idx + 1}</td>

                  {fields.map((field, i) => (
                    <td key={i}>
                      {field === "dueDate"
                        ? formatDate(item[field])
                        : item[field]}
                    </td>
                  ))}

                  <td className="datatable-actions">
                    {handleView && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(item.id);
                        }}
                        className="btn-action btn-view"
                        title="View"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    )}

                    {handleEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(item);
                        }}
                        className="btn-action btn-edit"
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                    )}

                    {handleDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="btn-action btn-delete"
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="datatable-pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DataTable;