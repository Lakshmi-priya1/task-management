// src/pages/Employee.jsx

import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Card,
} from "@mui/material";

import {
  AddRounded,
  SearchRounded,
  FilterListRounded,
  GroupsRounded,
} from "@mui/icons-material";

import { useTheme } from "@mui/material/styles";

import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";
import ViewDrawer from "../components/ViewDrawer";

import { useEmployee } from "../hooks/useEmployee";
import { getEmployeeStyles } from "../styles/employeeStyles";

export default function Employee() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const sx = getEmployeeStyles(isDark);

  const {
    // redux state
    employees,
    loading,
    totalPages,
    keyword,
    department,
    page,
    selectedEmployee,
    departments,

    // dispatch helpers
    setKeyword,
    setDepartment,
    setPage,

    // form state
    editing,
    form,
    setForm,
    errors,

    // modal state
    modalOpen,
    openAddModal,
    closeModal,

    // view drawer
    viewOpen,
    handleView,
    closeViewDrawer,

    // handlers
    handleSubmit,
    handleDelete,
    handleEdit,
  } = useEmployee();

  return (
    <Box>
      {/* SEARCH + FILTER + ADD */}
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
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          startIcon={<AddRounded />}
          onClick={openAddModal}
          sx={sx.addButtonSx}
        >
          Add Employee
        </Button>
      </Box>

      {/* TABLE */}
      <Card sx={sx.cardSx}>
        <Box sx={sx.cardHeaderSx}>
          <GroupsRounded sx={sx.cardIconSx} />
          <Typography sx={sx.cardTitleSx}>Employee List</Typography>
        </Box>

        <DataTable
          data={employees}
          columns={["Email", "Department", "Status"]}
          fields={["email", "department", "status"]}
          idField="employeeId"
          loading={loading}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          handleDelete={handleDelete}
          handleView={handleView}
          handleEdit={handleEdit}
          isEmployeeTable={true}
        />
      </Card>

      {/* VIEW DRAWER */}
      <ViewDrawer
        isOpen={viewOpen}
        onClose={closeViewDrawer}
        title="Employee Details"
        status={selectedEmployee?.status}
        sections={
          selectedEmployee
            ? [
                {
                  heading: "Basic Info",
                  fields: [
                    { label: "Employee ID", value: selectedEmployee.employeeId },
                    { label: "Username", value: selectedEmployee.username },
                    { label: "First Name", value: selectedEmployee.firstName },
                    { label: "Last Name", value: selectedEmployee.lastName },
                  ],
                },
                {
                  heading: "Contact Info",
                  fields: [
                    { label: "Email", value: selectedEmployee.email },
                    { label: "Phone Number", value: selectedEmployee.phoneNumber },
                  ],
                },
                {
                  heading: "Work Info",
                  fields: [
                    { label: "Department", value: selectedEmployee.department },
                    { label: "Status", value: selectedEmployee.status, badge: true },
                  ],
                },
                ...(selectedEmployee.tasks?.length > 0
                  ? [
                      {
                        heading: "Assigned Tasks",
                        fields: selectedEmployee.tasks.map((task) => ({
                          label: task.title || `Task #${task.id}`,
                          value: task.status || "PENDING",
                          badge: true,
                        })),
                      },
                    ]
                  : [
                      {
                        heading: "Assigned Tasks",
                        fields: [{ label: "No tasks assigned", value: "—" }],
                      },
                    ]),
              ]
            : []
        }
      />

      {/* FORM MODAL */}
      <FormModal
        isOpen={modalOpen}
        handleClose={closeModal}
        title={editing ? "Edit Employee" : "Add Employee"}
        subtitle={
          editing ? "Update employee details" : "Fill in details to add employee"
        }
        formData={form}
        setFormData={setForm}
        handleSubmit={handleSubmit}
        submitLabel={editing ? "Save Changes" : "Add Employee"}
        errors={errors}
        sections={[
          {
            label: "Basic Info",
            fields: [
              { name: "username",  label: "Username",   type: "text",  half: true },
              { name: "email",     label: "Email",      type: "email", half: true },
              { name: "firstName", label: "First Name", type: "text",  half: true },
              { name: "lastName",  label: "Last Name",  type: "text",  half: true },
              { name: "password", label: "Password", type: "password", half: true },
            ],
          },
          {
            label: "Work Info",
            fields: [
              { name: "phoneNumber", label: "Phone Number", type: "text", half: true },
              { name: "department",  label: "Department",   type: "text", half: true },
              {
                name: "status",
                label: "Status",
                type: "select",
                options: [
                  { value: "ACTIVE",   label: "Active" },
                  { value: "INACTIVE", label: "Inactive" },
                ],
              },
            ],
          },
        ]}
      />
    </Box>
  );
}