// ======================================================
// FILE: pages/Task.jsx
// ======================================================

import { useState, useEffect, useCallback } from "react";
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
  Chip,
  Stack,
  Drawer,
  IconButton,
  Divider,
  Alert,
  Collapse,
  Tooltip,
} from "@mui/material";

import {
  AddRounded,
  SearchRounded,
  FilterListRounded,
  TaskRounded,
  PersonAddRounded,
  CloseRounded,
  ArrowBackRounded,
} from "@mui/icons-material";

import Swal from "sweetalert2";

import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";
import ViewDrawer from "../components/ViewDrawer";

import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  assignEmployeeToTask,
  unassignEmployeeFromTask,
} from "../services/taskService";

import { getMilestones } from "../services/mileStoneService";
import { getEmployees } from "../services/employeeService";
import { getProjects, getProjectById } from "../services/projectService";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  didOpen: (t) => {
    t.style.marginTop = "70px";
  },
});

const emptyForm = {
  title: "",
  description: "",
  status: "PENDING",
  priority: "MEDIUM",
  dueDate: "",
  projectId: "",
  milestoneId: "",
};

export default function Task() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [assignDrawerOpen, setAssignDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [assignEmployeeId, setAssignEmployeeId] = useState("");
  const [assignedEmployeeIds, setAssignedEmployeeIds] = useState([]);

  const [projectMembers, setProjectMembers] = useState([]);
    const [assignSuccess, setAssignSuccess] = useState("");

  // ======================================================
  // RESET
  // ======================================================

  const reset = useCallback(() => {
    setEditing(null);
    setForm(emptyForm);
  }, []);

  // ======================================================
  // LOADERS
  // ======================================================

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getTasks({
        keyword: searchTerm,
        status: statusFilter,
        page,
        size: 5,
      });
      setTasks(res?.content || []);
      setTotalPages(res?.totalPages || 1);
    } catch {
      Toast.fire({ icon: "error", title: "Failed to load tasks" });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, page]);

  const loadProjects = useCallback(async () => {
    const res = await getProjects({ page: 0, size: 100 });
    setProjects(res?.content || []);
  }, []);

  const loadMilestones = useCallback(async () => {
    const res = await getMilestones({ page: 0, size: 100 });
    setMilestones(res?.content || []);
  }, []);

  const loadEmployees = useCallback(async () => {
    const res = await getEmployees({ page: 0, size: 100 });
    setEmployees(res?.content || []);
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);
  useEffect(() => {
    loadProjects();
    loadMilestones();
    loadEmployees();
  }, [loadProjects, loadMilestones, loadEmployees]);

  // ======================================================
  // FILTER MILESTONES BASED ON PROJECT
  // ======================================================

  const filteredMilestones = milestones.filter(
    (m) => Number(m.projectId) === Number(form.projectId)
  );

  // ======================================================
  // CRUD
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.projectId) {
      Toast.fire({ icon: "error", title: "Project required" });
      return;
    }
    if (!form.milestoneId) {
      Toast.fire({ icon: "error", title: "Milestone required" });
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      status: form.status,
      priority: form.priority,
      milestoneId: Number(form.milestoneId),
      dueDate: form.dueDate ? `${form.dueDate}T00:00:00` : null,
    };

    try {
      if (editing) {
        await updateTask(editing.id, payload);
        Toast.fire({ icon: "success", title: "Updated Successfully" });
      } else {
        await addTask(payload);
        Toast.fire({ icon: "success", title: "Added Successfully" });
      }
      setModalOpen(false);
      reset();
      loadTasks();
    } catch {
      Toast.fire({ icon: "error", title: "Operation Failed" });
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: "Delete Task?",
      icon: "warning",
      showCancelButton: true,
    });
    if (res.isConfirmed) {
      await deleteTask(id);
      Toast.fire({ icon: "success", title: "Deleted" });
      loadTasks();
    }
  };

  // ======================================================
  // ASSIGN EMPLOYEE — OPEN DRAWER
  // ======================================================

  const openAssignDrawer = async (task) => {
  setSelectedTask(task);
  setAssignEmployeeId("");
  setAssignSuccess("");

  const existing = task.employeeIds
    ? task.employeeIds.map(Number)
    : task.employeeId
    ? [Number(task.employeeId)]
    : [];

  setAssignedEmployeeIds(existing);

  const milestone = milestones.find(
    (m) => Number(m.milestoneId) === Number(task.milestoneId)
  );

  if (!milestone?.projectId) {
    setProjectMembers([]);
    setAssignDrawerOpen(true);
    return;
  }

  try {
    const project = await getProjectById(milestone.projectId);

    setProjectMembers(
      project?.employeeIds?.map(Number) || []
    );

    setAssignDrawerOpen(true);
  } catch {
    Toast.fire({
      icon: "error",
      title: "Failed to load project members",
    });
  }
};

  // ======================================================
  // ASSIGN — ADD ONE EMPLOYEE
  // ======================================================

  const handleAssign = async () => {
  if (!selectedTask || !assignEmployeeId) return;

  try {
    await assignEmployeeToTask(
      selectedTask.id,
      assignEmployeeId
    );

    const newId = Number(assignEmployeeId);

    setAssignedEmployeeIds((prev) =>
      prev.includes(newId)
        ? prev
        : [...prev, newId]
    );

    const employee = employees.find(
      (e) => Number(e.employeeId) === newId
    );

    const employeeName = employee
      ? `${employee.firstName} ${employee.lastName || ""}`.trim()
      : "Employee";

    setAssignSuccess(
      `${employeeName} assigned successfully`
    );

    setAssignEmployeeId("");

    Toast.fire({
      icon: "success",
      title: "Employee Assigned",
    });

    loadTasks();
  } catch {
    Toast.fire({
      icon: "error",
      title: "Employee must belong to project",
    });
  }
};
  // ======================================================
  // UNASSIGN — REMOVE ONE EMPLOYEE
  // ======================================================

  const handleUnassign = async (employeeId) => {
  if (!selectedTask) return;

  try {
    await unassignEmployeeFromTask(
      selectedTask.id,
      employeeId
    );

    setAssignedEmployeeIds((prev) =>
      prev.filter(
        (id) => id !== Number(employeeId)
      )
    );

    setAssignSuccess(
      "Employee removed successfully"
    );

    Toast.fire({
      icon: "success",
      title: "Employee Removed",
    });

    loadTasks();
  } catch {
    Toast.fire({
      icon: "error",
      title: "Failed to remove employee",
    });
  }
};

  // ======================================================
  // DERIVED: members eligible to assign
  // — must be in the project AND not already assigned
  // ======================================================

  const availableMembers = employees.filter(
    (e) =>
      projectMembers.includes(Number(e.employeeId)) &&
      !assignedEmployeeIds.includes(Number(e.employeeId))
  );

  // ======================================================
  // UI
  // ======================================================

  return (
    <Box>
      {/* SEARCH + FILTER + ADD */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2, alignItems: "center" }}>
        <TextField size="small" placeholder="Search task..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 240, "& .MuiOutlinedInput-root": { borderRadius: "16px", background: "rgba(255,255,255,.65)" } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchRounded /></InputAdornment> }} />
        <FormControl size="small" sx={{ minWidth: 180, "& .MuiOutlinedInput-root": { borderRadius: "16px", background: "rgba(255,255,255,.65)" } }}>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} displayEmpty
            startAdornment={<InputAdornment position="start"><FilterListRounded /></InputAdornment>}>
            <MenuItem value="">All Status</MenuItem>
            {["PENDING", "IN_PROGRESS", "COMPLETED"].map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          startIcon={<AddRounded />}
          onClick={() => { reset(); setModalOpen(true); }}
          sx={{ ml: "auto", px: 2.5, py: 1, borderRadius: "14px", fontWeight: 700, background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "#fff", textTransform: "none", "&:hover": { opacity: 0.88 } }}
        >
          Add Task
        </Button>
      </Box>

      {/* TABLE */}
      <Card
        sx={{
          borderRadius: "24px",
          overflow: "hidden",
          background: "rgba(255,255,255,.70)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 12px 30px rgba(0,0,0,.05)",
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid rgba(0,0,0,.06)",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <TaskRounded sx={{ color: "#6366f1" }} />
          <Typography sx={{ fontWeight: 800, color: "#312e81" }}>
            Task List
          </Typography>
        </Box>

        <DataTable
          data={tasks.map((t) => ({
            ...t,
            projectName:
              projects.find(
                (p) =>
                  Number(p.projectId) ===
                  Number(
                    milestones.find(
                      (m) => Number(m.milestoneId) === Number(t.milestoneId)
                    )?.projectId
                  )
              )?.projectName || "—",
            milestoneName:
              milestones.find(
                (m) => Number(m.milestoneId) === Number(t.milestoneId)
              )?.milestoneName || "—",
          }))}
          columns={["Title", "Project", "Milestone", "Status",  "Due Date"]}
          fields={["title", "projectName", "milestoneName", "status", "dueDate"]}
          loading={loading}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          handleDelete={handleDelete}
          handleView={(id) => {
            const task = tasks.find((t) => String(t.id) === String(id));
            setSelected(task);
            setViewOpen(true);
          }}
          handleEdit={(task) => {
            const milestone = milestones.find(
              (m) => Number(m.milestoneId) === Number(task.milestoneId)
            );
            setEditing(task);
            setForm({
              title: task.title || "",
              description: task.description || "",
              status: task.status || "PENDING",
              priority: task.priority || "MEDIUM",
              dueDate: task.dueDate?.split("T")[0] || "",
              projectId: milestone?.projectId || "",
              milestoneId: task.milestoneId || "",
            });
            setModalOpen(true);
          }}
          extraActions={[
            {
              label: "Assign Employee",
              icon: <PersonAddRounded sx={{ fontSize: 16 }} />,
              color: "#0891b2",
              bg: "rgba(8,145,178,0.07)",
              onClick: (id, item) => openAssignDrawer(item),
            },
          ]}
        />
      </Card>

      {/* VIEW DRAWER */}
      <ViewDrawer
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Task Details"
        status={selected?.status}
        sections={
          selected
            ? [
                {
                  heading: "Task Info",
                  fields: [
                    { label: "Title", value: selected.title },
                    { label: "Description", value: selected.description },
                    { label: "Status", value: selected.status, badge: true },
                    { label: "Priority", value: selected.priority, badge: true },
                    { label: "Due Date", value: selected.dueDate?.split("T")[0] || "—" },
                  ],
                },
                {
                  heading: "Project & Milestone",
                  fields: [
                    {
                      label: "Project",
                      value:
                        projects.find(
                          (p) =>
                            Number(p.projectId) ===
                            Number(
                              milestones.find(
                                (m) =>
                                  Number(m.milestoneId) ===
                                  Number(selected.milestoneId)
                              )?.projectId
                            )
                        )?.projectName || "—",
                    },
                    {
                      label: "Milestone",
                      value:
                        milestones.find(
                          (m) =>
                            Number(m.milestoneId) === Number(selected.milestoneId)
                        )?.milestoneName || "—",
                    },
                  ],
                },
                {
                  heading: "Assigned Employees",
                  fields: [
                    {
                      label: "Employees",
                      value: (() => {
                        // Support both employeeIds (array) and employeeId (legacy single)
                        const ids = selected.employeeIds
                          ? selected.employeeIds.map(Number)
                          : selected.employeeId
                          ? [Number(selected.employeeId)]
                          : [];

                        if (ids.length === 0) return "Unassigned";

                        return ids
                          .map((id) => {
                            const emp = employees.find(
                              (e) => Number(e.employeeId) === id
                            );
                            return emp
                              ? `${emp.firstName} ${emp.lastName || ""}`.trim()
                              : `Employee #${id}`;
                          })
                          .join(", ");
                      })(),
                    },
                  ],
                },
              ]
            : []
        }
      />

      {/* FORM MODAL */}
      <FormModal
        isOpen={modalOpen}
        handleClose={() => { setModalOpen(false); reset(); }}
        title={editing ? "Edit Task" : "Add Task"}
        formData={form}
        setFormData={setForm}
        handleSubmit={handleSubmit}
        tabs={[
          {
            key: "basic",
            label: "Task Info",
            fields: [
              { name: "title", type: "text" },
              { name: "description", type: "text" },
              {
                name: "projectId",
                label: "Project",
                type: "select",
                options: projects.map((p) => ({
                  value: Number(p.projectId),
                  label: p.projectName,
                })),
              },
              {
                name: "milestoneId",
                label: "Milestone",
                type: "select",
                options: filteredMilestones.map((m) => ({
                  value: Number(m.milestoneId),
                  label: m.milestoneName,
                })),
              },
              {
                name: "status",
                type: "select",
                options: ["PENDING", "IN_PROGRESS", "COMPLETED"],
              },
              {
                name: "priority",
                type: "select",
                options: ["LOW", "MEDIUM", "HIGH"],
              },
              { name: "dueDate", type: "date" },
            ],
          },
        ]}
      />

      {/* ASSIGN DRAWER */}
      {/* ASSIGN DRAWER */}
<Drawer
  anchor="right"
  open={assignDrawerOpen}
  onClose={() => setAssignDrawerOpen(false)}
>
  <Box
    sx={{
      width: 420,
      height: "100%",
      background:
        "linear-gradient(180deg,#f8fafc,#ffffff)",
      display: "flex",
      flexDirection: "column",
    }}
  >

    {/* HEADER */}
    <Box
      sx={{
        p: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: 22,
            color: "#312e81",
          }}
        >
          Assign Team
        </Typography>

        <Typography
          sx={{
            fontSize: 13,
            color: "#64748b",
            mt: 0.5,
          }}
        >
          {selectedTask?.title}
        </Typography>
      </Box>

      <IconButton
        onClick={() =>
          setAssignDrawerOpen(false)
        }
      >
        <CloseRounded />
      </IconButton>
    </Box>

    <Divider />

    {/* CURRENT TEAM */}
    <Box sx={{ p: 3 }}>
      <Typography
        sx={{
          fontWeight: 700,
          mb: 1.5,
          color: "#6366f1",
        }}
      >
        Current Team
      </Typography>

      {assignedEmployeeIds.length === 0 ? (
        <Typography
          sx={{
            color: "#94a3b8",
            fontSize: 14,
          }}
        >
          No employees assigned yet
        </Typography>
      ) : (
        <Stack
          direction="row"
          flexWrap="wrap"
          gap={1}
        >
          {assignedEmployeeIds.map((empId) => {
            const emp = employees.find(
              (e) =>
                Number(e.employeeId) === empId
            );

            const label = emp
              ? `${emp.firstName} ${emp.lastName || ""}`.trim()
              : `Employee #${empId}`;

            return (
              <Chip
                key={empId}
                label={label}
                onDelete={() =>
                  handleUnassign(empId)
                }
                sx={{
                  background: "#ede9fe",
                  color: "#6366f1",
                  fontWeight: 700,
                  "& .MuiChip-deleteIcon":
                    {
                      color: "#8b5cf6",
                    },
                }}
              />
            );
          })}
        </Stack>
      )}
    </Box>

    <Divider />

    {/* ADD EMPLOYEE */}
    <Box sx={{ px: 3, pt: 3 }}>
      <Typography
        sx={{
          fontWeight: 700,
          mb: 1,
          color: "#6366f1",
        }}
      >
        Add Employee
      </Typography>

      {availableMembers.length === 0 ? (
        <Typography
          sx={{
            color: "#94a3b8",
            fontSize: 14,
          }}
        >
          All project members are already
          assigned
        </Typography>
      ) : (
        <FormControl fullWidth>
          <Select
            value={assignEmployeeId}
            onChange={(e) =>
              setAssignEmployeeId(
                e.target.value
              )
            }
            displayEmpty
          >
            <MenuItem value="">
              Select Employee
            </MenuItem>

            {availableMembers.map((e) => (
              <MenuItem
                key={e.employeeId}
                value={e.employeeId}
              >
                {`${e.firstName} ${e.lastName || ""}`.trim()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>

    {/* BUTTONS */}
    <Box
      sx={{
        p: 3,
        mt: "auto",
      }}
    >

      {/* SUCCESS MESSAGE */}
      <Collapse in={!!assignSuccess}>
        <Alert
          severity="success"
          sx={{
            mb: 2,
            borderRadius: "14px",
          }}
          onClose={() =>
            setAssignSuccess("")
          }
        >
          {assignSuccess}
        </Alert>
      </Collapse>

      <Stack spacing={1.5}>

        {/* ASSIGN BUTTON */}
        <Button
          fullWidth
          variant="contained"
          startIcon={
            <PersonAddRounded />
          }
          onClick={handleAssign}
          disabled={!assignEmployeeId}
          sx={{
            py: 1.4,
            borderRadius: "14px",
            fontWeight: 700,
            background:
              "linear-gradient(135deg,#6366f1,#8b5cf6)",
          }}
        >
          Assign Employee
        </Button>

        {/* BACK BUTTON */}
        <Button
          fullWidth
          variant="outlined"
          startIcon={
            <ArrowBackRounded />
          }
          onClick={() =>
            setAssignDrawerOpen(false)
          }
          sx={{
            py: 1.2,
            borderRadius: "14px",
            fontWeight: 700,
            borderColor: "#cbd5e1",
            color: "#475569",
          }}
        >
          Back
        </Button>

      </Stack>
    </Box>
  </Box>
</Drawer>
    </Box>
  );
}