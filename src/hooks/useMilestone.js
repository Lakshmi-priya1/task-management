// hooks/useMilestone.js
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

export const Toast = Swal.mixin({
  toast: true, position: "top-end",
  showConfirmButton: false, timer: 2500,
  didOpen: (toast) => { toast.style.marginTop = "70px"; },
});

export const MILESTONE_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED"];

export const emptyForm = {
  milestoneName: "", description: "",
  status: "PENDING", dueDate: "", projectId: "",
};

export function useMilestone() {
  const dispatch = useDispatch();

  // ── Redux state ──────────────────────────────────────
  const {
    list: milestones,
    projects,
    employees,
    tasks,
    selected,
    loading,
    totalPages,
    keyword,
    projectFilter,
    page,
  } = useSelector((state) => state.milestones);

  // ── Local UI state ───────────────────────────────────
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen,  setViewOpen]  = useState(false);

  // assign drawer
  const [assignDrawerOpen,    setAssignDrawerOpen]    = useState(false);
  const [selectedMilestone,   setSelectedMilestone]   = useState(null);
  const [assignedEmployeeIds, setAssignedEmployeeIds] = useState([]);
  const [selectEmployeeId,    setSelectEmployeeId]    = useState("");
  const [projectMembers,      setProjectMembers]      = useState([]);
  // assignSuccess is now: null | { message: string, type: "success" | "error" }
  const [assignSuccess,       setAssignSuccess]       = useState(null);

  // ── Reset form ───────────────────────────────────────
  const resetForm = useCallback(() => {
    setEditing(null);
    setForm(emptyForm);
  }, []);

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
    if (!form.projectId) {
      Toast.fire({ icon: "error", title: "Project is required" });
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
      } else {
        Toast.fire({ icon: "error", title: result.payload || "Update failed" });
        return;
      }
    } else {
      const result = await dispatch(addMilestoneThunk(payload));
      if (addMilestoneThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "Added" });
      } else {
        Toast.fire({ icon: "error", title: result.payload || "Add failed" });
        return;
      }
    }

    setModalOpen(false);
    resetForm();
    dispatch(fetchMilestones({ keyword, projectId: projectFilter, page }));
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
    setForm({
      milestoneName: row.milestoneName || "",
      description:   row.description   || "",
      status:        row.status        || "PENDING",
      dueDate:       row.dueDate?.split("T")[0] || "",
      projectId:     row.projectId     || "",
    });
    setModalOpen(true);
  };

  // ── Assign drawer — open ─────────────────────────────
  const openAssignDrawer = async (milestone) => {
    setSelectedMilestone(milestone);
    setSelectEmployeeId("");
    setAssignSuccess(null); // reset to null
    setAssignedEmployeeIds(milestone.employeeIds?.map(Number) || []);
    try {
      const project = await getProjectById(milestone.projectId);
      setProjectMembers(project?.employeeIds?.map(Number) || []);
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
      const newId = Number(selectEmployeeId);
      setAssignedEmployeeIds((prev) => (prev.includes(newId) ? prev : [...prev, newId]));

      const emp  = employees.find((e) => Number(e.employeeId) === newId);
      const name = emp ? `${emp.firstName} ${emp.lastName || ""}`.trim() : "Employee";

      setSelectEmployeeId("");
      // ✅ Object with type "success" — no Toast
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
      const emp  = employees.find((e) => Number(e.employeeId) === Number(employeeId));
      const name = emp ? `${emp.firstName} ${emp.lastName || ""}`.trim() : "Employee";

      setAssignedEmployeeIds((prev) => prev.filter((id) => id !== Number(employeeId)));
      // ✅ Object with type "error" (red) — no Toast
      setAssignSuccess({ message: `${name} removed`, type: "error" });
      dispatch(fetchMilestones({ keyword, projectId: projectFilter, page }));
    } else {
      Toast.fire({ icon: "error", title: "Failed to remove employee" });
    }
  };

  const availableMembers = employees.filter(
    (e) =>
      projectMembers.includes(Number(e.employeeId)) &&
      !assignedEmployeeIds.includes(Number(e.employeeId))
  );

  const closeViewDrawer = () => {
    setViewOpen(false);
    dispatch(clearSelected());
  };

  const closeAssignDrawer = () => {
    setAssignDrawerOpen(false);
    setAssignSuccess(null); // reset on close
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  return {
    // redux state
    milestones, projects, employees, tasks, selected,
    loading, totalPages, keyword, projectFilter, page,
    // dispatch helpers
    setKeyword:       (val) => dispatch(setKeyword(val)),
    setProjectFilter: (val) => dispatch(setProjectFilter(val)),
    setPage:          (val) => dispatch(setPage(val)),
    // form state
    editing, form, setForm,
    // modal state
    modalOpen, openAddModal, closeModal,
    // view drawer state
    viewOpen, handleView, closeViewDrawer,
    // assign drawer state
    assignDrawerOpen, closeAssignDrawer,
    selectedMilestone,
    assignedEmployeeIds,
    selectEmployeeId, setSelectEmployeeId,
    assignSuccess, setAssignSuccess,
    availableMembers,
    // handlers
    handleSubmit, handleDelete, handleEdit,
    openAssignDrawer, handleAssign, handleUnassign,
  };
}