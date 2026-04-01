import React, { useState, useEffect } from "react";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";

import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";
import BulkUpload from "../components/BulkUpload";
import ViewDrawer from "../components/ViewDrawer";

// Toast
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
});

function Project() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [projectForm, setProjectForm] = useState({
    projectId: "",
    projectName: "",
    isActive: "ACTIVE",
    employeeIds: "",
    milestones: "",
  });

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setEditingProject(null);
    setProjectForm({
      projectId: "",
      projectName: "",
      isActive: "ACTIVE",
      employeeIds: "",
      milestones: "",
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    const newProject = {
      projectId: projectForm.projectId,
      projectName: projectForm.projectName,
      isActive: projectForm.isActive,
      employeeIds: projectForm.employeeIds,
      milestones: projectForm.milestones,
    };

    setTimeout(() => {
      try {
        if (editingProject) {
          const updated = projects.map((p) =>
            p.projectId === editingProject.projectId ? newProject : p
          );
          setProjects(updated);
          Toast.fire({ icon: "success", title: "Project updated" });
        } else {
          setProjects([...projects, newProject]);
          Toast.fire({ icon: "success", title: "Project added" });
        }

        const modalEl = document.getElementById("projectModal");
        const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
        modal.hide();

        resetForm();
      } catch (err) {
        console.error(err);
        Toast.fire({ icon: "error", title: "Operation failed" });
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  /* ================= VIEW ================= */
  const handleView = (id) => {
    const proj = projects.find((p) => String(p.projectId) === String(id));
    setSelectedProject(proj);
    setViewOpen(true);
  };

  /* ================= EDIT ================= */
  const handleEdit = (proj) => {
    setEditingProject(proj);
    setProjectForm(proj);

    const modalEl = document.getElementById("projectModal");
    const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
    modal.show();
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Project?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      setLoading(true);

      setTimeout(() => {
        const filtered = projects.filter((p) => p.projectId !== id);
        setProjects(filtered);

        Toast.fire({ icon: "success", title: "Deleted successfully" });

        setLoading(false);
      }, 600);
    }
  };

  /* ================= UI ================= */
  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2 style={{ color: "white" }}>Project Management</h2>

        <div className="d-flex gap-2">
          <BulkUpload setEmployees={setProjects} />

          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#projectModal"
            onClick={resetForm}
          >
            Add Project
          </button>
        </div>
      </div>

      <DataTable
        title="Project List"
        data={projects}
        columns={["Project Name", "Employees", "Status"]}
        fields={["projectName", "employeeIds", "isActive"]}
        idField="projectId"
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleView={handleView}
        loading={loading}
      />

      {/* VIEW DRAWER */}
      <ViewDrawer
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Project Details"
        icon="bi-kanban"
        sections={
          selectedProject
            ? [
                {
                  heading: "Project Info",
                  fields: [
                    { label: "Project ID", value: selectedProject.projectId },
                    { label: "Name", value: selectedProject.projectName },
                    {
                      label: "Employees",
                      value: selectedProject.employeeIds,
                    },
                    { label: "Status", value: selectedProject.isActive },
                  ],
                },
                {
                  heading: "Milestones",
                  fields: [
                    {
                      label: "Milestones",
                      value: selectedProject.milestones,
                    },
                  ],
                },
              ]
            : []
        }
      />

      {/* FORM MODAL */}
      <FormModal
  modalId="projectModal"
  title={editingProject ? "Edit Project" : "Add Project"}
  formData={projectForm}
  setFormData={setProjectForm}
  handleSubmit={handleSubmit}
  fields={[
    { name: "projectId", type: "text", placeholder: "Project ID" },
    { name: "projectName", type: "text", placeholder: "Project Name" },

    {
      name: "status",
      type: "select",
      options: ["ACTIVE", "INACTIVE"],
    },

    {
      name: "employeeIds",
      type: "text",
      placeholder: "Employee IDs",
    },

    {
      name: "milestones",
      type: "text",
      placeholder: "Milestones ",
      fullWidth: true, 
    },
  ]}
/>
    </div>
  );
}

export default Project;