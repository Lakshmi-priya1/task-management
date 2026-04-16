import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";

import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";
import ViewDrawer from "../components/ViewDrawer";

import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/employeeService";

import { getAllTasks } from "../services/taskService";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
});

const emptyForm = {
  employeeId: "",
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phoneNumber: "",
  department: "",
  status: "",
};

function Employee() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeForm, setEmployeeForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const size = 5;

  const resetForm = useCallback(() => {
    setEditingEmployee(null);
    setEmployeeForm(emptyForm);
  }, []);

  // ✅ FETCH EMPLOYEES
  const fetchEmployeesData = useCallback(async () => {
    try {
      setLoading(true);

      const [empRes, tasksRes] = await Promise.all([
        getEmployees({
          keyword: searchTerm,
          department,
          page,
          size,
        }),
        getAllTasks(),
      ]);

      const employeeList = empRes?.content || [];
      const total = empRes?.totalPages || 1;

      const taskMap = {};
      (tasksRes || []).forEach((task) => {
        if (!taskMap[task.employeeId]) {
          taskMap[task.employeeId] = [];
        }
        taskMap[task.employeeId].push(task);
      });

      const formatted = employeeList.map((emp) => ({
        id: emp.employeeId,
        employeeId: emp.employeeId,
        username: emp.username,
        firstName: emp.firstName,
        lastName: emp.lastName,
        name: `${emp.firstName} ${emp.lastName}`,
        email: emp.email,
        phoneNumber: emp.phoneNumber,
        department: emp.department,
        status: emp.status,
        tasks: taskMap[emp.employeeId] || [],
      }));

      setEmployees(formatted);
      setTotalPages(total);
    } catch (err) {
      console.error(err);
      setEmployees([]);
      Toast.fire({ icon: "error", title: "Failed to fetch employees" });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, department, page]);

  // ✅ AUTO GENERATE DEPARTMENTS (NO EXTRA API)
  useEffect(() => {
    const uniqueDepts = [
      ...new Set(
        employees
          .map((emp) => emp.department)
          .filter((d) => d && d.trim() !== "")
      ),
    ];

    setDepartments(uniqueDepts);
  }, [employees]);

  useEffect(() => {
    fetchEmployeesData();
  }, [fetchEmployeesData]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleFilter = (e) => {
    setDepartment(e.target.value);
    setPage(0);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleView = (id) => {
    const emp = employees.find((e) => e.employeeId === id);

    if (!emp) {
      return Toast.fire({ icon: "error", title: "Employee not found" });
    }

    setSelectedEmployee(emp);
    setViewOpen(true);
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setEmployeeForm(emp);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: "Delete Employee?",
      icon: "warning",
      showCancelButton: true,
    });

    if (res.isConfirmed) {
      try {
        await deleteEmployee(id);
        fetchEmployeesData();
        Toast.fire({ icon: "success", title: "Deleted" });
      } catch {
        Toast.fire({ icon: "error", title: "Delete failed" });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.employeeId, employeeForm);
        Toast.fire({ icon: "success", title: "Updated" });
      } else {
        await addEmployee(employeeForm);
        Toast.fire({ icon: "success", title: "Added" });
      }

      setModalOpen(false);
      resetForm();
      fetchEmployeesData();
    } catch {
      Toast.fire({ icon: "error", title: "Operation failed" });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2 style={{ color: "white" }}>Employee Management</h2>

        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
        >
          Add Employee
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="search-filter-bar">
        <div className="search-container">
          <i className="bi bi-search search-icon"></i>
          <input
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search employee..."
          />
        </div>

        <div className="filter-container">
          <i className="bi bi-funnel filter-icon"></i>

          <select value={department} onChange={handleFilter}>
            <option value="">All Departments</option>

            {departments.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        title="Employee List"
        data={employees}
        columns={["Email", "Department", "Status"]}
        fields={["email", "department", "status"]}
        idField="employeeId"
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleView={handleView}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isEmployeeTable={true}
      />

      <ViewDrawer
  isOpen={viewOpen}
  onClose={() => setViewOpen(false)}
  title="Employee Details"
  sections={
    selectedEmployee
      ? [
          {
            heading: "Basic Info",
            fields: [
              { label: "ID", value: selectedEmployee.employeeId },
              { label: "Username", value: selectedEmployee.username },
              {
                label: "Name",
                value: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
              },
              { label: "Email", value: selectedEmployee.email },
              { label: "Phone", value: selectedEmployee.phoneNumber },
              { label: "Department", value: selectedEmployee.department },
              { label: "Status", value: selectedEmployee.status },
            ],
          },
          {
            heading: "Tasks",
            fields:
              selectedEmployee.tasks.length > 0
                ? selectedEmployee.tasks.map((task) => ({
                    label: task.title,
                    value: `${task.status} | ${task.priority}`,
                  }))
                : [{ label: "No Tasks", value: "No tasks assigned" }],
          },
        ]
      : []
  }
/>
      <FormModal
        isOpen={modalOpen}
        handleClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={editingEmployee ? "Edit Employee" : "Add Employee"}
        formData={employeeForm}
        setFormData={setEmployeeForm}
        handleSubmit={handleSubmit}
        tabs={[
          {
            key: "basic",
            label: "Basic Info",
            fields: [
              { name: "username", type: "text" },
              { name: "firstName", type: "text" },
              { name: "lastName", type: "text" },
              { name: "email", type: "email" },
              { name: "phoneNumber", type: "text" },
            ],
          },
          {
            key: "work",
            label: "Work Info",
            fields: [
              { name: "department", type: "text" },
              {
                name: "status",
                type: "select",
                options: ["ACTIVE", "INACTIVE"],
              },
            ],
          },
          {
            key: "security",
            label: "Security",
            fields: [{ name: "password", type: "password" }],
          },
        ]}
      />
    </div>
  );
}

export default Employee;