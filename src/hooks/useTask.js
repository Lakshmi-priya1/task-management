import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import {
  fetchTasks,
  fetchProjectsForTask,
  fetchMilestonesForTask,
  fetchEmployeesForTask,
  addTaskThunk,
  updateTaskThunk,
  softDeleteTaskThunk,
  assignEmployeeToTaskThunk,
  unassignEmployeeFromTaskThunk,
  setKeyword,
  setStatus,
  setPage,
} from "../store/slices/taskSlice";

import {
  parseValidationErrors,
  hasFieldErrors,
} from "../utils/validationErrorHandler";

export const Toast = Swal.mixin({
  toast: true, position: "top-end",
  showConfirmButton: false, timer: 2500,
  didOpen: (t) => { t.style.marginTop = "70px"; },
});

export const emptyForm = {
  title: "", description: "",
  status: "PENDING", priority: "MEDIUM",
  dueDate: "", projectId: "", milestoneId: "",
};

export const TASK_STATUSES    = ["PENDING", "IN_PROGRESS", "COMPLETED"];
export const TASK_PRIORITIES  = ["LOW", "MEDIUM", "HIGH"];
export const MAX_VISIBLE_CHIPS = 4;

export function useTask() {
  const dispatch = useDispatch();

  // ── Redux state ──────────────────────────────────────
  const {
    list: tasks,
    projects,
    milestones,
    employees,
    loading,
    totalPages,
    keyword,
    status,
    page,
  } = useSelector((state) => state.tasks);

  // ── Form / modal state ───────────────────────────────
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [errors,    setErrors]    = useState({});

  // ── View drawer state ────────────────────────────────
  const [viewOpen,  setViewOpen]  = useState(false);
  const [selected,  setSelected]  = useState(null);

  // ── Assign drawer state ──────────────────────────────
  const [assignDrawerOpen,    setAssignDrawerOpen]    = useState(false);
  const [selectedTask,        setSelectedTask]        = useState(null);
  const [assignEmployeeId,    setAssignEmployeeId]    = useState("");
  const [assignedEmployeeIds, setAssignedEmployeeIds] = useState([]);
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

  // ── Reset form ───────────────────────────────────────
  const resetForm = useCallback(() => {
    setEditing(null);
    setForm(emptyForm);
  }, []);

  const clearErrors = () => setErrors({});

  // ── Fetch on filter / page change ────────────────────
  useEffect(() => {
    dispatch(fetchTasks({ keyword, status, page, size: 5 }));
  }, [dispatch, keyword, status, page]);

  // ── Fetch supporting data once ───────────────────────
  useEffect(() => {
    dispatch(fetchProjectsForTask());
    dispatch(fetchMilestonesForTask());
    dispatch(fetchEmployeesForTask());
  }, [dispatch]);

  // ── Derived ──────────────────────────────────────────
  const filteredMilestones = milestones.filter(
    (m) => Number(m.projectId) === Number(form.projectId)
  );

  const enrichedTasks = tasks.map((t) => ({
    ...t,
    projectName:
      projects.find(
        (p) =>
          Number(p.projectId) ===
          Number(milestones.find((m) => Number(m.milestoneId) === Number(t.milestoneId))?.projectId)
      )?.projectName || "—",
    milestoneName:
      milestones.find((m) => Number(m.milestoneId) === Number(t.milestoneId))?.milestoneName || "—",
  }));

  const availableMembers = employees.filter(
    (e) =>
      projectMembers.map(String).includes(String(e.employeeId)) &&
      !assignedEmployeeIds.map(String).includes(String(e.employeeId))
  );

  // ── View helpers ─────────────────────────────────────
  const getSelectedEmployeeLabel = () => {
    const ids = selected?.employeeIds
      ? selected.employeeIds.map(Number)
      : selected?.employeeId
      ? [Number(selected.employeeId)]
      : [];
    if (ids.length === 0) return "Unassigned";
    return ids
      .map((id) => {
        const emp = employees.find((e) => Number(e.employeeId) === id);
        return emp ? `${emp.firstName} ${emp.lastName || ""}`.trim() : `Employee #${id}`;
      })
      .join(", ");
  };

  const getSelectedProjectName = () =>
    projects.find(
      (p) =>
        Number(p.projectId) ===
        Number(milestones.find((m) => Number(m.milestoneId) === Number(selected?.milestoneId))?.projectId)
    )?.projectName || "—";

  const getSelectedMilestoneName = () =>
    milestones.find((m) => Number(m.milestoneId) === Number(selected?.milestoneId))?.milestoneName || "—";

  // ── Submit ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    // ── Frontend validation ──────────────────────────
    const frontendErrors = {};
    if (!form.projectId)            frontendErrors.projectId   = "Project is required";
    if (!form.milestoneId)          frontendErrors.milestoneId = "Milestone is required";
    if (!form.title?.trim())        frontendErrors.title       = "Title is required";
    if (!form.description?.trim())  frontendErrors.description = "Description is required";
    if (!form.dueDate)              frontendErrors.dueDate     = "Due date is required";

    if (Object.keys(frontendErrors).length > 0) {
      setErrors(frontendErrors);
      return;
    }

    const payload = {
      title:       form.title,
      description: form.description,
      status:      form.status,
      priority:    form.priority,
      milestoneId: Number(form.milestoneId),
      dueDate:     form.dueDate ? `${form.dueDate}T00:00:00` : null,
    };

    if (editing) {
      const result = await dispatch(updateTaskThunk({ id: editing.id, data: payload }));
      if (updateTaskThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "Updated Successfully" });
        setModalOpen(false);
        resetForm();
        dispatch(fetchTasks({ keyword, status, page, size: 5 }));
      } else {
        const fieldErrors = parseValidationErrors(result.payload);
        if (hasFieldErrors(fieldErrors)) {
          setErrors(fieldErrors);
        } else {
          Toast.fire({ icon: "error", title: fieldErrors._general || "Update failed" });
        }
      }
    } else {
      const result = await dispatch(addTaskThunk(payload));
      if (addTaskThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "Added Successfully" });
        setModalOpen(false);
        resetForm();
        dispatch(fetchTasks({ keyword, status, page, size: 5 }));
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
      title: "Delete Task?", icon: "warning", showCancelButton: true,
    });
    if (res.isConfirmed) {
      const result = await dispatch(softDeleteTaskThunk(id));
      if (softDeleteTaskThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "Deleted" });
        dispatch(fetchTasks({ keyword, status, page, size: 5 }));
      } else {
        Toast.fire({ icon: "error", title: "Delete failed" });
      }
    }
  };

  // ── View ─────────────────────────────────────────────
  const handleView = (id) => {
    const task = tasks.find((t) => String(t.id) === String(id));
    setSelected(task);
    setViewOpen(true);
  };

  // ── Edit ─────────────────────────────────────────────
  const handleEdit = (task) => {
    const milestone = milestones.find(
      (m) => Number(m.milestoneId) === Number(task.milestoneId)
    );
    setEditing(task);
    clearErrors();
    setForm({
      title:       task.title       || "",
      description: task.description || "",
      status:      task.status      || "PENDING",
      priority:    task.priority    || "MEDIUM",
      dueDate:     task.dueDate?.split("T")[0] || "",
      projectId:   milestone?.projectId || "",
      milestoneId: task.milestoneId || "",
    });
    setModalOpen(true);
  };

  // ── Open assign drawer ───────────────────────────────
  const openAssignDrawer = (task) => {
    setSelectedTask(task);
    setAssignEmployeeId("");
    setAssignSuccess(null);
    const existing = task.employeeIds
      ? task.employeeIds.map(String)
      : task.employeeId
      ? [String(task.employeeId)]
      : [];
    setAssignedEmployeeIds(existing);
    const milestone = milestones.find(
      (m) => Number(m.milestoneId) === Number(task.milestoneId)
    );
    setProjectMembers((milestone?.employeeIds || []).map(String));
    setAssignDrawerOpen(true);
  };

  // ── Assign ───────────────────────────────────────────
  const handleAssign = async () => {
    if (!selectedTask || !assignEmployeeId) return;
    const result = await dispatch(
      assignEmployeeToTaskThunk({ taskId: selectedTask.id, employeeId: assignEmployeeId })
    );
    if (assignEmployeeToTaskThunk.fulfilled.match(result)) {
      setAssignedEmployeeIds((prev) =>
        prev.map(String).includes(String(assignEmployeeId)) ? prev : [...prev, String(assignEmployeeId)]
      );
      const emp  = employees.find((e) => String(e.employeeId) === String(assignEmployeeId));
      const name = emp ? `${emp.firstName} ${emp.lastName || ""}`.trim() : "Employee";
      setAssignSuccess({ message: `${name} assigned successfully`, type: "success" });
      setAssignEmployeeId("");
      dispatch(fetchTasks({ keyword, status, page, size: 5 }));
    } else {
      Toast.fire({ icon: "error", title: "Employee must belong to project" });
    }
  };

  // ── Unassign ─────────────────────────────────────────
  const handleUnassign = async (employeeId) => {
    if (!selectedTask) return;
    const result = await dispatch(
      unassignEmployeeFromTaskThunk({ taskId: selectedTask.id, employeeId })
    );
    if (unassignEmployeeFromTaskThunk.fulfilled.match(result)) {
      const emp  = employees.find((e) => String(e.employeeId) === String(employeeId));
      const name = emp ? `${emp.firstName} ${emp.lastName || ""}`.trim() : "Employee";
      setAssignedEmployeeIds((prev) => prev.filter((id) => String(id) !== String(employeeId)));
      setAssignSuccess({ message: `${name} removed`, type: "error" });
      dispatch(fetchTasks({ keyword, status, page, size: 5 }));
    } else {
      Toast.fire({ icon: "error", title: "Failed to remove employee" });
    }
  };

  // ── Modal / drawer helpers ───────────────────────────
  const openAddModal      = () => { resetForm(); clearErrors(); setModalOpen(true); };
  const closeModal        = () => { setModalOpen(false); resetForm(); clearErrors(); };
  const closeViewDrawer   = () => setViewOpen(false);
  const closeAssignDrawer = () => { setAssignDrawerOpen(false); setAssignSuccess(null); };

  return {
    // redux
    tasks, projects, milestones, employees,
    loading, totalPages, keyword, status, page,
    setKeyword:  (val) => dispatch(setKeyword(val)),
    setStatus:   (val) => dispatch(setStatus(val)),
    setPage:     (val) => dispatch(setPage(val)),
    // derived
    enrichedTasks, filteredMilestones, availableMembers,
    // form
    editing, form, setForm, errors,
    // modal
    modalOpen, openAddModal, closeModal,
    // view drawer
    viewOpen, selected, handleView, closeViewDrawer,
    getSelectedEmployeeLabel, getSelectedProjectName, getSelectedMilestoneName,
    // assign drawer
    assignDrawerOpen, closeAssignDrawer,
    selectedTask,
    assignedEmployeeIds,
    assignEmployeeId, setAssignEmployeeId,
    assignSuccess, setAssignSuccess,
    // chip toggle
    showAll, setShowAll, visibleChips, hiddenCount,
    // handlers
    handleSubmit, handleDelete, handleEdit,
    openAssignDrawer, handleAssign, handleUnassign,
  };
}