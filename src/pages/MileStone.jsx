// pages/Milestone.jsx
import { useState, useEffect } from "react";
import {
  Box, Button, Typography, TextField,
  InputAdornment, Select, MenuItem, FormControl, Card,
  Chip, Drawer, IconButton, Divider,
} from "@mui/material";
import {
  AddRounded, SearchRounded, FlagRounded, FilterListRounded,
  PersonAddRounded, CloseRounded, ArrowBackRounded,
  CheckCircleRounded, RemoveCircleRounded,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

import DataTable  from "../components/DataTable";
import FormModal  from "../components/FormModal";
import ViewDrawer from "../components/ViewDrawer";

import { useMilestone, MILESTONE_STATUSES } from "../hooks/useMilestone";
import { milestoneStyles as s } from "../styles/milestoneStyles";

const MAX_VISIBLE_CHIPS = 4;

export default function Milestone() {
  const theme  = useTheme();
  const isDark = theme.palette.mode === "dark";

  const {
    // redux state
    milestones, projects, employees, tasks, selected,
    loading, totalPages, keyword, projectFilter, page,
    // dispatch helpers
    setKeyword, setProjectFilter, setPage,
    // form state
    editing, form, setForm,
    // modal state
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
    // handlers
    handleSubmit, handleDelete, handleEdit,
    openAssignDrawer, handleAssign, handleUnassign,
  } = useMilestone();

  // ── Show all chips toggle ────────────────────────────
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

  // ── Banner colour tokens ─────────────────────────────
  const isSuccessBanner = assignSuccess?.type === "success";
  const bannerColors = {
    bg:     isSuccessBanner
      ? isDark ? "rgba(34,197,94,0.12)"  : "#f0fdf4"
      : isDark ? "rgba(239,68,68,0.12)"  : "#fef2f2",
    border: isSuccessBanner
      ? isDark ? "rgba(34,197,94,0.30)"  : "#bbf7d0"
      : isDark ? "rgba(239,68,68,0.30)"  : "#fecaca",
    text:   isSuccessBanner
      ? isDark ? "#86efac" : "#16a34a"
      : isDark ? "#fca5a5" : "#dc2626",
  };

  return (
    <Box>
      {/* SEARCH + FILTER + ADD */}
      <Box sx={s.toolbar}>
        <TextField
          size="small" placeholder="Search milestone..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          sx={s.searchInput}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start"><SearchRounded /></InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={s.projectFilterControl}>
          <Select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            displayEmpty
            startAdornment={
              <InputAdornment position="start"><FilterListRounded /></InputAdornment>
            }
          >
            <MenuItem value="">All Projects</MenuItem>
            {projects.map((p) => (
              <MenuItem key={p.projectId} value={p.projectId}>{p.projectName}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button startIcon={<AddRounded />} onClick={openAddModal} sx={s.addButton}>
          Add Milestone
        </Button>
      </Box>

      {/* TABLE */}
      <Card sx={s.tableCard}>
        <Box sx={s.tableCardHeader(isDark)}>
          <FlagRounded sx={s.flagIcon} />
          <Typography sx={s.tableCardTitle(isDark)}>Milestone List</Typography>
        </Box>
        <DataTable
          data={milestones}
          columns={["Name", "Project", "Status", "Due Date"]}
          fields={["milestoneName", "projectName", "status", "dueDate"]}
          idField="milestoneId"
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
              onClick: (_id, row) => openAssignDrawer(row),
            },
          ]}
        />
      </Card>

      {/* VIEW DRAWER */}
      <ViewDrawer
        isOpen={viewOpen}
        onClose={closeViewDrawer}
        title="Milestone Details"
        status={selected?.status}
        sections={
          selected ? [
            {
              heading: "Info",
              fields: [
                { label: "Name",        value: selected.milestoneName },
                { label: "Description", value: selected.description },
                { label: "Status",      value: selected.status, badge: true },
                { label: "Due Date",    value: selected.dueDate?.split("T")[0] || "—" },
                {
                  label: "Project",
                  value: projects.find(
                    (p) => Number(p.projectId) === Number(selected.projectId)
                  )?.projectName || "—",
                },
              ],
            },
            {
              heading: "Assigned Employees",
              fields: selected.employeeIds?.length
                ? selected.employeeIds.map((id, i) => ({
                    label: selected.employeeNames?.[i] || `Employee #${id}`,
                    value: "Assigned",
                    badge: true,
                  }))
                : [{ label: "No employees assigned", value: "—" }],
            },
            {
              heading: "Tasks",
              fields: tasks.filter(
                (t) => Number(t.milestoneId) === Number(selected.milestoneId)
              ).length
                ? tasks
                    .filter((t) => Number(t.milestoneId) === Number(selected.milestoneId))
                    .map((t) => ({ label: t.title, value: t.status, badge: true }))
                : [{ label: "No tasks yet", value: "—" }],
            },
          ] : []
        }
      />

      {/* FORM MODAL */}
      <FormModal
        isOpen={modalOpen}
        handleClose={closeModal}
        title={editing ? "Edit Milestone" : "Add Milestone"}
        subtitle={editing ? "Update milestone details" : "Fill in the details to add a milestone"}
        formData={form}
        setFormData={setForm}
        handleSubmit={handleSubmit}
        submitLabel={editing ? "Save changes" : "Add milestone"}
        sections={[
          {
            label: "Milestone info",
            fields: [
              { name: "milestoneName", label: "Milestone name", type: "text" },
              { name: "description",   label: "Description",    type: "text", multiline: true, rows: 2 },
              {
                name: "projectId", label: "Project", type: "select", half: true,
                options: projects.map((p) => ({ value: Number(p.projectId), label: p.projectName })),
              },
              {
                name: "status", label: "Status", type: "select", half: true,
                options: MILESTONE_STATUSES,
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
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

          {/* HEADER — pinned */}
          <Box sx={s.drawerHeader}>
            <Box>
              <Typography sx={s.drawerTitle}>Assign Team</Typography>
              <Typography sx={s.drawerSubtitle}>{selectedMilestone?.milestoneName}</Typography>
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
                    value={selectEmployeeId}
                    onChange={(e) => setSelectEmployeeId(e.target.value)}
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
              visibility: assignSuccess ? "visible" : "hidden",
              backgroundColor: bannerColors.bg,
              border: `1px solid ${bannerColors.border}`,
              transition: "background-color 0.25s ease, border-color 0.25s ease",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {isSuccessBanner
                ? <CheckCircleRounded sx={{ fontSize: 16, color: bannerColors.text }} />
                : <RemoveCircleRounded sx={{ fontSize: 16, color: bannerColors.text }} />
              }
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: bannerColors.text, lineHeight: 1.3 }}>
                {assignSuccess?.message}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => setAssignSuccess(null)}
              sx={{ color: bannerColors.text, p: 0.5, flexShrink: 0 }}
            >
              <CloseRounded sx={{ fontSize: 15 }} />
            </IconButton>
          </Box>

          {/* FOOTER — pinned */}
          <Box sx={s.drawerButtons}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<PersonAddRounded />}
                onClick={handleAssign}
                disabled={!selectEmployeeId}
                sx={s.assignButton}
              >
                Assign Employee
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ArrowBackRounded />}
                onClick={closeAssignDrawer}
                sx={s.closeButton}
              >
                Back
              </Button>
            </Box>
          </Box>

        </Box>
      </Drawer>
    </Box>
  );
}