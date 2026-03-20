import { useState, useEffect } from "react";
import ToastMessage from "../components/ToastMessage";
import FormModal from "../components/FormModal";
import BulkUpload from "../components/BulkUpload";
import DataTable from "../components/DataTable";
import Swal from "sweetalert2";

import { getAllTasks, addTask, deleteTask } from "../services/taskService";

function Users() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "PENDING",
    dueDate: "",
  });

  // 🔔 Toast
  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 🚀 FETCH TASKS
  useEffect(() => {
   
    loadTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getAllTasks();

      if (Array.isArray(data)) {
        setTasks(data);
      } else if (data.data) {
        setTasks(data.data);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      showToast("Failed to load tasks", "error");
    }
  };

  // 🟢 OPEN MODAL
  const openModal = () => {
    const modalEl = document.getElementById("addTaskModal");
    if (modalEl) {
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
    }
  };

 const handleAddTask = async () => {
  if (!newTask.title || !newTask.description || !newTask.dueDate) {
    showToast("Please fill all required fields", "error");
    return;
  }

  try {
    if (editingTask) {
      showToast("Update API not connected yet", "error");
      return;
    }

    // 🔥 Call backend
    await addTask(newTask);

    // 🔄 Fetch updated tasks from backend
    await loadTasks();

    showToast("Task added successfully!", "success");

    // Reset form
    setNewTask({
      title: "",
      description: "",
      status: "PENDING",
      dueDate: "",
    });

    // Close modal
    const modalEl = document.getElementById("addTaskModal");
    if (modalEl) {
      const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) modalInstance.hide();
    }
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    showToast("Failed to add task", "error");
  }
};

const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Delete Task?",
    text: "Are you sure you want to delete this task?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel"
  });

  if (result.isConfirmed) {
    try {
      // Call backend to delete
      await deleteTask(id);

      // ✅ Remove task from state -> automatically refreshes table
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));

      // Show success toast
      showToast("Task deleted successfully!", "success");

    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      showToast("Failed to delete task", "error");
    }
  }
};

  // ✏️ EDIT
  const handleEdit = (task) => {
    setEditingTask(task);
    setNewTask(task);
    openModal();
  };

  // 🔄 RESET
  const resetForm = () => {
    setEditingTask(null);
    setNewTask({
      title: "",
      description: "",
      status: "PENDING",
      dueDate: "",
    });
  };

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex justify-content-between mb-3">
        <h2 style={{ color: "white" }}>Task Management</h2>

        <div className="d-flex gap-2">
          <BulkUpload setTasks={setTasks} />

          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              openModal();
            }}
          >
            + Add Task
          </button>
        </div>
      </div>

      <FormModal
  modalId="addTaskModal"
  title={editingTask ? "Edit Task" : "Add Task"}
  formData={newTask}
  setFormData={setNewTask}
  handleSubmit={handleAddTask}
  fields={[
    { name: "title", type: "text", placeholder: "Enter Title", fullWidth: true },

    { name: "description", type: "text", placeholder: "Enter Description", fullWidth: true },

    {
      name: "status",
      type: "select",
      options: ["PENDING", "IN_PROGRESS", "COMPLETED"],
    },

    { name: "dueDate", type: "date" },
  ]}
/>
      {/* TABLE */}
      <DataTable
        title="Task List"
        data={tasks}
        columns={["Title", "Description", "Status", "Due Date"]}
        fields={["title", "description", "status", "dueDate"]}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        fileName="tasks"
      />

      {/* TOAST */}
      {toastMessage && (
        <ToastMessage
          id="taskToast"
          message={toastMessage.message}
          type={toastMessage.type}
        />
      )}
    </div>
  );
}

export default Users;