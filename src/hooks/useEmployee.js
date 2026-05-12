// src/hooks/useEmployee.js

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import {
  fetchEmployees,
  fetchAllEmployees,        // ← NEW
  addEmployeeThunk,
  updateEmployeeThunk,
  softDeleteEmployeeThunk,
  fetchEmployeeTasks,
  setKeyword,
  setDepartment,
  setPage,
  clearSelected,
} from "../store/slices/employeeSlice";

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
};

export function useEmployee() {
  const dispatch = useDispatch();

  // ── Redux State ──────────────────────────────────────
  const {
    list: employees,
    allEmployees,             // ← NEW: full unfiltered list
    loading,
    totalPages,
    keyword,
    department,
    page,
    selectedEmployee,
  } = useSelector((state) => state.employees);

  // ── Local UI State ───────────────────────────────────
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [errors, setErrors] = useState({});

  // ── Derived ──────────────────────────────────────────
  // Use allEmployees (full list) so the dropdown always shows every
  // department, regardless of the current filter or page.
  const departments = [
    ...new Set(allEmployees.map((e) => e.department).filter(Boolean)),
  ].sort();

  // ── Reset Form ───────────────────────────────────────
  const resetForm = useCallback(() => {
    setEditing(null);
    setForm(emptyForm);
  }, []);

  const clearErrors = () => setErrors({});

  // ── Fetch paginated employees (re-runs on filter/page change) ──
  useEffect(() => {
    dispatch(fetchEmployees({ keyword, department, page }));
  }, [dispatch, keyword, department, page]);

  // ── Fetch ALL employees once (for department dropdown) ──
  useEffect(() => {
    dispatch(fetchAllEmployees());
  }, [dispatch]);

  // ── Submit ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    if (editing) {
      const updatePayload = {
        username: form.username,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        phoneNumber: form.phoneNumber,
        department: form.department,
        status: form.status,
      };

      const result = await dispatch(
        updateEmployeeThunk({ id: editing.employeeId, data: updatePayload })
      );

      if (updateEmployeeThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "Updated" });
        setModalOpen(false);
        resetForm();
        dispatch(fetchEmployees({ keyword, department, page }));
        dispatch(fetchAllEmployees()); // ← keep dropdown in sync after edits
      } else {
        const fieldErrors = parseValidationErrors(result.payload);
        if (hasFieldErrors(fieldErrors)) {
          setErrors(fieldErrors);
        } else {
          Toast.fire({
            icon: "error",
            title: fieldErrors._general || "Update failed",
          });
        }
      }
    } else {
      const result = await dispatch(addEmployeeThunk(form));

      if (addEmployeeThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "Added" });
        setModalOpen(false);
        resetForm();
        dispatch(fetchEmployees({ keyword, department, page }));
        dispatch(fetchAllEmployees()); // ← new employee might have a new department
      } else {
        const fieldErrors = parseValidationErrors(result.payload);
        if (hasFieldErrors(fieldErrors)) {
          setErrors(fieldErrors);
        } else {
          Toast.fire({
            icon: "error",
            title: fieldErrors._general || "Add failed",
          });
        }
      }
    }
  };

  // ── Delete ───────────────────────────────────────────
  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: "Delete Employee?",
      icon: "warning",
      showCancelButton: true,
    });

    if (res.isConfirmed) {
      const result = await dispatch(softDeleteEmployeeThunk(id));
      if (softDeleteEmployeeThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "Deleted" });
        dispatch(fetchEmployees({ keyword, department, page }));
        dispatch(fetchAllEmployees()); // ← keep department list fresh
      } else {
        Toast.fire({ icon: "error", title: "Delete failed" });
      }
    }
  };

  // ── View ─────────────────────────────────────────────
  const handleView = (id) => {
    dispatch(fetchEmployeeTasks(id));
    setViewOpen(true);
  };

  // ── Edit ─────────────────────────────────────────────
  const handleEdit = (row) => {
    setEditing(row);
    setForm({
      username: row.username || "",
      firstName: row.firstName || "",
      lastName: row.lastName || "",
      email: row.email || "",
      password: row.password || "",
      phoneNumber: row.phoneNumber || "",
      department: row.department || "",
      status: row.status || "ACTIVE",
    });
    setModalOpen(true);
  };

  // ── Open Add Modal ───────────────────────────────────
  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  // ── Close Modal ──────────────────────────────────────
  const closeModal = () => {
    setModalOpen(false);
    resetForm();
    clearErrors();
  };

  // ── Close View Drawer ────────────────────────────────
  const closeViewDrawer = () => {
    setViewOpen(false);
    dispatch(clearSelected());
  };

  return {
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
    setKeyword: (val) => dispatch(setKeyword(val)),
    setDepartment: (val) => dispatch(setDepartment(val)),
    setPage: (val) => dispatch(setPage(val)),

    // form state
    editing,
    form,
    setForm,
    errors,

    // modal state
    modalOpen,
    openAddModal,
    closeModal,

    // view drawer state
    viewOpen,
    handleView,
    closeViewDrawer,

    // handlers
    handleSubmit,
    handleDelete,
    handleEdit,
  };
}