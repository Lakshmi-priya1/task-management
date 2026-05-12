// src/components/FormModal.jsx

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Box,
  Checkbox,
  ListItemText,
  IconButton,
  Typography,
  InputAdornment,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import dayjs from "dayjs";

const P = {
  50:  "#EEEDFE",
  100: "#CECBF6",
  200: "#AFA9EC",
  400: "#7F77DD",
  600: "#534AB7",
  800: "#3C3489",
  900: "#26215C",
};

function Section({ label }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, mt: 0.5 }}>
      <Box
        sx={{
          width: 4, height: 4,
          borderRadius: "50%",
          background: P[200],
          flexShrink: 0,
        }}
      />
      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 700,
          color: P[400],
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </Typography>
      <Box sx={{ flex: 1, height: "1px", background: "#ece9fd" }} />
    </Box>
  );
}

export default function FormModal({
  isOpen,
  handleClose,
  title,
  subtitle,
  sections = [],
  fields = [],
  formData,
  setFormData,
  handleSubmit,
  submitLabel = "Submit",
  errors = {},           // ← { fieldName: "error message", … }
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const hasSections = sections.length > 0;

  // Track which password fields are visible
  const [showPassword, setShowPassword] = useState({});
  const togglePasswordVisibility = (name) =>
    setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }));

  // ── Shared sx ────────────────────────────────────────────────────────────
  const inputSx = {
    mb: 1.5,
    "& .MuiOutlinedInput-root": {
      
      fontSize: 13.5,
      borderRadius: "9px",
      backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#faf9ff",
      "& fieldset": {
        borderColor: isDark ? "rgba(255,255,255,0.12)" : "#e4e0fd",
        borderWidth: "1.5px",
      },
      "&:hover fieldset": { borderColor: P[400] },
      "&.Mui-focused fieldset": {
        borderColor: P[400],
        borderWidth: "1.5px",
        boxShadow: `0 0 0 3px ${isDark ? "rgba(255,255,255,0.05)" : P[50]}`,
      },
      "&.Mui-focused": {
        backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#fff",
      },
      "&.Mui-error fieldset": {
        borderColor: "#ef4444",
        borderWidth: "1.5px",
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: 13,
      color: isDark ? "#94a3b8" : "#aaa",
      "&.Mui-focused": { color: P[600] },
      "&.Mui-error":   { color: "#ef4444" },
    },
    "& .MuiInputBase-input": {
      paddingTop: "10px",
      paddingBottom: "10px",
      color: isDark ? "#e2e8f0" : "#1e293b",
    },
    "& .MuiFormHelperText-root": {
      fontSize: 11,
      marginTop: "3px",
    },
  };

  const sharedSelectSx = {
    fontSize: 13.5,
    borderRadius: "9px",
    background: isDark ? "rgba(255,255,255,0.05)" : "#faf9ff",
    "& fieldset": {
      borderColor: isDark ? "rgba(255,255,255,0.12)" : "#e4e0fd",
      borderWidth: "1.5px",
    },
    "&:hover fieldset": { borderColor: P[400] },
    "&.Mui-focused fieldset": {
      borderColor: P[400],
      boxShadow: `0 0 0 3px ${isDark ? "rgba(255,255,255,0.05)" : P[50]}`,
    },
    "&.Mui-error fieldset": {
      borderColor: "#ef4444",
      borderWidth: "1.5px",
    },
    "& .MuiSelect-select": {
      paddingTop: "10px",
      paddingBottom: "10px",
    },
  };

  const sharedLabelSx = {
    fontSize: 13,
    color: isDark ? "#94a3b8" : "#aaa",
    "&.Mui-focused": { color: P[600] },
    "&.Mui-error":   { color: "#ef4444" },
  };

  const pickerPopperSx = {
    "& .MuiPaper-root": {
      borderRadius: "12px",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e4e0fd"}`,
      background: isDark ? "#1a1a2e" : "#fff",
      boxShadow: isDark
        ? "0 4px 28px rgba(0,0,0,0.5)"
        : "0 4px 24px rgba(83,74,183,0.12)",
    },
    "& .MuiPickersDay-root": {
      fontSize: 13,
      borderRadius: "8px",
      color: isDark ? "#e2e8f0" : undefined,
      "&:hover": { background: isDark ? "rgba(255,255,255,0.08)" : P[50] },
      "&.Mui-selected": {
        background: P[600],
        color: "#fff",
        "&:hover": { background: P[800] },
      },
      "&.MuiPickersDay-today": {
        border: `1.5px solid ${P[400]}`,
        color: P[600],
        background: "transparent",
      },
    },
    "& .MuiPickersCalendarHeader-label": {
      fontSize: 13.5,
      fontWeight: 600,
      color: isDark ? "#e2e8f0" : P[900],
    },
    "& .MuiPickersArrowSwitcher-button": {
      color: P[400],
      "&:hover": { background: isDark ? "rgba(255,255,255,0.08)" : P[50] },
    },
    "& .MuiDayCalendar-weekDayLabel": {
      fontSize: 12,
      color: isDark ? "#94a3b8" : P[200],
      fontWeight: 600,
    },
    "& .MuiPickersYear-yearButton": {
      fontSize: 13,
      borderRadius: "8px",
      "&.Mui-selected": { background: P[600], color: "#fff" },
    },
  };

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Field renderer ────────────────────────────────────────────────────────
  const renderField = (field) => {
    const value      = formData?.[field.name];
    const label      = field.label || field.name;
    const fieldError = errors[field.name];
    const isPassword = field.name === "password" || field.type === "password";

    // DATE PICKER
    if (field.type === "date") {
      return (
        <DatePicker
          key={field.name}
          label={label}
          value={value ? dayjs(value) : null}
          onChange={(newVal) =>
            setFormData((prev) => ({
              ...prev,
              [field.name]: newVal ? newVal.format("YYYY-MM-DD") : "",
            }))
          }
          format="DD MMM YYYY"
          slotProps={{
            textField: {
              fullWidth: true,
              size: "small",
              error: !!fieldError,
              helperText: fieldError || "",
              sx: inputSx,
            },
            popper: { sx: pickerPopperSx },
            openPickerButton: {
              sx: {
                color: P[400],
                "&:hover": { color: P[600], background: P[50] },
              },
            },
          }}
        />
      );
    }

    // MULTISELECT
    if (field.type === "multiselect") {
      return (
        <FormControl
          fullWidth
          key={field.name}
          size="small"
          error={!!fieldError}
          sx={inputSx}
        >
          <InputLabel sx={sharedLabelSx}>{label}</InputLabel>
          <Select
            multiple
            name={field.name}
            value={Array.isArray(value) ? value : []}
            onChange={handleChange}
            label={label}
            sx={sharedSelectSx}
            renderValue={(selected) =>
              (field.options || [])
                .filter((o) => selected.includes(o.value))
                .map((o) => o.label)
                .join(", ")
            }
          >
            {(field.options || []).map((item, i) => (
              <MenuItem key={item.value ?? i} value={item.value} sx={{ fontSize: 13 }}>
                <Checkbox
                  checked={(value || []).includes(item.value)}
                  size="small"
                  sx={{ p: 0.5, "&.Mui-checked": { color: P[600] } }}
                />
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: 13 }}
                />
              </MenuItem>
            ))}
          </Select>
          {fieldError && <FormHelperText>{fieldError}</FormHelperText>}
        </FormControl>
      );
    }

    // SELECT
    if (field.type === "select") {
      return (
        <FormControl
          fullWidth
          key={field.name}
          size="small"
          error={!!fieldError}
          sx={inputSx}
        >
          <InputLabel sx={sharedLabelSx}>{label}</InputLabel>
          <Select
            name={field.name}
            value={value ?? ""}
            onChange={handleChange}
            label={label}
            disabled={field.disabled}
            sx={sharedSelectSx}
          >
            {(field.options || []).map((item, i) => {
              const isObj = typeof item === "object";
              return (
                <MenuItem
                  key={isObj ? item.value : item ?? i}
                  value={isObj ? item.value : item}
                  sx={{ fontSize: 13 }}
                >
                  {isObj ? item.label : item}
                </MenuItem>
              );
            })}
          </Select>
          {fieldError && <FormHelperText>{fieldError}</FormHelperText>}
        </FormControl>
      );
    }

    // CUSTOM
    if (field.type === "custom") {
      return (
        <Box key={field.name} sx={{ mb: 1.5 }}>
          {field.render?.()}
        </Box>
      );
    }

    // PASSWORD — auto-detected by field.name === "password" or field.type === "password"
    // PASSWORD
