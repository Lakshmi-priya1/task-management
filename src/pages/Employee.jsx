// src/pages/Employee.jsx
import {
  Box, Button, Typography, TextField,
  InputAdornment, Select, MenuItem, FormControl, Card,
} from "@mui/material";
import {
  AddRounded, SearchRounded, FilterListRounded, GroupsRounded,
} from "@mui/icons-material";
import { useTheme }            from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { useState }            from "react";

import DataTable     from "../components/DataTable";
import FormModal     from "../components/FormModal";
import ViewDrawer    from "../components/ViewDrawer";
import ExportButtons from "../components/ExportButtons";
import BulkUpload    from "../components/BulkUpload";

import { useEmployee, Toast, EMPLOYEE_ROLES } from "../hooks/useEmployee";
import {
  fetchEmployees,
  fetchAllEmployees,
  importEmployeesExcelThunk,
  exportEmployeesExcelThunk,
} from "../store/slices/employeeSlice";
import { getEmployeeStyles } from "../styles/employeeStyles";

const ADMIN = "ADMIN";

export default function Employee() {
  const theme  = useTheme();
  const isDark = theme.palette.mode === "dark";
  const sx     = getEmployeeStyles(isDark);

  const { role } = useSelector((state) => state.auth);
  const canWrite  = role === ADMIN;
  const canDelete = role === ADMIN;

  const dispatch = useDispatch();

  const [uploading,       setUploading]       = useState(false);
  const [uploadProgress,  setUploadProgress]  = useState(0);
  const [exportProgress,  setExportProgress]  = useState(0);
  const [serverExporting, setServerExporting] = useState(false);

  const {
    employees, loading, totalPages,
    keyword, department, page,
    selectedEmployee, departments,
    organizations,                // ✅ org list for dropdown
    setKeyword, setDepartment, setPage,
    editing, form, setForm, errors,
    modalOpen, openAddModal, closeModal,
    viewOpen, handleView, closeViewDrawer,
    handleSubmit, handleDelete, handleEdit,
  } = useEmployee();

  const handleEmployeeUpload = async (file) => {
    setUploading(true);
    setUploadProgress(0);
    try {
      const result = await dispatch(
        importEmployeesExcelThunk({ file, onProgress: setUploadProgress })
      );
      if (importEmployeesExcelThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "Employees imported successfully" });
        dispatch(fetchEmployees({ keyword, department, page }));
        dispatch(fetchAllEmployees());
      } else {
        const msg = result.payload?.message || result.payload?.error || "Import failed";
        Toast.fire({ icon: "error", title: msg });
      }
    } catch {
      Toast.fire({ icon: "error", title: "Import failed" });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleServerExport = async () => {
    setServerExporting(true);
    setExportProgress(0);
    const result = await dispatch(exportEmployeesExcelThunk(setExportProgress));
    if (exportEmployeesExcelThunk.rejected.match(result)) {
      Toast.fire({ icon: "error", title: "Export failed" });
    }
    setServerExporting(false);
    setExportProgress(0);
  };

  // ✅ When user picks an org from dropdown, store BOTH orgId and companyName
  const handleOrgChange = (e) => {
    const selectedOrgId = e.target.value;
    const selectedOrg   = organizations.find((o) => o.orgId === selectedOrgId);
    setForm((prev) => ({
      ...prev,
      orgId:       selectedOrgId,
      companyName: selectedOrg?.companyName || "",
    }));
  };

  return (
    <Box>
      {/* SEARCH + FILTER + ACTIONS */}
      <Box sx={sx.toolbarSx}>
        <TextField
          size="small"
          placeholder="Search employee..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          sx={sx.inputSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={sx.filterSx}>
          <Select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            displayEmpty
            startAdornment={
              <InputAdornment position="start">
                <FilterListRounded />
              </InputAdornment>
            }
          >
            <MenuItem value="">All Departments</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>{dept}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center", ml: "auto" }}>
          <ExportButtons
            onExport={handleServerExport}
            exporting={serverExporting}
            progress={exportProgress}
          />

          {canWrite && (
            <BulkUpload
              onUpload={handleEmployeeUpload}
              uploading={uploading}
              uploadProgress={uploadProgress}
            />
          )}

          {canWrite && (
            <Button startIcon={<AddRounded />} onClick={openAddModal} sx={sx.addButtonSx}>
              Add Employee
            </Button>
          )}
        </Box>
      </Box>

      {/* TABLE */}
      <Card sx={sx.cardSx}>
        <Box sx={sx.cardHeaderSx}>
          <GroupsRounded sx={sx.cardIconSx} />
          <Typography sx={sx.cardTitleSx}>Employee List</Typography>
        </Box>
        <DataTable
          data={employees}
          columns={["Employee Code", "Email", "Department","Role", "Status"]}
          fields={["employeeCode", "email", "department","role", "status"]}
          idField="employeeCode"
          loading={loading}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          handleDelete={handleDelete}
          handleView={handleView}
          handleEdit={handleEdit}
          hideEdit={!canWrite}
          hideDelete={!canDelete}
        />
      </Card>

      {/* VIEW DRAWER */}
      <ViewDrawer
        isOpen={viewOpen}
        onClose={closeViewDrawer}
        title="Employee Details"
        status={selectedEmployee?.status}
        sections={
          selectedEmployee ? [
            {
              heading: "Basic Info",
              fields: [
                { label: "Employee Code", value: selectedEmployee.employeeCode },
                { label: "Username",      value: selectedEmployee.username },
                { label: "First Name",    value: selectedEmployee.firstName },
                { label: "Last Name",     value: selectedEmployee.lastName },
              ],
            },
            {
              heading: "Contact Info",
              fields: [
                { label: "Email",        value: selectedEmployee.email },
                { label: "Phone Number", value: selectedEmployee.phoneNumber },
              ],
            },
            {
              heading: "Work Info",
              fields: [
                { label: "Department",    value: selectedEmployee.department },
                { label: "Role",          value: selectedEmployee.role },
                { label: "Organization",  value: selectedEmployee.companyName || "—" }, // ✅ show org name
                { label: "User ID",       value: selectedEmployee.userId },
                { label: "Status",        value: selectedEmployee.status, badge: true },
              ],
            },
            ...(selectedEmployee.tasks?.length > 0
              ? [{
                  heading: "Assigned Tasks",
                  fields: selectedEmployee.tasks.map((task) => ({
                    label: task.title || `Task #${task.id}`,
                    value: task.status || "PENDING",
                    badge: true,
                  })),
                }]
              : [{
                  heading: "Assigned Tasks",
                  fields: [{ label: "No tasks assigned", value: "—" }],
                }]
            ),
          ] : []
        }
      />

      {/* FORM MODAL */}
      {canWrite && (
        <FormModal
          isOpen={modalOpen}
          handleClose={closeModal}
          title={editing ? "Edit Employee" : "Add Employee"}
          subtitle={editing ? "Update employee details" : "Fill in details to add employee"}
          formData={form}
          setFormData={setForm}
          handleSubmit={handleSubmit}
          submitLabel={editing ? "Save Changes" : "Add Employee"}
          errors={errors}
          sections={[
            {
              label: "Basic Info",
              fields: [
                { name: "username",  label: "Username",   type: "text",     half: true },
                { name: "email",     label: "Email",      type: "email",    half: true },
                { name: "firstName", label: "First Name", type: "text",     half: true },
                { name: "lastName",  label: "Last Name",  type: "text",     half: true },
                { name: "password",  label: "Password",   type: "password", half: true },
              ],
            },
            {
              label: "Work Info",
              fields: [
                { name: "phoneNumber", label: "Phone Number", type: "text", half: true },
                { name: "department",  label: "Department",   type: "text", half: true },
                {
                  name: "role", label: "Role", type: "select",
                  disabled: !!editing,
                  options: EMPLOYEE_ROLES.map((r) => ({ value: r, label: r.replace("_", " ") })),
                },
                // ✅ Organization dropdown — shows companyName, sends orgId + companyName
                {
                  name: "orgId",
                  label: "Organization",
                  type: "custom",
                  render: () => (
                    <FormControl fullWidth size="small" error={!!errors.orgId}>
                      <Select
                        name="orgId"
                        value={form.orgId ?? ""}
                        onChange={handleOrgChange}
                        displayEmpty
                        sx={{
                          fontSize: 13.5,
                          borderRadius: "9px",
                          backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#faf9ff",
                          "& fieldset": {
                            borderColor: isDark ? "rgba(255,255,255,0.12)" : "#e4e0fd",
                            borderWidth: "1.5px",
                          },
                          "&:hover fieldset": { borderColor: "#7F77DD" },
                          "&.Mui-focused fieldset": {
                            borderColor: "#7F77DD",
                            boxShadow: `0 0 0 3px ${isDark ? "rgba(255,255,255,0.05)" : "#EEEDFE"}`,
                          },
                          "& .MuiSelect-select": {
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            color: isDark ? "#e2e8f0" : "#1e293b",
                          },
                        }}
                      >
                        <MenuItem value="" sx={{ fontSize: 13, color: "#aaa" }}>
                          Select Organization
                        </MenuItem>
                        {organizations.map((org) => (
                          <MenuItem key={org.orgId} value={org.orgId} sx={{ fontSize: 13 }}>
                            {org.companyName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ),
                },
                {
                  name: "status", label: "Status", type: "select",
                  options: [
                    { value: "ACTIVE",   label: "Active" },
                    { value: "INACTIVE", label: "Inactive" },
                  ],
                },
              ],
            },
          ]}
        />
      )}
    </Box>
  );
}