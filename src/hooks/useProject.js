// hooks/useProject.js

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import {
  fetchProjects,
  fetchAllEmployees,
  addProjectThunk,
  updateProjectThunk,
  softDeleteProjectThunk,
  assignEmployeeThunk,
  removeEmployeeThunk,
  setKeyword,
  setStatus,
  setPage,
} from "../store/slices/projectSlice";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  didOpen: (t) => {
    t.style.marginTop = "70px";
  },
});

export const PROJECT_STATUSES = [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
];

export const emptyForm = {
  projectName: "",
  description: "",
  status: "PENDING",
  startDate: "",
  endDate: "",
};

export default function useProject() {
  const dispatch = useDispatch();

  // ── Redux state ──────────────────────────────────────
  const {
    list: projects,
    employees,
    loading,
    totalPages,
    keyword,
    status,
    page,
  } = useSelector((state) => state.projects);

  // ── Local state ──────────────────────────────────────
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(emptyForm);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [viewOpen,   setViewOpen]   = useState(false);
  const [selected,   setSelected]   = useState(null);

  // ── Assign drawer state ──────────────────────────────
  const [assignOpen,           setAssignOpen]           = useState(false);
  const [assignProject,        setAssignProject]        = useState(null);
  const [assignedEmployeeIds,  setAssignedEmployeeIds]  = useState([]);
  const [selectEmployeeId,     setSelectEmployeeId]     = useState("");
  // assignSuccess is now: null | { message: string, type: "success" | "error" }
  const [assignSuccess,        setAssignSuccess]        = useState(null);

  // ── Derived ──────────────────────────────────────────
  const availableEmployees = employees.filter(
    (e) => !assignedEmployeeIds.includes(Number(e.employeeId))
  );

  // ── Fetch Projects ───────────────────────────────────
  useEffect(() => {
    dispatch(fetchProjects({ keyword, status, page }));
  }, [dispatch, keyword, status, page]);

  // ── Fetch Employees ──────────────────────────────────
  useEffect(() => {
    dispatch(fetchAllEmployees());
  }, [dispatch]);

  // ── Open Add Modal ───────────────────────────────────
  const openAddModal = useCallback(() => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }, []);

  // ── Reset Form ───────────────────────────────────────
  const resetForm = useCallback(() => {
    setEditing(null);
    setForm(emptyForm);
  }, []);

  // ── Submit ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      projectName: form.projectName,
      description: form.description,
      status:      form.status,
      startDate:   form.startDate ? `${form.startDate}T00:00:00` : null,
      endDate:     form.endDate   ? `${form.endDate}T00:00:00`   : null,
    };

    if (editing) {
      const result = await dispatch(updateProjectThunk({ id: editing.projectId, data: payload }));
      if (updateProjectThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "Updated Successfully" });
      } else {
        Toast.fire({ icon: "error", title: result.payload || "Update failed" });
        return;
      }
    } else {
      const result = await dispatch(addProjectThunk(payload));
      if (addProjectThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "Added Successfully" });
      } else {
        Toast.fire({ icon: "error", title: result.payload || "Add failed" });
        return;
      }
    }

    setModalOpen(false);
    resetForm();
    dispatch(fetchProjects({ keyword, status, page }));
  };

  // ── Delete ───────────────────────────────────────────
  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: "Delete Project?", icon: "warning", showCancelButton: true,
    });
    if (res.isConfirmed) {
      const result = await dispatch(softDeleteProjectThunk(id));
      if (softDeleteProjectThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "Deleted" });
        dispatch(fetchProjects({ keyword, status, page }));
      } else {
        Toast.fire({ icon: "error", title: "Delete failed" });
      }
    }
  };

  // ── View ─────────────────────────────────────────────
  const handleView = (id) => {
    setSelected(projects.find((p) => p.projectId === id));
    setViewOpen(true);
  };

  // ── Edit ─────────────────────────────────────────────
  const handleEdit = (item) => {
    setEditing(item);
    setForm({
      projectName: item.projectName || "",
      description: item.description || "",
      status:      item.status      || "PENDING",
      startDate:   item.startDate?.split("T")[0] || "",
      endDate:     item.endDate?.split("T")[0]   || "",
    });
    setModalOpen(true);
  };

  // ── Open Assign Drawer ───────────────────────────────
  const openAssign = (project) => {
    setAssignProject(project);
    setAssignedEmployeeIds(project.employeeIds?.map(Number) || []);
    setSelectEmployeeId("");
    setAssignSuccess(null); // reset to null
    setAssignOpen(true);
  };

  // ── Assign Employee ──────────────────────────────────
  const handleAssign = async () => {
    if (!assignProject || !selectEmployeeId) return;

    const result = await dispatch(
      assignEmployeeThunk({ projectId: assignProject.projectId, employeeId: selectEmployeeId })
    );

    if (assignEmployeeThunk.fulfilled.match(result)) {
      const newId = Number(selectEmployeeId);
      setAssignedEmployeeIds((prev) => (prev.includes(newId) ? prev : [...prev, newId]));

      const emp  = employees.find((e) => Number(e.employeeId) === newId);
      const name = emp ? `${emp.firstName} ${emp.lastName || ""}`.trim() : "Employee";

      // ✅ Object with type "success" — no Toast
      setAssignSuccess({ message: `${name} assigned successfully`, type: "success" });
      setSelectEmployeeId("");
      dispatch(fetchProjects({ keyword, status, page }));
    } else {
      Toast.fire({ icon: "error", title: "Failed to assign employee" });
    }
  };

  // ── Remove Employee ──────────────────────────────────
  const handleRemove = async (employeeId) => {
    if (!assignProject) return;

    const result = await dispatch(
      removeEmployeeThunk({ projectId: assignProject.projectId, employeeId })
    );

    if (removeEmployeeThunk.fulfilled.match(result)) {
      const emp  = employees.find((e) => Number(e.employeeId) === Number(employeeId));
      const name = emp ? `${emp.firstName} ${emp.lastName || ""}`.trim() : "Employee";

      setAssignedEmployeeIds((prev) => prev.filter((id) => id !== Number(employeeId)));
      // ✅ Object with type "error" (red) — no Toast
      setAssignSuccess({ message: `${name} removed`, type: "error" });
      dispatch(fetchProjects({ keyword, status, page }));
    } else {
      Toast.fire({ icon: "error", title: "Failed to remove employee" });
    }
  };

  // ── Close Modal ──────────────────────────────────────
  const handleCloseModal = () => {
    setModalOpen(false);
    resetForm();
  };

  // ── Close View ───────────────────────────────────────
  const handleCloseView = () => setViewOpen(false);

  // ── Close Assign ─────────────────────────────────────
  const handleCloseAssign = () => {
    setAssignOpen(false);
    setAssignSuccess(null); // reset on close
  };

  return {
    // redux state
    projects, employees, loading, totalPages, keyword, status, page,
    // local state
    editing, form, setForm,
    modalOpen, viewOpen, selected,
    assignOpen, assignProject,
    assignedEmployeeIds, selectEmployeeId, setSelectEmployeeId,
    assignSuccess, setAssignSuccess,
    availableEmployees,
    // actions
    openAddModal, resetForm,
    handleSubmit, handleDelete, handleView, handleEdit,
    openAssign, handleAssign, handleRemove,
    handleCloseModal, handleCloseView, handleCloseAssign,
    // dispatch helpers
    dispatch, setKeyword, setStatus, setPage,
  };
}