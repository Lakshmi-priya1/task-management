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
  FolderRounded,
  PersonAddRounded,
  CloseRounded,
  ArrowBackRounded,
} from "@mui/icons-material";

import Swal from "sweetalert2";

import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";
import ViewDrawer from "../components/ViewDrawer";

import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  assignEmployeeToProject,
  removeEmployeeFromProject,
} from "../services/projectService";

import { getEmployees } from "../services/employeeService";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  didOpen: (t) => {
    t.style.marginTop = "70px";
  },
});

const PROJECT_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED"];

const emptyForm = {
  projectName: "",
  description: "",
  status: "PENDING",
  startDate: "",
  endDate: "",
};

export default function Project() {

  // ================= STATE =================
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const [assignOpen, setAssignOpen] = useState(false);
  const [assignProject, setAssignProject] = useState(null);

  const [assignedEmployeeIds, setAssignedEmployeeIds] = useState([]);
  const [selectEmployeeId, setSelectEmployeeId] = useState("");

  // SUCCESS MESSAGE
  const [assignSuccess, setAssignSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const reset = useCallback(() => {
    setEditing(null);
    setForm(emptyForm);
  }, []);

  // ================= LOAD =================
  const loadProjects = useCallback(async () => {
    const res = await getProjects({
      keyword: search,
      status,
      page,
      size: 5,
    });

    setProjects(res?.content || []);
    setTotalPages(res?.totalPages || 1);
  }, [search, status, page]);

  const loadEmployees = useCallback(async () => {
    const res = await getEmployees({ page: 0, size: 100 });
    setEmployees(res?.content || []);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEmployees();
  }, [loadEmployees]);

  // ================= CRUD =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      projectName: form.projectName,
      description: form.description,
      status: form.status,
      startDate: form.startDate
        ? `${form.startDate}T00:00:00`
        : null,
      endDate: form.endDate
        ? `${form.endDate}T00:00:00`
        : null,
    };

    if (editing) {
      await updateProject(editing.projectId, payload);

      Toast.fire({
        icon: "success",
        title: "Updated Successfully",
      });
    } else {
      await addProject(payload);

      Toast.fire({
        icon: "success",
        title: "Added Successfully",
      });
    }

    setModalOpen(false);
    reset();
    loadProjects();
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: "Delete Project?",
      icon: "warning",
      showCancelButton: true,
    });

    if (res.isConfirmed) {
      await deleteProject(id);

      Toast.fire({
        icon: "success",
        title: "Deleted",
      });

      loadProjects();
    }
  };

  // ================= ASSIGN DRAWER =================
  const openAssign = (project) => {
    setAssignProject(project);

    setAssignedEmployeeIds(
      project.employeeIds?.map(Number) || []
    );

    setSelectEmployeeId("");
    setAssignSuccess("");
    setAssignOpen(true);
  };

  // ================= ASSIGN =================
  const handleAssign = async () => {
    if (!assignProject || !selectEmployeeId) return;

    try {
      await assignEmployeeToProject(
        assignProject.projectId,
        selectEmployeeId
      );

      const newId = Number(selectEmployeeId);

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

      setSelectEmployeeId("");

      Toast.fire({
        icon: "success",
        title: "Employee Assigned",
      });

      loadProjects();
    } catch {
      Toast.fire({
        icon: "error",
        title: "Failed to assign employee",
      });
    }
  };

  // ================= REMOVE =================
  const handleRemove = async (employeeId) => {
    if (!assignProject) return;

    try {
      await removeEmployeeFromProject(
        assignProject.projectId,
        employeeId
      );

      setAssignedEmployeeIds((prev) =>
        prev.filter(
          (id) => id !== Number(employeeId)
        )
      );

      setAssignSuccess("Employee removed successfully");

      Toast.fire({
        icon: "success",
        title: "Employee Removed",
      });

      loadProjects();
    } catch {
      Toast.fire({
        icon: "error",
        title: "Failed to remove employee",
      });
    }
  };

  // ================= FILTER =================
  const availableEmployees = employees.filter(
    (e) =>
      !assignedEmployeeIds.includes(
        Number(e.employeeId)
      )
  );

  // ================= UI =================
  return (
    <Box>

      {/* SEARCH + FILTER + ADD */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2, alignItems: "center" }}>
        <TextField size="small" placeholder="Search project..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 240, "& .MuiOutlinedInput-root": { borderRadius: "16px", background: "rgba(255,255,255,.65)" } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchRounded /></InputAdornment> }} />
        <FormControl size="small" sx={{ minWidth: 180, "& .MuiOutlinedInput-root": { borderRadius: "16px", background: "rgba(255,255,255,.65)" } }}>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} displayEmpty>
            <MenuItem value="">All Status</MenuItem>
            {PROJECT_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
        <Button
          startIcon={<AddRounded />}
          onClick={() => { reset(); setModalOpen(true); }}
          sx={{ ml: "auto", px: 2.5, py: 1, borderRadius: "14px", fontWeight: 700, background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "#fff", textTransform: "none", "&:hover": { opacity: 0.88 } }}
        >
          Add Project
        </Button>
      </Box>

      {/* TABLE */}
      <Card
        sx={{
          borderRadius: "24px",
          overflow: "hidden",
          background:
            "rgba(255,255,255,.70)",
          backdropFilter: "blur(16px)",
          boxShadow:
            "0 12px 30px rgba(0,0,0,.05)",
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom:
              "1px solid rgba(0,0,0,.06)",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <FolderRounded
            sx={{ color: "#6366f1" }}
          />

          <Typography
            sx={{
              fontWeight: 800,
              color: "#312e81",
            }}
          >
            Project List
          </Typography>
        </Box>

        <DataTable
          data={projects}
          columns={[
            "Project Name",
            "Status",
            "Start Date",
            "End Date",
          ]}
          fields={[
            "projectName",
            "status",
            "startDate",
            "endDate",
          ]}
          idField="projectId"
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}

          handleView={(id) => {
            setSelected(
              projects.find(
                (p) => p.projectId === id
              )
            );

            setViewOpen(true);
          }}

          handleEdit={(item) => {
            setEditing(item);

            setForm({
              projectName: item.projectName,
              description: item.description,
              status: item.status,
              startDate:
                item.startDate?.split("T")[0],
              endDate:
                item.endDate?.split("T")[0],
            });

            setModalOpen(true);
          }}

          handleDelete={handleDelete}

          extraActions={[
            {
              label: "Assign Team",
              icon: (
                <PersonAddRounded
                  sx={{ fontSize: 16 }}
                />
              ),
              color: "#0891b2",
              bg: "rgba(8,145,178,0.07)",
              onClick: (id, row) =>
                openAssign(row),
            },
          ]}
        />
      </Card>

      {/* VIEW DRAWER */}
     <ViewDrawer
  isOpen={viewOpen}
  onClose={() => setViewOpen(false)}
  title="Project Details"
  status={selected?.status}
  sections={
    selected
      ? [
          // ================= BASIC INFO =================
          {
            heading: "Basic Info",
            fields: [
              {
                label: "Project ID",
                value: selected.projectId,
                badge: true,
              },
              {
                label: "Project Name",
                value: selected.projectName,
              },
              {
                label: "Description",
                value: selected.description || "—",
              },
              {
                label: "Status",
                value: selected.status,
                badge: true,
              },
              {
                label: "Start Date",
                value:
                  selected.startDate?.split("T")[0] || "—",
              },
              {
                label: "End Date",
                value:
                  selected.endDate?.split("T")[0] || "—",
              },
            ],
          },

          // ================= EMPLOYEES =================
          {
            heading: "Assigned Employees",
            fields:
              selected.employeeIds?.length > 0
                ? selected.employeeIds.map((id, index) => ({
                    label:
                      selected.employeeFirstNames?.[index] ||
                      `Employee ${index + 1}`,
                    value: `Employee ID : ${id}`,
                    badge: true,
                  }))
                : [
                    {
                      label: "No Employees Assigned",
                      value: "—",
                    },
                  ],
          },

          // ================= TASKS =================
          {
            heading: "Tasks",
            fields:
              selected.taskIds?.length > 0
                ? selected.taskIds.map((id, index) => ({
                    label:
                      selected.taskTitles?.[index] ||
                      `Task ${index + 1}`,
                    value: `Task ID : ${id}`,
                    badge: true,
                  }))
                : [
                    {
                      label: "No Tasks Available",
                      value: "—",
                    },
                  ],
          },

          // ================= MILESTONES =================
          {
            heading: "Milestones",
            fields:
              selected.milestoneIds?.length > 0
                ? selected.milestoneIds.map((id, index) => ({
                    label:
                      selected.milestoneNames?.[index] ||
                      `Milestone ${index + 1}`,
                    value: `Milestone ID : ${id}`,
                    badge: true,
                  }))
                : [
                    {
                      label: "No Milestones",
                      value: "—",
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
        handleClose={() => {
          setModalOpen(false);
          reset();
        }}
        title={
          editing
            ? "Edit Project"
            : "Add Project"
        }
        formData={form}
        setFormData={setForm}
        handleSubmit={handleSubmit}
        tabs={[
          {
            key: "basic",
            label: "Basic Info",
            fields: [
              {
                name: "projectName",
                type: "text",
              },
              {
                name: "description",
                type: "text",
              },
              {
                name: "status",
                type: "select",
                options:
                  PROJECT_STATUSES,
              },
              {
                name: "startDate",
                type: "date",
              },
              {
                name: "endDate",
                type: "date",
              },
            ],
          },
        ]}
      />

      {/* ASSIGN DRAWER */}
      <Drawer
        anchor="right"
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
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
              justifyContent:
                "space-between",
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
                {assignProject?.projectName}
              </Typography>
            </Box>

            <IconButton
              onClick={() =>
                setAssignOpen(false)
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

            {assignedEmployeeIds.length ===
            0 ? (
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
                {assignedEmployeeIds.map(
                  (empId) => {
                    const emp =
                      employees.find(
                        (e) =>
                          Number(
                            e.employeeId
                          ) === empId
                      );

                    const label = emp
                      ? `${emp.firstName} ${emp.lastName || ""}`.trim()
                      : `Employee #${empId}`;

                    return (
                      <Chip
                        key={empId}
                        label={label}
                        onDelete={() =>
                          handleRemove(empId)
                        }
                        sx={{
                          background:
                            "#ede9fe",
                          color: "#6366f1",
                          fontWeight: 700,
                          "& .MuiChip-deleteIcon":
                            {
                              color:
                                "#8b5cf6",
                            },
                        }}
                      />
                    );
                  }
                )}
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

            {availableEmployees.length ===
            0 ? (
              <Typography
                sx={{
                  color: "#94a3b8",
                  fontSize: 14,
                }}
              >
                All employees are already
                assigned
              </Typography>
            ) : (
              <FormControl fullWidth>
                <Select
                  value={selectEmployeeId}
                  onChange={(e) =>
                    setSelectEmployeeId(
                      e.target.value
                    )
                  }
                  displayEmpty
                >
                  <MenuItem value="">
                    Select Employee
                  </MenuItem>

                  {availableEmployees.map(
                    (e) => (
                      <MenuItem
                        key={e.employeeId}
                        value={e.employeeId}
                      >
                        {`${e.firstName} ${e.lastName || ""}`.trim()}
                      </MenuItem>
                    )
                  )}
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

              {/* ASSIGN */}
              <Button
                fullWidth
                variant="contained"
                startIcon={
                  <PersonAddRounded />
                }
                onClick={handleAssign}
                disabled={!selectEmployeeId}
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
                  setAssignOpen(false)
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