import { useState } from "react";
import {
  Box, Button, Typography, TextField,
  InputAdornment, Select, MenuItem, FormControl, Card,
  Chip, Drawer, IconButton, Divider,
} from "@mui/material";
import {
  AddRounded, SearchRounded, FilterListRounded, TaskRounded,
  PersonAddRounded, CloseRounded, ArrowBackRounded,
  CheckCircleRounded, RemoveCircleRounded,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";

import DataTable  from "../components/DataTable";
import FormModal  from "../components/FormModal";
import ViewDrawer from "../components/ViewDrawer";

import { useTask, TASK_STATUSES, TASK_PRIORITIES } from "../hooks/useTask";
import { taskStyles as s }                         from "../styles/taskStyles";

// ─── Role constants ────────────────────────────────────────────────────────────
const ADMIN    = "ADMIN";
const PM       = "PROJECT_MANAGER";
const LEAD     = "TEAM_LEAD";
const EMPLOYEE = "EMPLOYEE";

export default function Task() {
  const theme  = useTheme();
  const isDark = theme.palette.mode === "dark";

  // ─── Role guards ──────────────────────────────────────────────────────────────
  const { role } = useSelector((state) => state.auth);
  const isEmployee = role === EMPLOYEE;
  const canWrite   = role === ADMIN || role === PM || role === LEAD;

  // ─── Status-only modal state (for EMPLOYEE role) ───────────────────────────
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusForm,      setStatusForm]      = useState({});

  const openStatusOnlyModal = (item) => {
    setStatusForm({
      id:          item.id,
      title:       item.title,
      description: item.description,
      status:      item.status,
    });
    setStatusModalOpen(true);
  };
  const closeStatusModal = () => setStatusModalOpen(false);

  const {
    projects, employees,
    loading, totalPages, keyword, status, page,
    setKeyword, setStatus, setPage,
    enrichedTasks, filteredMilestones, availableMembers,
    editing, form, setForm,errors,
    modalOpen, openAddModal, closeModal,
    viewOpen, selected, handleView, closeViewDrawer,
    getSelectedEmployeeLabel, getSelectedProjectName, getSelectedMilestoneName,
    assignDrawerOpen, closeAssignDrawer,
    selectedTask, assignedEmployeeIds,
    assignEmployeeId, setAssignEmployeeId,
    assignSuccess, setAssignSuccess,
    showAll, setShowAll, visibleChips, hiddenCount,
    handleSubmit, handleDelete, handleEdit,
    openAssignDrawer, handleAssign, handleUnassign,
    // updateTaskStatus should be exposed from useTask — see note below
    updateTaskStatus,
  } = useTask();

  // ─── Employee status submit ────────────────────────────────────────────────
  const handleStatusSubmit = async () => {
    if (updateTaskStatus) {
      await updateTaskStatus(statusForm.id, statusForm.status);
    }
    closeStatusModal();
  };

  const isSuccess = assignSuccess?.type === "success";

  return (
    <Box>
      {/* TOOLBAR */}
      <Box sx={s.toolbar}>
        <TextField
          size="small" placeholder="Search task..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          sx={s.searchInput}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start"><SearchRounded /></InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={s.statusFilterControl}>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            displayEmpty
            startAdornment={
              <InputAdornment position="start"><FilterListRounded /></InputAdornment>
            }
          >
            <MenuItem value="">All Status</MenuItem>
            {TASK_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* EMPLOYEE cannot add tasks */}
        {canWrite && (
          <Button startIcon={<AddRounded />} onClick={openAddModal} sx={s.addButton}>
            Add Task
          </Button>
        )}
      </Box>

      {/* TABLE */}
      <Card sx={s.tableCard}>
        <Box sx={s.tableCardHeader(isDark)}>
          <TaskRounded sx={s.taskIcon} />
          <Typography sx={s.tableCardTitle(isDark)}>Task List</Typography>
        </Box>
        <DataTable
          data={enrichedTasks}
          columns={["Title", "Project", "Milestone", "Status", "Due Date"]}
          fields={["title", "projectName", "milestoneName", "status", "dueDate"]}
          idField="id"
          loading={loading}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          handleDelete={handleDelete}
          handleView={handleView}
          // EMPLOYEE gets status-only edit; everyone else gets full edit
          handleEdit={isEmployee ? openStatusOnlyModal : handleEdit}
          // ─── Role guards ───────────────────────────────────────────────
          hideEdit={false}                 // edit button always shown — but behaviour differs
          hideDelete={!canWrite}           // EMPLOYEE cannot delete
          hideExtraActions={!canWrite}     // EMPLOYEE cannot assign
          // ──────────────────────────────────────────────────────────────
          extraActions={[
            {
              label: "Assign Employee",
              icon: <PersonAddRounded sx={{ fontSize: 16 }} />,
              color: "#0891b2",
              bg: "rgba(8,145,178,0.07)",
              onClick: (_id, item) => openAssignDrawer(item),
            },
          ]}
        />
      </Card>

      {/* VIEW DRAWER */}
      <ViewDrawer
        isOpen={viewOpen}
        onClose={closeViewDrawer}
        title="Task Details"
        status={selected?.status}
        sections={
          selected ? [
            {
              heading: "Task Info",
              fields: [
                { label: "Title",       value: selected.title },
                { label: "Description", value: selected.description },
                { label: "Status",      value: selected.status,   badge: true },
                { label: "Priority",    value: selected.priority, badge: true },
                { label: "Due Date",    value: selected.dueDate?.split("T")[0] || "—" },
              ],
            },
            {
              heading: "Project & Milestone",
              fields: [
                { label: "Project",   value: getSelectedProjectName() },
                { label: "Milestone", value: getSelectedMilestoneName() },
              ],
            },
            {
              heading: "Assigned Employees",
              fields: [{ label: "Employees", value: getSelectedEmployeeLabel() }],
            },
          ] : []
        }
      />

      {/* FULL FORM MODAL — ADMIN / PM / LEAD only */}
      {canWrite && (
        <FormModal
          isOpen={modalOpen}
          handleClose={closeModal}
          title={editing ? "Edit Task" : "Add Task"}
          subtitle={editing ? "Update task details" : "Fill in the details to create a task"}
          formData={form}
          setFormData={setForm}
          handleSubmit={handleSubmit}
          errors={errors}
          submitLabel={editing ? "Save changes" : "Add task"}
          sections={[
            {
              label: "Task info",
              fields: [
                { name: "title",       label: "Title",       type: "text" },
                { name: "description", label: "Description", type: "text", multiline: true, rows: 2 },
                {
                  name: "projectId", label: "Project", type: "select",
                  options: projects.map((p) => ({ value: Number(p.projectId), label: p.projectName })),
                },
                {
                  name: "milestoneId", label: "Milestone", type: "select",
                  options: filteredMilestones.map((m) => ({ value: Number(m.milestoneId), label: m.milestoneName })),
                },
              ],
            },
            {
              label: "Details",
              fields: [
                {
                  name: "status", label: "Status", type: "select", half: true,
                  options: [
                    { value: "PENDING",     label: "Pending" },
                    { value: "IN_PROGRESS", label: "In progress" },
                    { value: "COMPLETED",   label: "Completed" },
                  ],
                },
                {
                  name: "priority", label: "Priority", type: "select", half: true,
                  options: TASK_PRIORITIES.map((p) => ({ value: p, label: p[0] + p.slice(1).toLowerCase() })),
                },
                { name: "dueDate", label: "Due date", type: "date" },
              ],
            },
          ]}
        />
      )}

      {/* STATUS-ONLY MODAL — EMPLOYEE role only */}
      {isEmployee && (
        <FormModal
          isOpen={statusModalOpen}
          handleClose={closeStatusModal}
          title="Update Task Status"
          subtitle="You can only update the status of your task"
          formData={statusForm}
          setFormData={setStatusForm}
          handleSubmit={handleStatusSubmit}
          submitLabel="Update Status"
          sections={[
            {
              label: "Task info",
              fields: [
                { name: "title",       label: "Title",       type: "text",   disabled: true },
                { name: "description", label: "Description", type: "text",   multiline: true, rows: 2, disabled: true },
                {
                  name: "status", label: "Status", type: "select",
                  options: [
                    { value: "PENDING",     label: "Pending" },
                    { value: "IN_PROGRESS", label: "In progress" },
                    { value: "COMPLETED",   label: "Completed" },
                  ],
                },
              ],
            },
          ]}
        />
      )}

      {/* ASSIGN DRAWER — ADMIN / PM / LEAD only */}
      {canWrite && (
        <Drawer
          anchor="right"
          open={assignDrawerOpen}
          onClose={closeAssignDrawer}
          sx={{
            "& .MuiDrawer-root": { width: 420 },
            "& .MuiPaper-root": {
              width: 420, maxWidth: 420,
              backgroundColor: isDark ? "#13131f" : "#faf9ff",
              display: "flex", flexDirection: "column",
              overflow: "hidden", overflowX: "hidden",
            },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

            {/* HEADER */}
            <Box sx={s.drawerHeader}>
              <Box>
                <Typography sx={s.drawerTitle}>Assign Team</Typography>
                <Typography sx={s.drawerSubtitle}>{selectedTask?.title}</Typography>
              </Box>
              <IconButton onClick={closeAssignDrawer}><CloseRounded /></IconButton>
            </Box>

            <Divider />

            {/* SCROLLABLE BODY */}
            <Box sx={{ flex: 1, overflowY: "auto" }}>

              {/* CURRENT TEAM */}
              <Box sx={{ p: 3 }}>
                <Typography sx={s.sectionLabel}>Current Team</Typography>
                {assignedEmployeeIds.length === 0 ? (
                  <Typography sx={s.emptyText}>No employees assigned yet</Typography>
                ) : (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {visibleChips.map((empId) => {
                      const emp   = employees.find((e) => Number(e.employeeId) === empId);
                      const label = emp
                        ? `${emp.firstName} ${emp.lastName || ""}`.trim()
                        : `Employee #${empId}`;
                      return (
                        <Chip
                          key={empId}
                          label={label}
                          onDelete={() => handleUnassign(empId)}
                          sx={{
                            ...s.assignedChip,
                            maxWidth: 130,
                            "& .MuiChip-label": {
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            },
                          }}
                        />
                      );
                    })}

                    {!showAll && hiddenCount > 0 && (
                      <Chip label={`+${hiddenCount} more`} onClick={() => setShowAll(true)} sx={s.moreChip(isDark)} />
                    )}
                    {showAll && hiddenCount > 0 && (
                      <Chip label="Show less" onClick={() => setShowAll(false)} sx={s.moreChip(isDark)} />
                    )}
                  </Box>
                )}
              </Box>

              <Divider />

              {/* ADD EMPLOYEE */}
              <Box sx={{ px: 3, pt: 3, pb: 3 }}>
                <Typography sx={{ ...s.sectionLabel, mb: 1 }}>Add Employee</Typography>
                {availableMembers.length === 0 ? (
                  <Typography sx={s.emptyText}>All project members are already assigned</Typography>
                ) : (
                  <FormControl fullWidth>
                    <Select
                      value={assignEmployeeId}
                      onChange={(e) => setAssignEmployeeId(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Select Employee</MenuItem>
                      {availableMembers.map((e) => (
                        <MenuItem key={e.employeeId} value={e.employeeId}>
                          {`${e.firstName} ${e.lastName || ""}`.trim()}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>
            </Box>

            {/* BANNER */}
            <Box sx={{ ...s.banner(isSuccess, isDark), visibility: assignSuccess ? "visible" : "hidden" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {isSuccess
                  ? <CheckCircleRounded sx={s.bannerIcon(isSuccess, isDark)} />
                  : <RemoveCircleRounded sx={s.bannerIcon(isSuccess, isDark)} />
                }
                <Typography sx={s.bannerText(isSuccess, isDark)}>
                  {assignSuccess?.message}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => setAssignSuccess(null)}
                sx={{ color: s.bannerText(isSuccess, isDark).color, p: 0.5, flexShrink: 0 }}
              >
                <CloseRounded sx={{ fontSize: 15 }} />
              </IconButton>
            </Box>

            {/* FOOTER */}
            <Box sx={s.drawerFooter}>
              <Button
                fullWidth variant="contained"
                startIcon={<PersonAddRounded />}
                onClick={handleAssign}
                disabled={!assignEmployeeId}
                sx={s.assignButton}
              >
                Assign Employee
              </Button>
              <Button
                fullWidth variant="outlined"
                startIcon={<ArrowBackRounded />}
                onClick={closeAssignDrawer}
                sx={{ ...s.backButton, mt: 1.5 }}
              >
                Back
              </Button>
            </Box>

          </Box>
        </Drawer>
      )}
    </Box>
  );
}