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

import {
  parseValidationErrors,
  hasFieldErrors,
} from "../utils/validationErrorHandler";

const Toast = Swal.mixin({
  toast: true, position: "top-end",
  showConfirmButton: false, timer: 2500,
  didOpen: (t) => { t.style.marginTop = "70px"; },
});

export const PROJECT_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED"];

export const emptyForm = {
  projectName: "", description: "",
  status: "PENDING", startDate: "", endDate: "",
};

export const MAX_VISIBLE_CHIPS = 4;

export default function useProject() {
  const dispatch = useDispatch();

  // ── Redux state ──────────────────────────────────────
  const {
    list: projects, employees,
    loading, totalPages, keyword, status, page,
  } = useSelector((state) => state.projects);

  // ── Form / modal state ───────────────────────────────
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [errors,    setErrors]    = useState({});

  // ── View drawer state ────────────────────────────────
  const [viewOpen,  setViewOpen]  = useState(false);
  const [selected,  setSelected]  = useState(null);

  // ── Assign drawer state ──────────────────────────────
  const [assignOpen,          setAssignOpen]          = useState(false);
  const [assignProject,       setAssignProject]       = useState(null);
  const [assignedEmployeeIds, setAssignedEmployeeIds] = useState([]);
  const [selectEmployeeId,    setSelectEmployeeId]    = useState("");
  const [assignSuccess,       setAssignSuccess]       = useState(null);

  // ── Chip toggle state ────────────────────────────────
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!assignOpen) setShowAll(false);
  }, [assignOpen]);

  const visibleChips = showAll
    ? assignedEmployeeIds
    : assignedEmployeeIds.slice(0, MAX_VISIBLE_CHIPS);

  const hiddenCount = assignedEmployeeIds.length - MAX_VISIBLE_CHIPS;

  // ── Derived ──────────────────────────────────────────
  const availableEmployees = employees.filter(
    (e) => !assignedEmployeeIds.map(String).includes(String(e.employeeId))
  );

  // ── Fetch on filter / page change ────────────────────
  useEffect(() => {
    dispatch(fetchProjects({ keyword, status, page }));
  }, [dispatch, keyword, status, page]);

  // ── Fetch employees once ─────────────────────────────
  useEffect(() => {
    dispatch(fetchAllEmployees());
  }, [dispatch]);

  // ── Reset form ───────────────────────────────────────
  const resetForm = useCallback(() => {
    setEditing(null);
    setForm(emptyForm);
  }, []);

  const clearErrors = () => setErrors({});

  // ── Open add modal ───────────────────────────────────
  const openAddModal = useCallback(() => {
    resetForm();
    clearErrors();
    setModalOpen(true);
  }, [resetForm]);

  // ── Submit ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

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
        setModalOpen(false);
        resetForm();
        dispatch(fetchProjects({ keyword, status, page }));
      } else {
        const fieldErrors = parseValidationErrors(result.payload);
        if (hasFieldErrors(fieldErrors)) {
          setErrors(fieldErrors);
        } else {
          Toast.fire({ icon: "error", title: fieldErrors._general || "Update failed" });
        }
      }
    } else {
      const result = await dispatch(addProjectThunk(payload));
      if (addProjectThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "Added Successfully" });
        setModalOpen(false);
        resetForm();
        dispatch(fetchProjects({ keyword, status, page }));
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
    clearErrors();
    setForm({
      projectName: item.projectName || "",
      description: item.description || "",
      status:      item.status      || "PENDING",
      startDate:   item.startDate?.split("T")[0] || "",
      endDate:     item.endDate?.split("T")[0]   || "",
    });
    setModalOpen(true);
  };

  // ── Open assign drawer ───────────────────────────────
  const openAssign = (project) => {
    setAssignProject(project);
    setAssignedEmployeeIds((project.employeeIds || []).map(String));
    setSelectEmployeeId("");
    setAssignSuccess(null);
    setAssignOpen(true);
  };

  // ── Assign employee ──────────────────────────────────
  const handleAssign = async () => {
    if (!assignProject || !selectEmployeeId) return;
    const result = await dispatch(
      assignEmployeeThunk({ projectId: assignProject.projectId, employeeId: selectEmployeeId })
    );
    if (assignEmployeeThunk.fulfilled.match(result)) {
      setAssignedEmployeeIds((prev) =>
        prev.includes(String(selectEmployeeId)) ? prev : [...prev, String(selectEmployeeId)]
      );
      const emp  = employees.find((e) => String(e.employeeId) === String(selectEmployeeId));
      const name = emp ? `${emp.firstName} ${emp.lastName || ""}`.trim() : "Employee";
      setAssignSuccess({ message: `${name} assigned successfully`, type: "success" });
      setSelectEmployeeId("");
      dispatch(fetchProjects({ keyword, status, page }));
    } else {
      Toast.fire({ icon: "error", title: "Failed to assign employee" });
    }
  };

  const handleRemove = async (employeeId) => {
    if (!assignProject) return;
    const result = await dispatch(
      removeEmployeeThunk({ projectId: assignProject.projectId, employeeId })
    );
    if (removeEmployeeThunk.fulfilled.match(result)) {
      const emp  = employees.find((e) => String(e.employeeId) === String(employeeId));
      const name = emp ? `${emp.firstName} ${emp.lastName || ""}`.trim() : "Employee";
      setAssignedEmployeeIds((prev) => prev.filter((id) => String(id) !== String(employeeId)));
      setAssignSuccess({ message: `${name} removed`, type: "error" });
      dispatch(fetchProjects({ keyword, status, page }));
    } else {
      Toast.fire({ icon: "error", title: "Failed to remove employee" });
    }
  };

  // ── Close helpers ────────────────────────────────────
  const handleCloseModal  = () => { setModalOpen(false); resetForm(); clearErrors(); };
  const handleCloseView   = () => setViewOpen(false);
  const handleCloseAssign = () => { setAssignOpen(false); setAssignSuccess(null); };

  return {
    // redux
    projects, employees, loading, totalPages, keyword, status, page,
    setKeyword: (val) => dispatch(setKeyword(val)),
    setStatus:  (val) => dispatch(setStatus(val)),
    setPage:    (val) => dispatch(setPage(val)),
    editing, form, setForm, errors,
    modalOpen, openAddModal, handleCloseModal,
    viewOpen, selected, handleView, handleCloseView,
    assignOpen, assignProject,
    assignedEmployeeIds, selectEmployeeId, setSelectEmployeeId,
    assignSuccess, setAssignSuccess,
    availableEmployees,
    showAll, setShowAll, visibleChips, hiddenCount,
    handleSubmit, handleDelete, handleEdit,
    openAssign, handleAssign, handleRemove, handleCloseAssign,
  };
}