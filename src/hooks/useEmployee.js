// src/hooks/useEmployee.js
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import {
  fetchEmployees,
  fetchAllEmployees,
  addEmployeeThunk,
  updateEmployeeThunk,
  softDeleteEmployeeThunk,
  fetchEmployeeTasks,
  setKeyword,
  setDepartment,
  setPage,
  clearSelected,
  setSelectedEmployee,
} from "../store/slices/employeeSlice";

import { getOrganizations } from "../services/organizationService";

import {
  parseValidationErrors,
  hasFieldErrors,
} from "../utils/validationErrorHandler";

export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  didOpen: (toast) => {
    toast.style.marginTop = "70px";
  },
});

export const emptyForm = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phoneNumber: "",
  department: "",
  status: "ACTIVE",
  role: "EMPLOYEE",
  companyName: "",   // ✅ store company name (human-readable)
  orgId: "",         // ✅ store orgId (sent to backend)
};

export const EMPLOYEE_ROLES = ["PROJECT_MANAGER", "TEAM_LEAD", "EMPLOYEE"];

export function useEmployee() {
  const dispatch = useDispatch();

  const {
    list: employees,
    allEmployees,
    loading,
    totalPages,
    keyword,
    department,
    page,
    selectedEmployee,
  } = useSelector((state) => state.employees);

  const [editing,       setEditing]       = useState(null);
  const [form,          setForm]          = useState(emptyForm);
  const [modalOpen,     setModalOpen]     = useState(false);
  const [viewOpen,      setViewOpen]      = useState(false);
  const [errors,        setErrors]        = useState({});
  const [organizations, setOrganizations] = useState([]);  // ✅ org list for dropdown

  const departments = [
    ...new Set(allEmployees.map((e) => e.department).filter(Boolean)),
  ].sort();

  const resetForm   = useCallback(() => { setEditing(null); setForm(emptyForm); }, []);
  const clearErrors = () => setErrors({});

  // ── Fetch employees on filter/page change ────────────────────────────────
  useEffect(() => {
    dispatch(fetchEmployees({ keyword, department, page }));
  }, [dispatch, keyword, department, page]);

  // ── Fetch all employees once (for department filter) ─────────────────────
  useEffect(() => {
    dispatch(fetchAllEmployees());
  }, [dispatch]);

  // ── Fetch organizations for dropdown ─────────────────────────────────────
  useEffect(() => {
    getOrganizations({ page: 0, size: 100 })
      .then((data) => setOrganizations(data?.content || []))
      .catch(() => {});
  }, []);

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    if (editing) {
      const updatePayload = {
        username:    form.username,
        firstName:   form.firstName,
        lastName:    form.lastName,
        email:       form.email,
        password:    form.password,
        phoneNumber: form.phoneNumber,
        department:  form.department,
        status:      form.status,
        orgId:       form.orgId || null,       // ✅ send orgId
        companyName: form.companyName || null, // ✅ send companyName
      };

      const result = await dispatch(
        updateEmployeeThunk({ id: editing.employeeId, data: updatePayload })
      );

      if (updateEmployeeThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "Updated" });
        setModalOpen(false);
        resetForm();
        dispatch(fetchEmployees({ keyword, department, page }));
        dispatch(fetchAllEmployees());
      } else {
        const fieldErrors = parseValidationErrors(result.payload);
        if (hasFieldErrors(fieldErrors)) {
          setErrors(fieldErrors);
        } else {
          Toast.fire({ icon: "error", title: fieldErrors._general || "Update failed" });
        }
      }
    } else {
      if (form.role === "ADMIN") {
        setErrors({ role: "ADMIN role is not allowed" });
        return;
      }
      const result = await dispatch(addEmployeeThunk(form));

      if (addEmployeeThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "Added" });
        setModalOpen(false);
        resetForm();
        dispatch(fetchEmployees({ keyword, department, page }));
        dispatch(fetchAllEmployees());
      } else {
        const fieldErrors = parseValidationErrors(result.payload);
        if (hasFieldErrors(fieldErrors)) {
          setErrors(fieldErrors);
        } else {
          Toast.fire({ icon: "error", title: fieldErrors._general || "Add failed" });
        }
      }
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (employeeCode) => {
    const res = await Swal.fire({
      title: "Delete Employee?",
      icon: "warning",
      showCancelButton: true,
    });

    if (res.isConfirmed) {
      const emp = employees.find((e) => e.employeeCode === employeeCode);
      if (!emp) return;

      const result = await dispatch(softDeleteEmployeeThunk(emp.employeeId));
      if (softDeleteEmployeeThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "Deleted" });
        dispatch(fetchEmployees({ keyword, department, page }));
        dispatch(fetchAllEmployees());
      } else {
        Toast.fire({ icon: "error", title: "Delete failed" });
      }
    }
  };

  // ── View ─────────────────────────────────────────────────────────────────
  const handleView = (employeeCode) => {
    const emp = employees.find((e) => e.employeeCode === employeeCode);
    if (!emp) return;

    dispatch(setSelectedEmployee({ ...emp, tasks: [] }));
    setViewOpen(true);

    if (emp.employeeId) {
      dispatch(fetchEmployeeTasks(emp.employeeId));
    }
  };

  // ── Edit ─────────────────────────────────────────────────────────────────
  const handleEdit = (row) => {
    setEditing(row);
    clearErrors();
    setForm({
      username:    row.username    || "",
      firstName:   row.firstName   || "",
      lastName:    row.lastName    || "",
      email:       row.email       || "",
      password:    row.password    || "",
      phoneNumber: row.phoneNumber || "",
      department:  row.department  || "",
      status:      row.status      || "ACTIVE",
      role:        row.role        || "EMPLOYEE",
      companyName: row.companyName || "",   // ✅ prefill company name
      orgId:       row.orgId       || "",   // ✅ prefill orgId
    });
    setModalOpen(true);
  };

  const openAddModal    = () => { resetForm(); clearErrors(); setModalOpen(true); };
  const closeModal      = () => { setModalOpen(false); resetForm(); clearErrors(); };
  const closeViewDrawer = () => { setViewOpen(false); dispatch(clearSelected()); };

  return {
    employees,
    loading,
    totalPages,
    keyword,
    department,
    page,
    selectedEmployee,
    departments,
    organizations,      // ✅ expose org list

    setKeyword:    (val) => dispatch(setKeyword(val)),
    setDepartment: (val) => dispatch(setDepartment(val)),
    setPage:       (val) => dispatch(setPage(val)),

    editing,
    form,
    setForm,
    errors,

    modalOpen,
    openAddModal,
    closeModal,

    viewOpen,
    handleView,
    closeViewDrawer,

    handleSubmit,
    handleDelete,
    handleEdit,
  };
}