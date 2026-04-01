import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";

import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";
import BulkUpload from "../components/BulkUpload";
import ViewDrawer from "../components/ViewDrawer"; // ✅ ADDED

import {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
  getTasksByStatus,
} from "../services/taskService";

// TOAST
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
});

function Users() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 DRAWER STATE
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    status: "PENDING",
    dueDate: "",
    projectId: "",
    milestoneId: "",
    remarks: "",
    assignedTo: "",
  });

  const [activeFilter, setActiveFilter] = useState("");

  /* ================= CLEANUP MODAL ================= */
  const cleanupModal = () => {
    document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "0";
    document.documentElement.style.overflow = "auto";
  };

  useEffect(() => {
    return () => cleanupModal();
  }, []);

  /* ================= FETCH ================= */
  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await getAllTasks();
      setTasks(res?.data || []);
    } catch {
      setTasks([]);
      Toast.fire({ icon: "error", title: "Failed to load tasks" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  /* ================= FILTER ================= */
  const handleFilter = async (status) => {
    try {
      setLoading(true);
      setActiveFilter(status);

      if (!status) {
        const res = await getAllTasks();
        setTasks(res?.data || []);
      } else {
        const res = await getTasksByStatus(status);
        setTasks(res?.data || []);
      }
    } catch {
      Toast.fire({ icon: "error", title: "Filter failed" });
    } finally {
      setLoading(false);
    }
  };

  /* ================= VIEW (UPDATED) ================= */
  const handleView = (id) => {
    const task = tasks.find((t) => String(t.id) === String(id));

    if (!task) {
      return Toast.fire({
        icon: "error",
        title: "Task not found",
      });
    }

    setSelectedTask(task);
    setViewOpen(true);
  };

  /* ================= EDIT ================= */
  const handleEdit = (task) => {
    setEditingTask(task);

    setTaskForm({
      ...task,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      assignedTo:
        task.assignedTo?.id ||
        task.assignedTo?.employeeId ||
        task.assignedTo ||
        "",
    });

    const modalEl = document.getElementById("taskModal");
    const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
    modal.show();
  };

  /* ================= SUBMIT ================= */
  const handleSubmitTask = async (e) => {
    e.preventDefault();

    if (!taskForm.title || !taskForm.description) {
      return Toast.fire({
        icon: "warning",
        title: "Fill required fields",
      });
    }

    try {
      const payload = {
        ...taskForm,
        dueDate: taskForm.dueDate
          ? `${taskForm.dueDate}T00:00:00`
          : null,
      };

      if (editingTask) {
        await updateTask(editingTask.id, payload);

        setTasks((prev) =>
          prev.map((t) =>
            t.id === editingTask.id ? { ...t, ...payload } : t
          )
        );

        Toast.fire({
          icon: "success",
          title: "Task updated successfully",
        });
      } else {
        const newTask = await addTask(payload);
        const taskObj = newTask?.data || newTask;

        setTasks((prev) => [taskObj, ...prev]);

        Toast.fire({
          icon: "success",
          title: "Task added successfully",
        });
      }

      const modalEl = document.getElementById("taskModal");
      const modalInstance =
        Modal.getInstance(modalEl) || new Modal(modalEl);

      modalEl.addEventListener(
        "hidden.bs.modal",
        () => {
          cleanupModal();
          setEditingTask(null);
          setTaskForm({
            title: "",
            description: "",
            status: "PENDING",
            dueDate: "",
            projectId: "",
            milestoneId: "",
            remarks: "",
            assignedTo: "",
          });
        },
        { once: true }
      );

      modalInstance.hide();
      setTimeout(() => cleanupModal(), 300);
    } catch (err) {
      console.error(err);
      Toast.fire({ icon: "error", title: "Failed to save task" });
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Task?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      try {
        await deleteTask(id);
        setTasks((prev) => prev.filter((t) => t.id !== id));

        Toast.fire({
          icon: "success",
          title: "Task deleted successfully",
        });
      } catch {
        Toast.fire({
          icon: "error",
          title: "Delete failed",
        });
      }
    }
  };

  /* ================= UI ================= */
  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2 style={{ color: "white" }}>Task Management</h2>

        <div className="d-flex gap-2">
          <BulkUpload setTasks={setTasks} />

          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#taskModal"
            onClick={() => {
              setEditingTask(null);
              setTaskForm({
                title: "",
                description: "",
                status: "PENDING",
                dueDate: "",
                projectId: "",
                milestoneId: "",
                remarks: "",
                assignedTo: "",
              });
            }}
          >
            Add Task
          </button>
        </div>
      </div>

      {/* FILTER */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["", "PENDING", "IN_PROGRESS", "COMPLETED"].map((s) => (
          <button
            key={s}
            onClick={() => handleFilter(s)}
            className={`filter-btn ${activeFilter === s ? "active" : ""}`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      <DataTable
        title="Task List"
        data={tasks}
        columns={["Title", "Status", "Due Date"]}
        fields={["title", "status", "dueDate"]}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleView={handleView}
        loading={loading}
      />

      {/* 🔥 VIEW DRAWER */}
      <ViewDrawer
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Task Details"
        icon="bi-list-check"
      
        sections={
          selectedTask
            ? [
                {
                  heading: "Task Info",
                  fields: [
                    { label: "Title", value: selectedTask.title },
                    { label: "Description", value: selectedTask.description },
                    {
                      label: "Status",
                      value: selectedTask.status,
                      badge: true,
                    },
                    {
                      label: "Due Date",
                      value: selectedTask.dueDate
                        ? new Date(
                            selectedTask.dueDate
                          ).toLocaleDateString()
                        : "N/A",
                    },
                  ],
                },
                {
                  heading: "Assignment Info",
                  fields: [
                    {
                      label: "Assigned To",
                      value:
                        selectedTask.assignedTo?.employeeId ||
                        selectedTask.assignedTo ||
                        "N/A",
                    },
                    { label: "Project ID", value: selectedTask.projectId },
                    { label: "Milestone ID", value: selectedTask.milestoneId },
                    { label: "Remarks", value: selectedTask.remarks },
                  ],
                },
              ]
            : []
        }
      />

      {/* FORM MODAL */}
      <FormModal
        modalId="taskModal"
        title={editingTask ? "Edit Task" : "Add Task"}
        formData={taskForm}
        setFormData={setTaskForm}
        handleSubmit={handleSubmitTask}
        fields={[
          { name: "title", type: "text", placeholder: "Title" },
          { name: "description", type: "text", placeholder: "Description" },
          {
            name: "status",
            type: "select",
            options: ["PENDING", "IN_PROGRESS", "COMPLETED"],
          },
          { name: "dueDate", type: "date" },
          { name: "assignedTo", type: "text", placeholder: "Employee ID" },
          { name: "projectId", type: "text", placeholder: "Project ID" },
          { name: "milestoneId", type: "text", placeholder: "Milestone ID" },
          { name: "remarks", type: "text", placeholder: "Remarks" },
        ]}
      />
    </div>
  );
}

export default Users;