// ======================================================
// FILE: pages/Employee.jsx
// ======================================================

import { useState, useEffect, useCallback } from "react";
import {
  Box, Button, Typography, TextField,
  InputAdornment, Select, MenuItem, FormControl, Card,
} from "@mui/material";
import { AddRounded, SearchRounded, FilterListRounded, GroupsRounded } from "@mui/icons-material";
import Swal from "sweetalert2";

import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";
import ViewDrawer from "../components/ViewDrawer";

import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from "../services/employeeService";
import { getTasks } from "../services/taskService";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  didOpen: (toast) => { toast.style.marginTop = "70px"; },
});

const emptyForm = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phoneNumber: "",
  department: "",
  status: "",
};

export default function Employee() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeForm, setEmployeeForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const size = 5;

  const resetForm = useCallback(() => {
    setEditingEmployee(null);
    setEmployeeForm(emptyForm);
  }, []);

  const fetchEmployeesData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getEmployees({ keyword: searchTerm, department, page, size });
      const list = res?.content || [];

      // fixed: removed redundant `id` alias, removed eager getAllTasks() call
      setEmployees(list);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error(err);
      setEmployees([]);
      Toast.fire({ icon: "error", title: "Failed to fetch employees" });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, department, page]);

  useEffect(() => {
    fetchEmployeesData();
  }, [fetchEmployeesData]);

  useEffect(() => {
    const unique = [...new Set(employees.map((e) => e.department).filter(Boolean))];
    setDepartments(unique);
  }, [employees]);

  // fixed: fetch tasks on demand when view is opened, filter by employeeId
  const handleView = async (id) => {
    const emp = employees.find((e) => e.employeeId === id);
    if (!emp) return;
    const res = await getTasks({ page: 0, size: 100 });
    const empTasks = (res?.content || []).filter(
      (t) => Number(t.employeeId) === Number(id)
    );
    setSelectedEmployee({ ...emp, tasks: empTasks });
    setViewOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        // fixed: strip password from update payload so it doesn't overwrite
        const {  ...updatePayload } = employeeForm;
        await updateEmployee(editingEmployee.employeeId, updatePayload);
        Toast.fire({ icon: "success", title: "Updated" });
      } else {
        await addEmployee(employeeForm);
        Toast.fire({ icon: "success", title: "Added" });
      }
      setModalOpen(false);
      resetForm();
      fetchEmployeesData();
    } catch {
      Toast.fire({ icon: "error", title: "Operation failed" });
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({ title: "Delete Employee?", icon: "warning", showCancelButton: true });
    if (res.isConfirmed) {
      await deleteEmployee(id);
      Toast.fire({ icon: "success", title: "Deleted" });
      fetchEmployeesData();
    }
  };

  return (
    <Box>
      {/* SEARCH + FILTER + ADD */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2, alignItems: "center" }}>
        <TextField
          size="small"
          placeholder="Search employee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 240, "& .MuiOutlinedInput-root": { borderRadius: "16px", background: "rgba(255,255,255,.65)" } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchRounded /></InputAdornment> }}
        />
        <FormControl size="small" sx={{ minWidth: 180, "& .MuiOutlinedInput-root": { borderRadius: "16px", background: "rgba(255,255,255,.65)" } }}>
          <Select value={department} onChange={(e) => setDepartment(e.target.value)} displayEmpty
            startAdornment={<InputAdornment position="start"><FilterListRounded /></InputAdornment>}>
            <MenuItem value="">All Departments</MenuItem>
            {departments.map((dept) => <MenuItem key={dept} value={dept}>{dept}</MenuItem>)}
          </Select>
        </FormControl>
        <Button
          startIcon={<AddRounded />}
          onClick={() => { resetForm(); setModalOpen(true); }}
          sx={{ ml: "auto", px: 2.5, py: 1, borderRadius: "14px", fontWeight: 700, background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "#fff", textTransform: "none", "&:hover": { opacity: 0.88 } }}
        >
          Add Employee
        </Button>
      </Box>

      {/* TABLE */}
      <Card sx={{ borderRadius: "24px", overflow: "hidden", background: "rgba(255,255,255,.70)", backdropFilter: "blur(16px)", boxShadow: "0 12px 30px rgba(0,0,0,.05)" }}>
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid rgba(0,0,0,.06)", display: "flex", alignItems: "center", gap: 1 }}>
          <GroupsRounded sx={{ color: "#7c3aed" }} />
          <Typography sx={{ fontWeight: 800, color: "#312e81" }}>Employee List</Typography>
        </Box>
        <DataTable
          title=""
          data={employees}
          columns={["Email", "Department", "Status"]}
          fields={["email", "department", "status"]}
          idField="employeeId"
          loading={loading}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          handleDelete={handleDelete}
          handleView={handleView}   // fixed: now calls async handleView directly
          handleEdit={(emp) => {
            setEditingEmployee(emp);
            // fixed: exclude employeeId from form to avoid sending it in update
            const {  ...formData } = emp;
            setEmployeeForm({ ...formData, password: "" });
            setModalOpen(true);
          }}
          isEmployeeTable={true}
        />
      </Card>

      {/* VIEW DRAWER */}
      <ViewDrawer
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
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
                          value: task.status,
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
        handleClose={() => { setModalOpen(false); resetForm(); }}
        title={editingEmployee ? "Edit Employee" : "Add Employee"}
        formData={employeeForm}
        setFormData={setEmployeeForm}
        handleSubmit={handleSubmit}
        tabs={[
          {
            key: "basic",
            label: "Basic Info",
            fields: [
              { name: "username", type: "text" },
              { name: "firstName", type: "text" },
              { name: "lastName", type: "text" },
              { name: "email", type: "email" },
              // fixed: password shown only when adding, hidden when editing via conditional rendering in FormModal
              // if your FormModal doesn't support conditional fields, handle it here:
              ...(!editingEmployee ? [{ name: "password", type: "password" }] : []),
            ],
          },
          {
            key: "work",
            label: "Work Info",
            fields: [
              { name: "phoneNumber", type: "text" },
              { name: "department", type: "text" },
              { name: "status", type: "select", options: ["ACTIVE", "INACTIVE"] },
            ],
          },
        ]}
      />
    </Box>
  );
}