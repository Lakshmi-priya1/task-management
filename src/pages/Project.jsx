import {
  Box, Button, Typography, TextField,
  InputAdornment, Select, MenuItem, FormControl, Card,
  Chip, Drawer, IconButton, Divider,
} from "@mui/material";
import {
  AddRounded, SearchRounded, FilterListRounded, FolderRounded,
  PersonAddRounded, CloseRounded, ArrowBackRounded,
  CheckCircleRounded, RemoveCircleRounded,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";

import DataTable  from "../components/DataTable";
import FormModal  from "../components/FormModal";
import ViewDrawer from "../components/ViewDrawer";

import useProject, { PROJECT_STATUSES } from "../hooks/useProject";
import { getProjectStyles }             from "../styles/projectStyles";

// ─── Role constants ────────────────────────────────────────────────────────────
const ADMIN = "ADMIN";
const PM    = "PROJECT_MANAGER";
// TEAM_LEAD and EMPLOYEE are view-only for projects

export default function Project() {
  const theme  = useTheme();
  const isDark = theme.palette.mode === "dark";
  const sx     = getProjectStyles(isDark);

  // ─── Role guards ──────────────────────────────────────────────────────────────
  const { role } = useSelector((state) => state.auth);
  const canWrite  = role === ADMIN || role === PM;   // can add / edit / assign
  const canDelete = role === ADMIN;                  // only admin can delete

  const {
    projects, employees, loading, totalPages, keyword, status, page,
    setKeyword, setStatus, setPage,
    editing, form, setForm,
    modalOpen, openAddModal, handleCloseModal,
    viewOpen, selected, handleView, handleCloseView,
    assignOpen, assignProject,
    assignedEmployeeIds, selectEmployeeId, setSelectEmployeeId,
    assignSuccess, setAssignSuccess,
    availableEmployees,errors,
    showAll, setShowAll, visibleChips, hiddenCount,
    handleSubmit, handleDelete, handleEdit,
    openAssign, handleAssign, handleRemove, handleCloseAssign,
  } = useProject();

  const isSuccess = assignSuccess?.type === "success";

  return (
    <Box>
      {/* TOOLBAR */}
      <Box sx={sx.toolbarSx}>
        <TextField
          size="small" placeholder="Search project..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          sx={sx.inputSx}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start"><SearchRounded /></InputAdornment>
              ),
            },
          }}
        />
        <FormControl size="small" sx={sx.filterSx}>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            displayEmpty
            renderValue={(val) => (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FilterListRounded sx={{ fontSize: 18, color: "#94a3b8" }} />
                {val || "All Status"}
              </Box>
            )}
          >
            <MenuItem value="">All Status</MenuItem>
            {PROJECT_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Only ADMIN and PM can add projects */}
        {canWrite && (
          <Button startIcon={<AddRounded />} onClick={openAddModal} sx={sx.addButtonSx}>
            Add Project
          </Button>
        )}
      </Box>

      {/* TABLE */}
      <Card sx={sx.cardSx}>
        <Box sx={sx.cardHeaderSx}>
          <FolderRounded sx={{ color: "#6366f1" }} />
          <Typography sx={sx.cardTitleSx}>Project List</Typography>
        </Box>
        <DataTable
          data={projects}
          columns={["Project Name", "Status", "Start Date", "End Date"]}
          fields={["projectName", "status", "startDate", "endDate"]}
          idField="projectId"
          loading={loading}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          handleDelete={handleDelete}
          handleView={handleView}
          handleEdit={handleEdit}
          // ─── Role guards ───────────────────────────────────────────────
          hideEdit={!canWrite}           // TEAM_LEAD + EMPLOYEE see no edit
          hideDelete={!canDelete}        // only ADMIN sees delete
          hideExtraActions={!canWrite}   // only ADMIN + PM see Assign Team
          // ──────────────────────────────────────────────────────────────
          extraActions={[
            {
              label: "Assign Team",
              icon: <PersonAddRounded sx={{ fontSize: 16 }} />,
              color: "#0891b2",
              bg: "rgba(8,145,178,0.07)",
              onClick: (id, row) => openAssign(row),
            },
          ]}
        />
      </Card>

      {/* VIEW DRAWER */}
      <ViewDrawer
        isOpen={viewOpen}
        onClose={handleCloseView}
        title="Project Details"
        status={selected?.status}
        sections={
          selected ? [
            {
              heading: "Basic Info",
              fields: [
                { label: "Project ID",   value: selected.projectId,                       badge: true },
                { label: "Project Name", value: selected.projectName },
                { label: "Description",  value: selected.description || "—" },
                { label: "Status",       value: selected.status,                          badge: true },
                { label: "Start Date",   value: selected.startDate?.split("T")[0] || "—" },
                { label: "End Date",     value: selected.endDate?.split("T")[0]   || "—" },
              ],
            },
            {
              heading: "Assigned Employees",
              fields: selected.employeeIds?.length > 0
                ? selected.employeeIds.map((id, i) => ({
                    label: selected.employeeFirstNames?.[i] || `Employee ${i + 1}`,
                    value: `Employee ID : ${id}`, badge: true,
                  }))
                : [{ label: "No Employees Assigned", value: "—" }],
            },
            {
              heading: "Tasks",
              fields: selected.taskIds?.length > 0
                ? selected.taskIds.map((id, i) => ({
                    label: selected.taskTitles?.[i] || `Task ${i + 1}`,
                    value: `Task ID : ${id}`, badge: true,
                  }))
                : [{ label: "No Tasks Available", value: "—" }],
            },
            {
              heading: "Milestones",
              fields: selected.milestoneIds?.length > 0
                ? selected.milestoneIds.map((id, i) => ({
                    label: selected.milestoneNames?.[i] || `Milestone ${i + 1}`,
                    value: `Milestone ID : ${id}`, badge: true,
                  }))
                : [{ label: "No Milestones", value: "—" }],
            },
          ] : []
        }
      />

      {/* FORM MODAL — only rendered/accessible for ADMIN + PM */}
      {canWrite && (
        <FormModal
          isOpen={modalOpen}
          handleClose={handleCloseModal}
          title={editing ? "Edit Project" : "Add Project"}
          subtitle={editing ? "Update project details" : "Fill in the details to create a project"}
          formData={form}
          setFormData={setForm}
          handleSubmit={handleSubmit}
          errors={errors}
          submitLabel={editing ? "Save changes" : "Add project"}
          sections={[
            {
              label: "Project info",
              fields: [
                { name: "projectName", label: "Project name", type: "text" },
                { name: "description", label: "Description",  type: "text", multiline: true, rows: 2 },
                { name: "status",      label: "Status",       type: "select", options: PROJECT_STATUSES },
                { name: "startDate",   label: "Start date",   type: "date", half: true },
                { name: "endDate",     label: "End date",     type: "date", half: true },
              ],
            },
          ]}
        />
      )}

      {/* ASSIGN DRAWER — only rendered/accessible for ADMIN + PM */}
      {canWrite && (
        <Drawer
          anchor="right"
          open={assignOpen}
          onClose={handleCloseAssign}
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
            <Box sx={sx.drawerHeaderSx}>
              <Box>
                <Typography sx={sx.drawerTitleSx}>Assign Team</Typography>
                <Typography sx={sx.drawerSubtitleSx}>{assignProject?.projectName}</Typography>
              </Box>
              <IconButton onClick={handleCloseAssign}><CloseRounded /></IconButton>
            </Box>

            <Divider />

            {/* SCROLLABLE BODY */}
            <Box sx={{ flex: 1, overflowY: "auto" }}>

              {/* CURRENT TEAM */}
              <Box sx={{ p: 3 }}>
                <Typography sx={sx.sectionLabelSx}>Current Team</Typography>
                {assignedEmployeeIds.length === 0 ? (
                  <Typography sx={sx.emptyTextSx}>No employees assigned yet</Typography>
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
                          onDelete={() => handleRemove(empId)}
                          sx={{
                            ...sx.chipSx,
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
                      <Chip label={`+${hiddenCount} more`} onClick={() => setShowAll(true)} sx={sx.moreChipSx(isDark)} />
                    )}
                    {showAll && hiddenCount > 0 && (
                      <Chip label="Show less" onClick={() => setShowAll(false)} sx={sx.moreChipSx(isDark)} />
                    )}
                  </Box>
                )}
              </Box>

              <Divider />

              {/* ADD EMPLOYEE */}
              <Box sx={{ px: 3, pt: 3, pb: 3 }}>
                <Typography sx={{ ...sx.sectionLabelSx, mb: 1 }}>Add Employee</Typography>
                {availableEmployees.length === 0 ? (
                  <Typography sx={sx.emptyTextSx}>All employees are already assigned</Typography>
                ) : (
                  <FormControl fullWidth>
                    <Select
                      value={selectEmployeeId}
                      onChange={(e) => setSelectEmployeeId(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Select Employee</MenuItem>
                      {availableEmployees.map((e) => (
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
            <Box sx={{ ...sx.banner(isSuccess, isDark), visibility: assignSuccess ? "visible" : "hidden" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {isSuccess
                  ? <CheckCircleRounded sx={sx.bannerIcon(isSuccess, isDark)} />
                  : <RemoveCircleRounded sx={sx.bannerIcon(isSuccess, isDark)} />
                }
                <Typography sx={sx.bannerText(isSuccess, isDark)}>
                  {assignSuccess?.message}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => setAssignSuccess(null)}
                sx={{ color: sx.bannerText(isSuccess, isDark).color, p: 0.5, flexShrink: 0 }}
              >
                <CloseRounded sx={{ fontSize: 15 }} />
              </IconButton>
            </Box>

            {/* FOOTER */}
            <Box sx={sx.drawerFooterSx}>
              <Button
                fullWidth variant="contained"
                startIcon={<PersonAddRounded />}
                onClick={handleAssign}
                disabled={!selectEmployeeId}
                sx={sx.assignButtonSx}
              >
                Assign Employee
              </Button>
              <Button
                fullWidth variant="outlined"
                startIcon={<ArrowBackRounded />}
                onClick={handleCloseAssign}
                sx={{ ...sx.backButtonSx, mt: 1.5 }}
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