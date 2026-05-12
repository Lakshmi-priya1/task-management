// pages/Task.jsx
import { useState, useEffect } from "react";
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

import DataTable  from "../components/DataTable";
import FormModal  from "../components/FormModal";
import ViewDrawer from "../components/ViewDrawer";

import { useTask, TASK_STATUSES, TASK_PRIORITIES } from "../hooks/useTask";
import { taskStyles as s } from "../styles/taskStyles";

const MAX_VISIBLE_CHIPS = 4;

export default function Task() {
  const theme  = useTheme();
  const isDark = theme.palette.mode === "dark";

  const {
    // redux state
    projects, employees,
    loading, totalPages, keyword, status, page,
    // dispatch helpers
    setKeyword, setStatus, setPage,
    // derived
    enrichedTasks, filteredMilestones, availableMembers,
    // form state
    editing, form, setForm,
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
    // handlers
    handleSubmit, handleDelete, handleEdit,
    openAssignDrawer, handleAssign, handleUnassign,
  } = useTask();

  // ── Show all chips toggle ─────────────────────────────
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!assignDrawerOpen) setShowAll(false);
  }, [assignDrawerOpen]);

  const visibleChips = showAll
    ? assignedEmployeeIds
    : assignedEmployeeIds.slice(0, MAX_VISIBLE_CHIPS);
  const hiddenCount = assignedEmployeeIds.length - MAX_VISIBLE_CHIPS;

  const moreChipSx = {
    backgroundColor: isDark ? "rgba(99,102,241,0.15)" : "#ede9fe",
    color: "#6366f1",
    fontWeight: 700,
    fontSize: 12,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: isDark ? "rgba(99,102,241,0.25)" : "#ddd6fe",
    },
  };

  // ── Banner colour tokens derived from assignSuccess.type ──
  const isSuccessBanner = assignSuccess?.type === "success";
  const bannerColors = {
    bg:     isSuccessBanner
      ? isDark ? "rgba(34,197,94,0.12)"  : "#f0fdf4"
      : isDark ? "rgba(239,68,68,0.12)"  : "#fef2f2",
    border: isSuccessBanner
      ? isDark ? "rgba(34,197,94,0.30)"  : "#bbf7d0"
      : isDark ? "rgba(239,68,68,0.30)"  : "#fecaca",
    dot:    isSuccessBanner ? "#22c55e" : "#ef4444",
    text:   isSuccessBanner
      ? isDark ? "#86efac" : "#16a34a"
      : isDark ? "#fca5a5" : "#dc2626",
  };

  return (
    <Box>
      {/* SEARCH + FILTER + ADD */}
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

        <Button startIcon={<AddRounded />} onClick={openAddModal} sx={s.addButton}>
          Add Task
        </Button>
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
          handleEdit={handleEdit}
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

      {/* FORM MODAL */}
      <FormModal
        isOpen={modalOpen}
        handleClose={closeModal}
        title={editing ? "Edit Task" : "Add Task"}
        subtitle={editing ? "Update task details" : "Fill in the details to create a task"}
        formData={form}
        setFormData={setForm}
        handleSubmit={handleSubmit}
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

      {/* ASSIGN DRAWER */}
      <Drawer
        anchor="right"
        open={assignDrawerOpen}
        onClose={closeAssignDrawer}
        sx={{
          "& .MuiDrawer-root": { width: 420 },
          "& .MuiPaper-root": {
            width: 420,
            maxWidth: 420,
            backgroundColor: isDark ? "#13131f" : "#faf9ff",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            overflowX: "hidden",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

          {/* HEADER — pinned */}
          <Box sx={s.drawerHeader}>
            <Box>
              <Typography sx={s.drawerTitle}>Assign Team</Typography>
              <Typography sx={s.drawerSubtitle}>{selectedTask?.title}</Typography>
            </Box>
            <IconButton onClick={closeAssignDrawer}><CloseRounded /></IconButton>
          </Box>

          <Divider />

          {/* SCROLLABLE MIDDLE */}
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

                  {/* +N more → expand */}
                  {!showAll && hiddenCount > 0 && (
                    <Chip
                      label={`+${hiddenCount} more`}
                      onClick={() => setShowAll(true)}
                      sx={moreChipSx}
                    />
                  )}

                  {/* Show less → collapse */}
                  {showAll && hiddenCount > 0 && (
                    <Chip
                      label="Show less"
                      onClick={() => setShowAll(false)}
                      sx={moreChipSx}
                    />
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

          {/* ── INLINE BANNER — green for assign, red for remove ── */}
          <Box
            sx={{
              mx: 2,
              mb: 1.5,
              px: 2,
              py: 1,
              minHeight: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 2,
              // keep space reserved so layout never jumps
              visibility: assignSuccess ? "visible" : "hidden",
              backgroundColor: bannerColors.bg,
              border: `1px solid ${bannerColors.border}`,
              transition: "background-color 0.25s ease, border-color 0.25s ease",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              
              {/* icon */}
              {isSuccessBanner
                ? <CheckCircleRounded sx={{ fontSize: 16, color: bannerColors.text }} />
                : <RemoveCircleRounded sx={{ fontSize: 16, color: bannerColors.text }} />
              }
              {/* message */}
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: bannerColors.text,
                  lineHeight: 1.3,
                }}
              >
                {assignSuccess?.message}
              </Typography>
            </Box>

            {/* dismiss */}
            <IconButton
              size="small"
              onClick={() => setAssignSuccess(null)}
              sx={{ color: bannerColors.text, p: 0.5, flexShrink: 0 }}
            >
              <CloseRounded sx={{ fontSize: 15 }} />
            </IconButton>
          </Box>

          {/* FOOTER — pinned */}
          <Box sx={s.drawerFooter}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<PersonAddRounded />}
              onClick={handleAssign}
              disabled={!assignEmployeeId}
              sx={s.assignButton}
            >
              Assign Employee
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ArrowBackRounded />}
              onClick={closeAssignDrawer}
              sx={{ ...s.backButton, mt: 1.5 }}
            >
              Back
            </Button>
          </Box>

        </Box>
      </Drawer>
    </Box>
  );
}