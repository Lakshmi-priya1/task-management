import { useState } from "react";
import * as XLSX from "xlsx";
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableHead, TableRow, TableCell, TableBody,
  Typography, Box, Chip, IconButton, CircularProgress, LinearProgress,
} from "@mui/material";
import {
  CloudUpload, CloseRounded, CheckCircleRounded, FileDownloadRounded,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

// ✅ Fixed template columns — matches backend parseExcel() exactly
const REQUIRED_COLS = [
  "username", "email", "firstName", "lastName",
  "department", "status", "phoneNumber", "password", "orgId"
];

function downloadTemplate() {
  const ws = XLSX.utils.aoa_to_sheet([REQUIRED_COLS]);

  // ✅ Style header row in template
  REQUIRED_COLS.forEach((_, i) => {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
    if (!ws[cellRef]) return;
    ws[cellRef].s = {
      font:      { bold: true, color: { rgb: "FFFFFF" } },
      fill:      { fgColor: { rgb: "6366F1" } },
      alignment: { horizontal: "center" },
    };
  });

  // ✅ Add a sample row so users know the format
  const sampleRow = [
    "john_doe", "john@example.com", "John", "Doe",
    "Engineering", "ACTIVE", "9876543210", "Pass@123", "1"
  ];
  XLSX.utils.sheet_add_aoa(ws, [sampleRow], { origin: "A2" });

  ws["!cols"] = REQUIRED_COLS.map((col) => ({
    wch: col === "email" ? 28 : 16,
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Employees");
  XLSX.writeFile(wb, "employee_import_template.xlsx");
}

function BulkUpload({ onUpload, uploading = false, uploadProgress = 0 }) {
  const theme  = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [open,     setOpen]     = useState(false);
  const [rows,     setRows]     = useState([]);
  const [file,     setFile]     = useState(null);
  const [parseErr, setParseErr] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    e.target.value = "";
    setParseErr("");
    if (!selected) return;

    // ✅ Use async FileReader for speed
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const wb     = XLSX.read(new Uint8Array(ev.target.result), {
          type: "array",
          cellStyles: false, // ✅ skip style parsing = faster
          cellDates:  true,
          sheetRows:  500,   // ✅ preview max 500 rows for speed
        });
        const ws     = wb.Sheets[wb.SheetNames[0]];
        const parsed = XLSX.utils.sheet_to_json(ws, { defval: "" });

        if (!parsed.length) {
          setParseErr("The file is empty.");
          setOpen(true);
          return;
        }
        setRows(parsed);
        setFile(selected);
        setOpen(true);
      } catch {
        setParseErr("Could not read the file. Make sure it is a valid .xlsx file.");
        setOpen(true);
      }
    };
    reader.readAsArrayBuffer(selected);
  };

  const handleConfirm = () => {
    if (file) onUpload?.(file);
    setOpen(false);
    setRows([]);
    setFile(null);
  };

  const handleClose = () => {
    if (uploading) return; // ✅ prevent close while uploading
    setOpen(false);
    setRows([]);
    setFile(null);
    setParseErr("");
  };

  const cols = rows.length > 0 ? Object.keys(rows[0]) : [];

  const statusColor = (val) => {
    const v = String(val).toUpperCase();
    if (v === "ACTIVE")   return { bg: "#dcfce7", color: "#16a34a" };
    if (v === "INACTIVE") return { bg: "#fef2f2", color: "#b91c1c" };
    return { bg: "#f1f5f9", color: "#64748b" };
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 1 }}>
        {/* Template download */}
        <Button
          variant="outlined"
          size="small"
          startIcon={<FileDownloadRounded />}
          onClick={downloadTemplate}
          sx={{
            textTransform: "none", borderRadius: 2, px: 2,
            borderColor: "#a855f7", color: "#a855f7",
            "&:hover": { borderColor: "#7c3aed", color: "#7c3aed", bgcolor: "rgba(168,85,247,0.06)" },
          }}
        >
          Template
        </Button>

        {/* Upload button */}
        <Button
          variant="contained"
          component="label"
          startIcon={uploading ? <CircularProgress size={14} color="inherit" /> : <CloudUpload />}
          disabled={uploading}
          sx={{
            textTransform: "none", borderRadius: 2, px: 2, boxShadow: "none",
            background: "linear-gradient(135deg,#6366f1,#a855f7)",
            "&:hover": { opacity: 0.88 },
            position: "relative", overflow: "hidden",
          }}
        >
          {/* ✅ Upload progress strip */}
          {uploading && uploadProgress > 0 && (
            <Box sx={{
              position: "absolute", bottom: 0, left: 0,
              height: 3, width: `${uploadProgress}%`,
              bgcolor: "rgba(255,255,255,0.6)",
              transition: "width 0.3s ease",
            }} />
          )}
          {uploading ? `Uploading ${uploadProgress}%` : "Bulk Upload"}
          <input type="file" accept=".xlsx,.xls" hidden onChange={handleFileChange} />
        </Button>
      </Box>

      {/* Preview Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            bgcolor: isDark ? "#1a1a2e" : "#fff",
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 18 }}>
              Bulk Upload Preview
            </Typography>
            {!parseErr && (
              <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.3 }}>
                {rows.length} row{rows.length !== 1 ? "s" : ""} found — review before importing
              </Typography>
            )}
          </Box>
          <IconButton onClick={handleClose} size="small" disabled={uploading}>
            <CloseRounded />
          </IconButton>
        </DialogTitle>

        {/* ✅ Upload progress bar inside dialog */}
        {uploading && (
          <Box sx={{ px: 3, pb: 1 }}>
            <LinearProgress
              variant={uploadProgress > 0 ? "determinate" : "indeterminate"}
              value={uploadProgress}
              sx={{
                borderRadius: 4, height: 6,
                bgcolor: "#e0e7ff",
                "& .MuiLinearProgress-bar": { bgcolor: "#6366f1" },
              }}
            />
            <Typography sx={{ fontSize: 12, color: "#6366f1", mt: 0.5, textAlign: "right" }}>
              {uploadProgress > 0 ? `${uploadProgress}% uploaded` : "Connecting..."}
            </Typography>
          </Box>
        )}

        <DialogContent dividers sx={{ p: 0 }}>
          {parseErr ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography color="error" fontWeight={600}>{parseErr}</Typography>
              <Typography sx={{ mt: 1, fontSize: 13, color: "text.secondary" }}>
                Expected columns: {REQUIRED_COLS.join(", ")}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, fontSize: 12, color: "#8b5cf6", bgcolor: isDark ? "#13131f" : "#f8f7ff", whiteSpace: "nowrap" }}>
                      #
                    </TableCell>
                    {cols.map((col) => (
                      <TableCell key={col} sx={{ fontWeight: 800, fontSize: 12, color: "#8b5cf6", bgcolor: isDark ? "#13131f" : "#f8f7ff", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: 0.8 }}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow key={i} sx={{ "&:hover": { bgcolor: isDark ? "#22223a" : "#f5f3ff" } }}>
                      <TableCell sx={{ color: "#94a3b8", fontSize: 12, fontWeight: 700 }}>
                        {String(i + 1).padStart(2, "0")}
                      </TableCell>
                      {cols.map((col) => (
                        <TableCell key={col} sx={{ fontSize: 13, whiteSpace: "nowrap" }}>
                          {col.toLowerCase() === "status" ? (
                            <Chip
                              label={String(row[col] || "—")}
                              size="small"
                              sx={{ ...statusColor(row[col]), fontWeight: 700, fontSize: 11, height: 22, border: "none" }}
                            />
                          ) : col.toLowerCase() === "password" ? (
                            <Typography sx={{ fontSize: 13, color: "#94a3b8", letterSpacing: 2 }}>••••••••</Typography>
                          ) : (
                            <Typography sx={{ fontSize: 13 }}>{String(row[col] || "—")}</Typography>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={uploading}
            sx={{ borderRadius: "12px", textTransform: "none", px: 3 }}
          >
            Cancel
          </Button>
          {!parseErr && (
            <Button
              onClick={handleConfirm}
              variant="contained"
              disabled={uploading}
              startIcon={uploading
                ? <CircularProgress size={14} color="inherit" />
                : <CheckCircleRounded />
              }
              sx={{
                borderRadius: "12px", textTransform: "none", px: 3,
                background: "linear-gradient(135deg,#6366f1,#a855f7)",
                "&:hover": { opacity: 0.88 },
              }}
            >
              {uploading
                ? `Importing... ${uploadProgress}%`
                : `Confirm Import (${rows.length} rows)`}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default BulkUpload;