import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";

import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";
import ViewDrawer from "../components/ViewDrawer";

import {
  getTasks,
  getAllTasks, // ✅ important
  addTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

import { getEmployees } from "../services/employeeService";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
});

const emptyForm = {
  title: "",
  description: "",
  status: "PENDING",
  priority: "MEDIUM",
  dueDate: "",
  employeeId: "",
};

function Task() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const resetForm = useCallback(() => {
    setEditingTask(null);
    setTaskForm(emptyForm);
  }, []);

  // ✅ FETCH FILTERED TASKS
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
    } catch (err) {
      console.error(err);
      setTasks([]);
      Toast.fire({ icon: "error", title: "Failed to load tasks" });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, page]);

  // ✅ FETCH STATUSES (NO CONFLICT)
  const fetchStatuses = useCallback(async () => {
    try {
      const list = await getAllTasks();

      const uniqueStatuses = [
        ...new Set(
          list
            .map((task) => task.status)
            .filter((s) => s && s.trim() !== "")
        ),
      ];

      setStatuses(uniqueStatuses);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadEmployees = useCallback(async () => {
    try {
      const res = await getEmployees();
      setEmployees(res?.content || []);
    } catch (err) {
      console.error(err);
      setEmployees([]);
    }
  }, []);

  useEffect(() => {
    loadTasks();
    loadEmployees();
    fetchStatuses();
  }, [loadTasks, loadEmployees, fetchStatuses]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, statusFilter]);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleFilter = (e) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  const handlePageChange = (newPage) => setPage(newPage);

  const handleView = (id) => {
    const task = tasks.find((t) => String(t.id) === String(id));
    if (!task) return Toast.fire({ icon: "error", title: "Task not found" });

    setSelectedTask(task);
    setViewOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTaskForm({
      ...task,
      dueDate: task.dueDate?.split("T")[0],
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: "Delete Task?",
      icon: "warning",
      showCancelButton: true,
    });

    if (res.isConfirmed) {
      try {
        await deleteTask(id);
        loadTasks();
        fetchStatuses();
        Toast.fire({ icon: "success", title: "Deleted" });
      } catch {
        Toast.fire({ icon: "error", title: "Delete failed" });
      }
    }
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();

    const payload = {
      ...taskForm,
      employeeId: Number(taskForm.employeeId?.split(" - ")[0]),
      dueDate: taskForm.dueDate ? `${taskForm.dueDate}T00:00:00` : null,
    };

    try {
      if (editingTask) {
        await updateTask(editingTask.id, payload);
        Toast.fire({ icon: "success", title: "Updated" });
      } else {
        await addTask(payload);
        Toast.fire({ icon: "success", title: "Added" });
      }

      setModalOpen(false);
      resetForm();
      loadTasks();
      fetchStatuses();
    } catch {
      Toast.fire({ icon: "error", title: "Operation failed" });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2 style={{ color: "white" }}>Task Management</h2>
        <button className="btn btn-primary" onClick={() => {
          resetForm();
          setModalOpen(true);
        }}>
          Add Task
        </button>
      </div>

      <div className="search-filter-bar">
        <div className="search-container">
          <input
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search task..."
          />
        </div>

        <div className="filter-container">
          <select value={statusFilter} onChange={handleFilter}>
            <option value="">All</option>
            {statuses.map((status, i) => (
              <option key={i} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        title="Task List"
        data={tasks}
        columns={["Title", "Status", "Priority", "Due Date"]}
        fields={["title", "status", "priority", "dueDate"]}
        handleView={handleView}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <ViewDrawer
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Task Details"
        sections={selectedTask ? [{
          heading: "Task Info",
          fields: [
            { label: "Title", value: selectedTask.title },
            { label: "Status", value: selectedTask.status },
            { label: "Priority", value: selectedTask.priority },
            { label: "Description", value: selectedTask.description },
            { label: "Due Date", value: selectedTask.dueDate ? selectedTask.dueDate.split("T")[0] : "N/A" },
            { label: "Assigned Employee", value: selectedTask.employeeId 
  ? `Emp ID: ${selectedTask.employeeId}` 
  : "Unassigned" },

          ],
        }] : []}
      />

      <FormModal
        isOpen={modalOpen}
        handleClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={editingTask ? "Edit Task" : "Add Task"}
        formData={taskForm}
        setFormData={setTaskForm}
        handleSubmit={handleSubmitTask}
        tabs={[
          {
            key: "basic",
            label: "Task Info",
            fields: [
              { name: "title", type: "text" },
              { name: "description", type: "text" },
              { name: "status", type: "select", options: ["PENDING","IN_PROGRESS","COMPLETED"] },
              { name: "priority", type: "select", options: ["LOW","MEDIUM","HIGH"] },
              { name: "dueDate", type: "date" },
              {
                name: "employeeId",
                type: "select",
                options: employees.map(e => `${e.employeeId} - ${e.firstName}`)
              },
            ],
          },
        ]}
      />
    </div>
  );
}

export default Task;