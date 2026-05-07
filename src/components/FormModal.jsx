import { useState, useEffect } from "react";

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
  InputLabel,
  Tabs,
  Tab,
  Box,
  Checkbox,
  ListItemText,
  IconButton,
  Typography,
  Chip,
  Stack,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

export default function FormModal({
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
  const [activeTab, setActiveTab] = useState("");

  // ================= SAFE TAB HANDLING =================
  useEffect(() => {
    if (isOpen && hasTabs && !activeTab) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(tabs[0]?.key || "");
    }

    if (!isOpen) {
      setActiveTab("");
    }
  }, [isOpen, hasTabs, tabs, activeTab]);

  // ================= SAFE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= FIELD RENDER =================
  const renderField = (field) => {
    const value = formData?.[field.name];

    // ================= MULTISELECT =================
    if (field.type === "multiselect") {
      return (
        <FormControl fullWidth key={field.name} margin="normal">
          <InputLabel>{field.label || field.name}</InputLabel>

          <Select
            multiple
            name={field.name}
            value={Array.isArray(value) ? value : []}
            onChange={handleChange}
            label={field.label || field.name}
            renderValue={(selected) =>
              (field.options || [])
                .filter((item) => selected.includes(item.value))
                .map((item) => item.label)
                .join(", ")
            }
          >
            {(field.options || []).map((item, index) => (
              <MenuItem
                key={item.value ?? index}
                value={item.value}
              >
                <Checkbox checked={(value || []).includes(item.value)} />
                <ListItemText primary={item.label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    // ================= SELECT =================
    if (field.type === "select") {
      return (
        <FormControl fullWidth key={field.name} margin="normal">
          <InputLabel>{field.label || field.name}</InputLabel>

          <Select
            name={field.name}
            value={value ?? ""}
            onChange={handleChange}
            label={field.label || field.name}
            disabled={field.disabled}
          >
            {(field.options || []).map((item, index) => {
              // SUPPORT BOTH STRING + OBJECT OPTIONS
              const isObject = typeof item === "object";

              return (
                <MenuItem
                  key={isObject ? item.value : item ?? index}
                  value={isObject ? item.value : item}
                >
                  {isObject ? item.label : item}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      );
    }

    // ================= CUSTOM CONTENT =================
    if (field.type === "custom") {
      return <Box key={field.name}>{field.render?.()}</Box>;
    }

    // ================= TEXT FIELD =================
    return (
      <TextField
        fullWidth
        margin="normal"
        key={field.name}
        label={field.label || field.name}
        type={field.type || "text"}
        name={field.name}
        value={value ?? ""}
        onChange={handleChange}
      />
    );
  };

  const activeFields = hasTabs
    ? tabs.find((tab) => tab.key === activeTab)?.fields || []
    : fields;

  const currentTabIndex = hasTabs
    ? Math.max(
        tabs.findIndex((tab) => tab.key === activeTab),
        0
      )
    : 0;

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        {title}

        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* ================= TABS ================= */}
        {hasTabs && (
          <Tabs
            value={currentTabIndex}
            onChange={(e, value) =>
              setActiveTab(tabs[value]?.key || "")
            }
          >
            {tabs.map((tab) => (
              <Tab key={tab.key} label={tab.label} />
            ))}
          </Tabs>
        )}

        {/* ================= FIELDS ================= */}
        <Box mt={2}>
          {activeFields.map(renderField)}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>

        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}