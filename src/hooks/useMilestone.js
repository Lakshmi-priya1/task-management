import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import {
  fetchMilestones,
  fetchMilestoneById,
  fetchProjectsForMilestone,
  fetchEmployeesForMilestone,
  fetchTasksForMilestone,
  addMilestoneThunk,
  updateMilestoneThunk,
  softDeleteMilestoneThunk,
  assignEmployeeToMilestoneThunk,
  unassignEmployeeFromMilestoneThunk,
  setKeyword,
  setProjectFilter,
  setPage,
  clearSelected,
} from "../store/slices/milestoneSlice";

import { getProjectById } from "../services/projectService";

import {
  parseValidationErrors,
  hasFieldErrors,
} from "../utils/validationErrorHandler";

export const Toast = Swal.mixin({
  toast: true, position: "top-end",
  showConfirmButton: false, timer: 2500,
  didOpen: (toast) => { toast.style.marginTop = "70px"; },
});

export const MILESTONE_STATUSES  = ["PENDING", "IN_PROGRESS", "COMPLETED"];
export const MAX_VISIBLE_CHIPS   = 4;

export const emptyForm = {
  milestoneName: "", description: "",
  status: "PENDING", dueDate: "", projectId: "",
};

export function useMilestone() {
  const dispatch = useDispatch();

  // ── Redux state ──────────────────────────────────────
  const {
    list: milestones, projects, employees, tasks,
    selected, loading, totalPages, keyword, projectFilter, page,
  } = useSelector((state) => state.milestones);

  // ── Form / modal state ───────────────────────────────
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [errors,    setErrors]    = useState({});

  // ── View drawer state ────────────────────────────────
  const [viewOpen, setViewOpen] = useState(false);

  // ── Assign drawer state ──────────────────────────────
  const [assignDrawerOpen,    setAssignDrawerOpen]    = useState(false);
  const [selectedMilestone,   setSelectedMilestone]   = useState(null);
  const [assignedEmployeeIds, setAssignedEmployeeIds] = useState([]);
  const [selectEmployeeId,    setSelectEmployeeId]    = useState("");
  const [projectMembers,      setProjectMembers]      = useState([]);
  const [assignSuccess,       setAssignSuccess]       = useState(null);

  // ── Chip toggle state ────────────────────────────────
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!assignDrawerOpen) setShowAll(false);
  }, [assignDrawerOpen]);

  const visibleChips = showAll
    ? assignedEmployeeIds
    : assignedEmployeeIds.slice(0, MAX_VISIBLE_CHIPS);

  const hiddenCount = assignedEmployeeIds.length - MAX_VISIBLE_CHIPS;

  // ── Derived ──────────────────────────────────────────
  const availableMembers = employees.filter(
    (e) =>
      projectMembers.map(String).includes(String(e.employeeId)) &&
      !assignedEmployeeIds.map(String).includes(String(e.employeeId))
  );

  // ── Reset form ───────────────────────────────────────
  const resetForm = useCallback(() => {
    setEditing(null);
    setForm(emptyForm);
  }, []);

  const clearErrors = () => setErrors({});

  // ── Fetch on filter / page change ────────────────────
  useEffect(() => {
    dispatch(fetchMilestones({ keyword, projectId: projectFilter, page }));
  }, [dispatch, keyword, projectFilter, page]);

  // ── Fetch supporting data once ───────────────────────
  useEffect(() => {
    dispatch(fetchProjectsForMilestone());
    dispatch(fetchEmployeesForMilestone());
    dispatch(fetchTasksForMilestone());
  }, [dispatch]);

  // ── Submit ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    // ── Frontend validation ──────────────────────────
    const frontendErrors = {};
    if (!form.projectId)             frontendErrors.projectId     = "Project is required";
    if (!form.milestoneName?.trim()) frontendErrors.milestoneName = "Milestone name is required";
    if (!form.description?.trim())   frontendErrors.description   = "Description is required";
    if (!form.dueDate)               frontendErrors.dueDate       = "Due date is required";

    if (Object.keys(frontendErrors).length > 0) {
      setErrors(frontendErrors);
      return;
    }

    const payload = {
      ...form,
      projectId: Number(form.projectId),
      dueDate: form.dueDate
        ? (form.dueDate.includes("T") ? form.dueDate : `${form.dueDate}T00:00:00`)
        : null,
    };

    if (editing) {
      const result = await dispatch(updateMilestoneThunk({ id: editing.milestoneId, data: payload }));
      if (updateMilestoneThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "Updated" });
        setModalOpen(false);
        resetForm();
        dispatch(fetchMilestones({ keyword, projectId: projectFilter, page }));
      } else {
        const fieldErrors = parseValidationErrors(result.payload);
        if (hasFieldErrors(fieldErrors)) {
          setErrors(fieldErrors);
        } else {
          Toast.fire({ icon: "error", title: fieldErrors._general || "Update failed" });
        }
      }
    } else {
      const result = await dispatch(addMilestoneThunk(payload));
      if (addMilestoneThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "Added" });
        setModalOpen(false);
        resetForm();
        dispatch(fetchMilestones({ keyword, projectId: projectFilter, page }));
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
      title: "Delete Milestone?", icon: "warning", showCancelButton: true,
    });
    if (res.isConfirmed) {
      const result = await dispatch(softDeleteMilestoneThunk(id));
      if (softDeleteMilestoneThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "Deleted" });
        dispatch(fetchMilestones({ keyword, projectId: projectFilter, page }));
      } else {
        Toast.fire({ icon: "error", title: "Delete failed" });
      }
    }
  };

  // ── View ─────────────────────────────────────────────
  const handleView = (id) => {
    dispatch(fetchMilestoneById(id));
    setViewOpen(true);
  };

  // ── Edit ─────────────────────────────────────────────
  const handleEdit = (row) => {
    setEditing(row);
    clearErrors();
    setForm({
      milestoneName: row.milestoneName || "",
      description:   row.description   || "",
      status:        row.status        || "PENDING",
      dueDate:       row.dueDate?.split("T")[0] || "",
      projectId:     row.projectId     || "",
    });
    setModalOpen(true);
  };

  // ── Open assign drawer ───────────────────────────────
  const openAssignDrawer = async (milestone) => {
    setSelectedMilestone(milestone);
    setSelectEmployeeId("");
    setAssignSuccess(null);
    setAssignedEmployeeIds((milestone.employeeIds || []).map(String));
    try {
      const project = await getProjectById(milestone.projectId);
      setProjectMembers((project?.employeeIds || []).map(String));
      setAssignDrawerOpen(true);
    } catch {
      Toast.fire({ icon: "error", title: "Failed to load project members" });
    }
  };

  // ── Assign ───────────────────────────────────────────
  const handleAssign = async () => {
    if (!selectedMilestone || !selectEmployeeId) return;
    const result = await dispatch(
      assignEmployeeToMilestoneThunk({
        milestoneId: selectedMilestone.milestoneId,
        employeeId:  selectEmployeeId,
      })
    );
    if (assignEmployeeToMilestoneThunk.fulfilled.match(result)) {
      setAssignedEmployeeIds((prev) =>
        prev.map(String).includes(String(selectEmployeeId)) ? prev : [...prev, String(selectEmployeeId)]
      );
      const emp  = employees.find((e) => String(e.employeeId) === String(selectEmployeeId));
      const name = emp ? `${emp.firstName} ${emp.lastName || ""}`.trim() : "Employee";
      setSelectEmployeeId("");
      setAssignSuccess({ message: `${name} assigned successfully`, type: "success" });
      dispatch(fetchMilestones({ keyword, projectId: projectFilter, page }));
    } else {
      Toast.fire({ icon: "error", title: "Employee must belong to project" });
    }
  };

  // ── Unassign ─────────────────────────────────────────
  const handleUnassign = async (employeeId) => {
    if (!selectedMilestone) return;
    const result = await dispatch(
      unassignEmployeeFromMilestoneThunk({
        milestoneId: selectedMilestone.milestoneId,
        employeeId,
      })
    );
    if (unassignEmployeeFromMilestoneThunk.fulfilled.match(result)) {
      const emp  = employees.find((e) => String(e.employeeId) === String(employeeId));
      const name = emp ? `${emp.firstName} ${emp.lastName || ""}`.trim() : "Employee";
      setAssignedEmployeeIds((prev) => prev.filter((id) => String(id) !== String(employeeId)));
      setAssignSuccess({ message: `${name} removed`, type: "error" });
      dispatch(fetchMilestones({ keyword, projectId: projectFilter, page }));
    } else {
      Toast.fire({ icon: "error", title: "Failed to remove employee" });
    }
  };

  // ── Close helpers ────────────────────────────────────
  const openAddModal      = () => { resetForm(); clearErrors(); setModalOpen(true); };
  const closeModal        = () => { setModalOpen(false); resetForm(); clearErrors(); };
  const closeViewDrawer   = () => { setViewOpen(false); dispatch(clearSelected()); };
  const closeAssignDrawer = () => { setAssignDrawerOpen(false); setAssignSuccess(null); };

  return {
    // redux
    milestones, projects, employees, tasks, selected,
    loading, totalPages, keyword, projectFilter, page,
    setKeyword:       (val) => dispatch(setKeyword(val)),
    setProjectFilter: (val) => dispatch(setProjectFilter(val)),
    setPage:          (val) => dispatch(setPage(val)),
    // form
    editing, form, setForm, errors,
    // modal
    modalOpen, openAddModal, closeModal,
    // view drawer
    viewOpen, handleView, closeViewDrawer,
    // assign drawer
    assignDrawerOpen, closeAssignDrawer,
    selectedMilestone,
    assignedEmployeeIds,
    selectEmployeeId, setSelectEmployeeId,
    assignSuccess, setAssignSuccess,
    availableMembers,
    // chip toggle
    showAll, setShowAll, visibleChips, hiddenCount,
    // handlers
    handleSubmit, handleDelete, handleEdit,
    openAssignDrawer, handleAssign, handleUnassign,
  };
}