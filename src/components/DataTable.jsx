import React from "react";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Stack, Pagination, CircularProgress, Tooltip, IconButton, Typography,
} from "@mui/material";
import { Visibility, Edit, Delete, InboxRounded, PersonAddRounded } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const getStatusChip = (status, isDark) => {
  const s = status?.toUpperCase();
  const styles = {
    ACTIVE:      { label: "Active",      bg: isDark ? "#052e16" : "#dcfce7", color: "#22c55e" },
    INACTIVE:    { label: "Inactive",    bg: isDark ? "#2d0a0a" : "#fdefef", color: "#ef4444" },
    PENDING:     { label: "Pending",     bg: isDark ? "#2d1f00" : "#fef3c7", color: "#f59e0b" },
    IN_PROGRESS: { label: "In Progress", bg: isDark ? "#0a1628" : "#dbeafe", color: "#3b82f6" },
    COMPLETED:   { label: "Completed",   bg: isDark ? "#052e16" : "#dcfce7", color: "#10b981" },
    LOW:         { label: "Low",         bg: isDark ? "#0a2020" : "#ecfeff", color: "#06b6d4" },
    MEDIUM:      { label: "Medium",      bg: isDark ? "#2a1f00" : "#fef9c3", color: "#eab308" },
    HIGH:        { label: "High",        bg: isDark ? "#2d0a0a" : "#fee2e2", color: "#ef4444" },
  };
  const style = styles[s] || { label: status || "N/A", bg: isDark ? "#1e1e2e" : "#f1f5f9", color: isDark ? "#94a3b8" : "#64748b" };
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1.5, py: 0.4, borderRadius: "999px", backgroundColor: style.bg, color: style.color, fontSize: 12, fontWeight: 700, letterSpacing: 0.3, whiteSpace: "nowrap" }}>
      <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: style.color }} />
      {style.label}
    </Box>
  );
};

