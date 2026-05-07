import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Pagination,
  CircularProgress,
  Tooltip,
  IconButton,
  Typography,
} from "@mui/material";

import {
  Visibility,
  Edit,
  Delete,
  InboxRounded,
  PersonAddRounded,
  PersonRemoveRounded,
} from "@mui/icons-material";

/* ================= HELPERS ================= */

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusChip = (status) => {
  const s = status?.toUpperCase();

  const styles = {
    ACTIVE: {
    label: "Active",
    bg: "#dcfce7",
    color: "#15803d", // green
  },

  INACTIVE: {
    label: "Inactive",
    bg: "#fdefef",
    color: "#dc2626", 
  },

  PENDING: {
    label: "Pending",
    bg: "#fef3c7",
    color: "#b45309", // amber
  },

  IN_PROGRESS: {
    label: "In Progress",
    bg: "#dbeafe",
    color: "#1d4ed8", // blue
  },

  COMPLETED: {
    label: "Completed",
    bg: "#dcfce7",
    color: "#16a34a", // green (success)
  },

  // 🚀 PRIORITY (fully contrasting, no purple repetition)

  LOW: {
    label: "Low",
    bg: "#ecfeff",
    color: "#0891b2", // cyan
  },

  MEDIUM: {
    label: "Medium",
    bg: "#fef9c3",
    color: "#ca8a04", // yellow/amber
  },

  HIGH: {
    label: "High",
    bg: "#fee2e2",
    color: "#dc2626", // red
  },
  };

  const style = styles[s] || { label: status || "N/A", bg: "#f1f5f9", color: "#64748b" };

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: 1.5,
        py: 0.4,
        borderRadius: "999px",
        backgroundColor: style.bg,
        color: style.color,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.3,
        whiteSpace: "nowrap",
      }}
    >
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: style.color,
        }}
      />
      {style.label}
    </Box>
  );
};

/* ================= COMPONENT ================= */

function DataTable({
  data = [],
  columns = [],
  fields = [],
  idField = "id",
  handleEdit,
  handleDelete,
  handleView,
  extraActions = [],
  loading = false,
  page = 0,
  totalPages = 1,
  pageSize = 5,
  onPageChange,
}) {
  return (
    <Box>
      {/* TABLE CONTAINER */}
      <TableContainer
        sx={{
          borderRadius: "0 0 20px 20px",
          overflow: "hidden",
        }}
      >
        <Table>
          {/* HEAD */}
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  background: "#f8f7ff",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  color: "#6366f1",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  borderBottom: "2px solid #ede9fe",
                  py: 2,
                }}
              >
                Id
              </TableCell>

              {columns.map((col, i) => (
                <TableCell
                  key={i}
                  sx={{
                    background: "#f8f7ff",
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    color: "#6366f1",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    borderBottom: "2px solid #ede9fe",
                    py: 2,
                  }}
                >
                  {col}
                </TableCell>
              ))}

              <TableCell
                align="center"
                sx={{
                  background: "#f8f7ff",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  color: "#6366f1",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  borderBottom: "2px solid #ede9fe",
                  py: 2,
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          {/* BODY */}
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 2}
                  align="center"
                  sx={{ py: 8, border: "none" }}
                >
                  <CircularProgress
                    size={32}
                    sx={{ color: "#6366f1" }}
                  />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 2}
                  align="center"
                  sx={{ py: 8, border: "none" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      color: "#cbd5e1",
                    }}
                  >
                    <InboxRounded sx={{ fontSize: 48 }} />
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#94a3b8",
                      }}
                    >
                      No records found
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                    backgroundColor: "#fff",

                    /* Row hover highlight */
                    "&:hover": {
                      backgroundColor: "#f5f3ff",
                      transform: "scale(1.002)",
                      boxShadow: "0 2px 12px rgba(99,102,241,0.08)",
                      "& td": {
                        borderColor: "transparent",
                      },
                    },

                    /* Rounded corners on first/last cell */
                    "& td:first-of-type": {
                      borderRadius: "12px 0 0 12px",
                    },
                    "& td:last-of-type": {
                      borderRadius: "0 12px 12px 0",
                    },

                    "& td": {
                      borderBottom: "1px solid #f1f5f9",
                      py: 1.8,
                      fontSize: "0.875rem",
                      color: "#1e293b",
                    },
                  }}
                >
                  {/* SERIAL NO */}
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#94a3b8 !important",
                      fontSize: "0.8rem !important",
                      minWidth: 40,
                    }}
                  >
                    {String(page * pageSize + index + 1).padStart(2, "0")}
                  </TableCell>

                  {/* DATA CELLS */}
                  {fields.map((field, i) => (
                    <TableCell key={i}>
                      {field === "dueDate" || field === "startDate" || field === "endDate"
                        ? formatDate(item[field])
                        : field === "status"
                        ? getStatusChip(item[field])
                        : (
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              fontWeight: field === fields[0] ? 700 : 400,
                              color: field === fields[0] ? "#1e293b" : "#475569",
                            }}
                          >
                            {item[field] || "-"}
                          </Typography>
                        )}
                    </TableCell>
                  ))}

                  {/* ACTIONS */}
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="View" arrow>
                        <IconButton size="small" onClick={() => handleView?.(item[idField])}
                          sx={{ width: 32, height: 32, borderRadius: "10px", color: "#2563eb", backgroundColor: "rgba(37,99,235,0.07)", "&:hover": { backgroundColor: "rgba(37,99,235,0.15)" } }}>
                          <Visibility sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Edit" arrow>
                        <IconButton size="small" onClick={() => handleEdit?.(item)}
                          sx={{ width: 32, height: 32, borderRadius: "10px", color: "#7c3aed", backgroundColor: "rgba(124,58,237,0.07)", "&:hover": { backgroundColor: "rgba(124,58,237,0.15)" } }}>
                          <Edit sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete" arrow>
                        <IconButton size="small" onClick={() => handleDelete?.(item[idField])}
                          sx={{ width: 32, height: 32, borderRadius: "10px", color: "#ef4444", backgroundColor: "rgba(239,68,68,0.07)", "&:hover": { backgroundColor: "rgba(239,68,68,0.15)" } }}>
                          <Delete sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>

                      {extraActions.map((action, ai) => (
                        <Tooltip key={ai} title={action.label} arrow>
                          <IconButton size="small" onClick={() => action.onClick(item[idField], item)}
                            sx={{ width: 32, height: 32, borderRadius: "10px", color: action.color || "#0891b2", backgroundColor: action.bg || "rgba(8,145,178,0.07)", "&:hover": { backgroundColor: action.bg || "rgba(8,145,178,0.15)" } }}>
                            {action.icon || <PersonAddRounded sx={{ fontSize: 16 }} />}
                          </IconButton>
                        </Tooltip>
                      ))}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION */}
      {onPageChange && (
        <Box
          sx={{
            py: 2.5,
            px: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(e, value) => onPageChange(value - 1)}
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: 13,
                color: "#64748b",
              },
              "& .Mui-selected": {
                backgroundColor: "#6366f1 !important",
                color: "#fff !important",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export default React.memo(DataTable);