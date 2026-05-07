import { useState, useEffect, useCallback } from "react";
import {
  Box, Button, Typography, TextField,
  InputAdornment, Card, FormControl, Select, MenuItem, IconButton, Tooltip,
} from "@mui/material";
import { AddRounded, SearchRounded, FlagRounded, FilterListRounded } from "@mui/icons-material";
import Swal from "sweetalert2";

import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";
import ViewDrawer from "../components/ViewDrawer";

import { getMilestones, getMilestoneById, addMilestone, updateMilestone, deleteMilestone } from "../services/mileStoneService";
import { getProjects } from "../services/projectService";
import { getTasks } from "../services/taskService";

const Toast = Swal.mixin({
  toast: true, position: "top-end", showConfirmButton: false, timer: 2500,
});

const MILESTONE_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED"];

const emptyForm = { milestoneName: "", description: "", status: "PENDING", dueDate: "", projectId: "" };

export default function Milestone() {
  const [milestones, setMilestones] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const reset = useCallback(() => { setEditing(null); setForm(emptyForm); }, []);

  const loadProjects = useCallback(async () => {
    const res = await getProjects({ page: 0, size: 100 });
    setProjects(res?.content || []);
  }, []);

  const loadTasks = useCallback(async () => {
    const res = await getTasks({ page: 0, size: 100 });
    setTasks(res?.content || []);
  }, []);

  const loadMilestones = useCallback(async () => {
    const res = await getMilestones({ keyword: search, projectId: projectFilter || null, page, size: 5 });
    setMilestones(res?.content || []);
    setTotalPages(res?.totalPages || 1);
  }, [search, projectFilter, page]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadProjects(); loadTasks(); }, [loadProjects, loadTasks]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadMilestones(); }, [loadMilestones]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.projectId) {
      Toast.fire({ icon: "error", title: "Project is required" }); return;
    }
    const payload = {
      ...form,
      projectId: Number(form.projectId),
      dueDate: form.dueDate ? (form.dueDate.includes("T") ? form.dueDate : `${form.dueDate}T00:00:00`) : null,
    };
    try {
      if (editing) {
        await updateMilestone(editing.milestoneId, payload);
        Toast.fire({ icon: "success", title: "Updated" });
      } else {
        await addMilestone(payload);
        Toast.fire({ icon: "success", title: "Added" });
      }
      setModalOpen(false); reset(); loadMilestones();
    } catch { Toast.fire({ icon: "error", title: "Operation failed" }); }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({ title: "Delete Milestone?", icon: "warning", showCancelButton: true });
    if (res.isConfirmed) {
      await deleteMilestone(id);
      Toast.fire({ icon: "success", title: "Deleted" });
      loadMilestones();
    }
  };

  const handleView = async (id) => {
    const fresh = await getMilestoneById(id);
    setSelected(fresh); setViewOpen(true);
  };

  return (
    <Box>
      {/* SEARCH + FILTER + ADD */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2, alignItems: "center" }}>
        <TextField size="small" placeholder="Search milestone..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 240, "& .MuiOutlinedInput-root": { borderRadius: "16px", background: "rgba(255,255,255,.65)" } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchRounded /></InputAdornment> }} />
        <FormControl size="small" sx={{ minWidth: 180, "& .MuiOutlinedInput-root": { borderRadius: "16px", background: "rgba(255,255,255,.65)" } }}>
          <Select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} displayEmpty>
            <MenuItem value="">All Projects</MenuItem>
            {projects.map((p) => <MenuItem key={p.projectId} value={p.projectId}>{p.projectName}</MenuItem>)}
          </Select>
        </FormControl>
        <Button
          startIcon={<AddRounded />}
          onClick={() => { reset(); setModalOpen(true); }}
          sx={{ ml: "auto", px: 2.5, py: 1, borderRadius: "14px", fontWeight: 700, background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "#fff", textTransform: "none", "&:hover": { opacity: 0.88 } }}
        >
          Add Milestone
        </Button>
      </Box>

      {/* TABLE */}
      <Card sx={{ borderRadius: "24px", overflow: "hidden", background: "rgba(255,255,255,.70)", backdropFilter: "blur(16px)", boxShadow: "0 12px 30px rgba(0,0,0,.05)" }}>
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid rgba(0,0,0,.06)", display: "flex", alignItems: "center", gap: 1 }}>
          <FlagRounded sx={{ color: "#6366f1" }} />
          <Typography sx={{ fontWeight: 800, color: "#312e81" }}>Milestone List</Typography>
        </Box>
        <DataTable
          data={milestones}
          columns={["Name", "Project", "Status", "Due Date"]}
          fields={["milestoneName", "projectName", "status", "dueDate"]}
          idField="milestoneId"
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          handleDelete={handleDelete}
          handleView={handleView}
          handleEdit={(row) => {
            setEditing(row);
            setForm({
              milestoneName: row.milestoneName || "",
              description: row.description || "",
              status: row.status || "PENDING",
              dueDate: row.dueDate?.split("T")[0] || "",
              projectName: projects.find((p) => Number(p.projectId) === Number(row.projectId))?.projectName || "",
            });
            setModalOpen(true);
          }}
        />
      </Card>

      {/* VIEW DRAWER */}
      <ViewDrawer
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Milestone Details"
        status={selected?.status}
        sections={
          selected ? [
            {
              heading: "Info",
              fields: [
                { label: "Name", value: selected.milestoneName },
                { label: "Description", value: selected.description },
                { label: "Status", value: selected.status, badge: true },
                { label: "Due Date", value: selected.dueDate?.split("T")[0] || "—" },
                {
                  label: "Project",
                  value: projects.find((p) => Number(p.projectId) === Number(selected.projectId))?.projectName || "—",
                },
              ],
            },
            {
              heading: "Tasks",
              fields: tasks.filter((t) => Number(t.milestoneId) === Number(selected.milestoneId)).length
                ? tasks.filter((t) => Number(t.milestoneId) === Number(selected.milestoneId))
                    .map((t) => ({ label: t.title, value: t.status, badge: true }))
                : [{ label: "No tasks yet", value: "—" }],
            },
          ] : []
        }
      />

      {/* FORM MODAL */}
      <FormModal
        isOpen={modalOpen}
        handleClose={() => { setModalOpen(false); reset(); }}
        title={editing ? "Edit Milestone" : "Add Milestone"}
        formData={form}
        setFormData={setForm}
        handleSubmit={handleSubmit}
        tabs={[
          {
            key: "basic", label: "Basic Info",
            fields: [
              { name: "milestoneName", type: "text" },
              { name: "description", type: "text" },
              {
                name: "projectId", label: "Project", type: "select",
                options: projects.map((p) => ({ value: Number(p.projectId), label: p.projectName })),
              },
              { name: "status", type: "select", options: MILESTONE_STATUSES },
              { name: "dueDate", type: "date" },
            ],
          },
        ]}
      />
    </Box>
  );
}