function DataTable({
  data = [],
  columns = [],
  fields = [],
  idField = "id",
  handleEdit,
  handleDelete,
  handleView,
  hideEdit = false,
  hideDelete = false,
  hideExtraActions = false,
  extraActions = [],
  loading = false,
  page = 0,
  totalPages = 1,
  pageSize = 5,
  onPageChange,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const headBg       = isDark ? "#13131f" : "#f8f7ff";
  const headColor    = "#8b5cf6";
  const headBorder   = isDark ? "#2d2d4e" : "#ede9fe";
  const rowBg        = isDark ? "#1a1a2e" : "#fff";
  const rowHover     = isDark ? "#22223a" : "#f5f3ff";
  const rowBorder    = isDark ? "#2d2d4e" : "#f1f5f9";
  const cellColor    = isDark ? "#e2e8f0" : "#1e293b";
  const cellSecondary = isDark ? "#94a3b8" : "#475569";

  return (
    <Box>
      <TableContainer sx={{ borderRadius: "0 0 20px 20px", overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              {["#", ...columns, "Actions"].map((col, i) => (
                <TableCell
                  key={i}
                  align={i === columns.length + 1 ? "center" : "left"}
                  sx={{
                    background: headBg, fontWeight: 800, fontSize: "0.75rem",
                    color: headColor, textTransform: "uppercase", letterSpacing: 1,
                    borderBottom: `2px solid ${headBorder}`, py: 2,
                  }}
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2} align="center" sx={{ py: 8, border: "none", bgcolor: rowBg }}>
                  <CircularProgress size={32} sx={{ color: "#6366f1" }} />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2} align="center" sx={{ py: 8, border: "none", bgcolor: rowBg }}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <InboxRounded sx={{ fontSize: 48, color: isDark ? "#3d3d5c" : "#cbd5e1" }} />
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: isDark ? "#4b5563" : "#94a3b8" }}>
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
                    cursor: "pointer", transition: "all 0.18s ease", backgroundColor: rowBg,
                    "&:hover": {
                      backgroundColor: rowHover, transform: "scale(1.002)",
                      boxShadow: "0 2px 12px rgba(99,102,241,0.08)",
                      "& td": { borderColor: "transparent" },
                    },
                    "& td:first-of-type": { borderRadius: "12px 0 0 12px" },
                    "& td:last-of-type":  { borderRadius: "0 12px 12px 0" },
                    "& td": { borderBottom: `1px solid ${rowBorder}`, py: 1.8, fontSize: "0.875rem", color: cellColor },
                  }}
                >
                  {/* Row number */}
                  <TableCell sx={{ fontWeight: 700, color: `${isDark ? "#4b5563" : "#94a3b8"} !important`, fontSize: "0.8rem !important", minWidth: 40 }}>
                    {String(page * pageSize + index + 1).padStart(2, "0")}
                  </TableCell>

                  {/* Data cells */}
                  {fields.map((field, i) => (
                    <TableCell key={i}>
                      {["dueDate", "startDate", "endDate"].includes(field)
                        ? <Typography sx={{ fontSize: "0.875rem", color: cellSecondary }}>{formatDate(item[field])}</Typography>
                        : field === "status" || field === "priority"
                        ? getStatusChip(item[field], isDark)
                        : (
                          <Typography sx={{
                            fontSize: "0.875rem",
                            fontWeight: field === fields[0] ? 700 : 400,
                            color: field === fields[0] ? cellColor : cellSecondary,
                          }}>
                            {item[field] || "-"}
                          </Typography>
                        )}
                    </TableCell>
                  ))}

                  {/* Actions */}
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">

                      {/* View — always visible */}
                      <Tooltip title="View" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handleView?.(item[idField])}
                          sx={{ width: 32, height: 32, borderRadius: "10px", color: "#3b82f6", backgroundColor: "rgba(59,130,246,0.1)", "&:hover": { backgroundColor: "rgba(59,130,246,0.2)" } }}
                        >
                          <Visibility sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>

                      {/* Edit — hidden when hideEdit=true */}
                      {!hideEdit && (
                        <Tooltip title="Edit" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit?.(item)}
                            sx={{ width: 32, height: 32, borderRadius: "10px", color: "#8b5cf6", backgroundColor: "rgba(139,92,246,0.1)", "&:hover": { backgroundColor: "rgba(139,92,246,0.2)" } }}
                          >
                            <Edit sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* Delete — hidden when hideDelete=true */}
                      {!hideDelete && (
                        <Tooltip title="Delete" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete?.(item[idField])}
                            sx={{ width: 32, height: 32, borderRadius: "10px", color: "#ef4444", backgroundColor: "rgba(239,68,68,0.1)", "&:hover": { backgroundColor: "rgba(239,68,68,0.2)" } }}
                          >
                            <Delete sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* Extra actions (Assign Team, Assign Employee) — hidden when hideExtraActions=true */}
                      {!hideExtraActions && extraActions.map((action, ai) => (
                        <Tooltip key={ai} title={action.label} arrow>
                          <IconButton
                            size="small"
                            onClick={() => action.onClick(item[idField], item)}
                            sx={{ width: 32, height: 32, borderRadius: "10px", color: action.color || "#06b6d4", backgroundColor: action.bg || "rgba(6,182,212,0.1)", "&:hover": { backgroundColor: "rgba(6,182,212,0.2)" } }}
                          >
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

      {onPageChange && (
        <Box sx={{ py: 2.5, px: 3, display: "flex", justifyContent: "center", borderTop: `1px solid ${rowBorder}`, bgcolor: rowBg }}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(e, value) => onPageChange(value - 1)}
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": { borderRadius: "10px", fontWeight: 700, fontSize: 13, color: isDark ? "#94a3b8" : "#64748b" },
              "& .Mui-selected": { backgroundColor: "#6366f1 !important", color: "#fff !important" },
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export default React.memo(DataTable);