if (isPassword) {
  const visible = !!showPassword[field.name];
  return (
    <TextField
      fullWidth
      size="small"
      key={field.name}
      label={label}
      type={visible ? "text" : "password"}
      name={field.name}
      value={value ?? ""}
      onChange={handleChange}
      error={!!fieldError}
      helperText={fieldError || ""}
      slotProps={{                              // ← was InputProps, removed in MUI v9
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => togglePasswordVisibility(field.name)}
                edge="end"
                size="small"
                tabIndex={-1}
                sx={{ color: isDark ? "#94a3b8" : "#888" }}
              >
                {visible ? (
                  <VisibilityOff sx={{ fontSize: 18 }} />
                ) : (
                  <Visibility sx={{ fontSize: 18 }} />
                )}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      sx={inputSx}
    />
  );
}

    // DEFAULT TEXTFIELD
   // DEFAULT TEXTFIELD
return (
  <TextField
    fullWidth
    size="small"
    key={field.name}
    label={label}
    type={field.type || "text"}
    name={field.name}
    value={value ?? ""}
    onChange={handleChange}
    multiline={field.multiline}
    rows={field.rows ?? (field.multiline ? 2 : undefined)}
    error={!!fieldError}
    helperText={fieldError || ""}
    slotProps={{                               // ← was InputProps
      input: {
        startAdornment: field.startAdornment || null,
        endAdornment:   field.endAdornment   || null,
      },
    }}
    sx={inputSx}
  />
);
  }


  // ── Pair half-width fields ────────────────────────────────────────────────
  const renderFields = (fieldList) => {
    const result = [];
    let i = 0;
    while (i < fieldList.length) {
      const curr = fieldList[i];
      const next = fieldList[i + 1];
      if (curr.half && next?.half) {
        result.push(
          <Box
            key={`pair-${i}`}
            sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
          >
            {renderField(curr)}
            {renderField(next)}
          </Box>
        );
        i += 2;
      } else {
        result.push(renderField(curr));
        i += 1;
      }
    }
    return result;
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "440px",
          borderRadius: "16px",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e4e0fd"}`,
          boxShadow: isDark
            ? "0 10px 36px rgba(0,0,0,0.45)"
            : "0 8px 40px rgba(83,74,183,0.13)",
          overflow: "hidden",
          m: 2,
          backgroundColor: isDark ? "#1a1a2e" : undefined,
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle
        disableTypography
        sx={{
          background: isDark ? "#11111b" : P[50],
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#dbd7fb"}`,
          px: 2.5, pt: 2, pb: 1.75,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 32, height: 32, borderRadius: "9px",
              background: P[100],
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Box
              component="span"
              sx={{ width: 13, height: 13, borderRadius: "3px", border: `2.5px solid ${P[800]}` }}
            />
          </Box>
          <Box>
            <Typography
              sx={{ fontSize: 14.5, fontWeight: 600, color: isDark ? "#e2e8f0" : P[900], lineHeight: 1.3 }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography sx={{ fontSize: 11.5, color: isDark ? "#94a3b8" : P[400], mt: "2px" }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        <IconButton
          onClick={handleClose}
          size="small"
          aria-label="Close"
          sx={{
            width: 26, height: 26, borderRadius: "50%",
            background: isDark ? "rgba(255,255,255,0.04)" : "#fff",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e4e0fd"}`,
            color: isDark ? "#cbd5e1" : "#bbb",
            "&:hover": { background: isDark ? "rgba(255,255,255,0.08)" : P[50], color: P[600] },
          }}
        >
          <CloseIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </DialogTitle>

      {/* BODY */}
      <DialogContent
        sx={{
          background: isDark ? "#13131f" : "#fff",
          px: 2.5, pt: 2.25, pb: 1,
          maxHeight: "65vh", overflowY: "auto",
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-thumb": {
            background: isDark ? "rgba(255,255,255,0.12)" : P[100],
            borderRadius: "4px",
          },
        }}
      >
        {hasSections
          ? sections.map((sec, idx) => (
              <Box key={idx} sx={{ mb: idx < sections.length - 1 ? 1 : 0 }}>
                <Section label={sec.label} />
                {renderFields(sec.fields)}
              </Box>
            ))
          : renderFields(fields)}
      </DialogContent>

      {/* FOOTER */}
      <DialogActions
        sx={{
          background: isDark ? "#151521" : "#faf9ff",
          borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#ece9fd"}`,
          px: 2.5, py: 1.5, gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
          size="small"
          sx={{
            borderRadius: "8px",
            border: `1.5px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e4e0fd"}`,
            background: isDark ? "rgba(255,255,255,0.04)" : undefined,
            color: isDark ? "#cbd5e1" : P[600],
            fontSize: 13, px: 2, py: 0.75,
            textTransform: "none", fontWeight: 400,
            "&:hover": {
              background: isDark ? "rgba(255,255,255,0.08)" : P[50],
              borderColor: isDark ? "rgba(255,255,255,0.18)" : P[200],
            },
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          size="small"
          onClick={handleSubmit}
          sx={{
            borderRadius: "8px",
            background: isDark ? "#6366f1" : P[600],
            fontSize: 13, fontWeight: 500,
            px: 2.5, py: 0.75,
            textTransform: "none", boxShadow: "none",
            "&:hover": {
              background: isDark ? "#4f46e5" : P[800],
              boxShadow: "none",
            },
          }}
        >
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}