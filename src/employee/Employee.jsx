import React, { useState, useEffect } from "react";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";

import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";
import BulkUpload from "../components/BulkUpload";
import ViewDrawer from "../components/ViewDrawer"; 

import {
  addEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} from "../services/employeeService";

// Toast Config
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
});

function Employee() {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  // Drawer State
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [employeeForm, setEmployeeForm] = useState({
    employeeId: "",
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    designation: "",
    roleId: "",
    departmentId: "",
    status: "",
  });

  /* ================= MODAL CLEANUP ================= */
  const cleanupModal = () => {
    document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("padding-right");
  };

  useEffect(() => {
    return () => cleanupModal();
  }, []);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchEmployees();
  }, [page, size]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getEmployees(page, size);
      const list = res?.data?.content || [];

      const formatted = list.map((user, index) => ({
        id: user.employeeId || index,
        employeeId: user.employeeId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        designation: user.designation || "N/A",
        status: user.status,
        roleId: user.roleId,
        departmentId: user.departmentId,
      }));

      setEmployees(formatted);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setEmployees([]); 
      setTotalPages(1);

      Toast.fire({
        icon: "error",
        title: "Failed to fetch employees",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setEditingEmployee(null);
    setEmployeeForm({
      employeeId: "",
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      designation: "",
      roleId: "",
      departmentId: "",
      status: "",
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.employeeId, employeeForm);
        Toast.fire({ icon: "success", title: "Employee updated successfully" });
      } else {
        await addEmployee(employeeForm);
        Toast.fire({ icon: "success", title: "Employee added successfully" });
      }

      fetchEmployees();

      const modalEl = document.getElementById("employeeModal");
      const modalInstance = Modal.getInstance(modalEl) || new Modal(modalEl);

      modalEl.addEventListener(
        "hidden.bs.modal",
        () => {
          cleanupModal();
          resetForm();
        },
        { once: true },
      );

      modalInstance.hide();
    } catch (err) {
      console.error(err);
      Toast.fire({ icon: "error", title: "Operation failed!" });
    }
  };

  /* ================= VIEW (UPDATED) ================= */
  const handleView = (id) => {
    const emp = employees.find((e) => String(e.employeeId) === String(id));

    if (!emp) {
      Toast.fire({
        icon: "error",
        title: "Employee not found",
      });
      return;
    }

    setSelectedEmployee(emp);
    setViewOpen(true);
  };

  /* ================= EDIT ================= */
  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setEmployeeForm(emp);

    const modalEl = document.getElementById("employeeModal");
    const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
    modal.show();
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Employee?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        await deleteEmployee(id);

        Toast.fire({
          icon: "success",
          title: "Employee deleted successfully",
        });

        fetchEmployees();
      } catch (err) {
        console.error(err);
        Toast.fire({ icon: "error", title: "Delete failed!" });
      }
    }
  };

  /* ================= UI ================= */
  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2 style={{ color: "white" }}>Employee Management</h2>

        <div className="d-flex gap-2">
          <BulkUpload setEmployees={setEmployees} />
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#employeeModal"
            onClick={resetForm}
          >
            Add Employee
          </button>
        </div>
      </div>

      <DataTable
        title="Employee List"
        data={employees}
        columns={["Email", "Designation", "Status"]}
        fields={["email", "designation", "status"]}
        idField="employeeId"
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleView={handleView} 
        isEmployeeTable={true}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        rowsPerPage={size}
        onRowsChange={setSize}
        loading={loading}
      />

      {/* VIEW DRAWER */}
      <ViewDrawer
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Employee Details"
        icon="bi-person-vcard"
        footer={
          selectedEmployee && (
            <div
              className={`vd-status-banner ${
                selectedEmployee.status === "ACTIVE"
                  ? "vd-status-active"
                  : "vd-status-inactive"
              }`}
            >
              <i
                className={`bi ${
                  selectedEmployee.status === "ACTIVE"
                    ? "bi-check-circle"
                    : "bi-x-circle"
                }`}
              ></i>
              <span>{selectedEmployee.status}</span>
            </div>
          )
        }
        sections={
          selectedEmployee
            ? [
                {
                  heading: "Basic Info",
                  fields: [
                    {
                      label: "Employee ID",
                      value: selectedEmployee.employeeId,
                    },
                    { label: "Username", value: selectedEmployee.username },
                    { label: "Name", value: selectedEmployee.name },
                    { label: "Email", value: selectedEmployee.email },
                  ],
                },
                {
                  heading: "Work Info",
                  fields: [
                    { label: "Phone", value: selectedEmployee.phone },
                    {
                      label: "Designation",
                      value: selectedEmployee.designation,
                    },
                    { label: "Role ID", value: selectedEmployee.roleId },
                    {
                      label: "Department ID",
                      value: selectedEmployee.departmentId,
                    },
                  ],
                },
              ]
            : []
        }
      />

      {/* FORM MODAL */}
      <FormModal
        modalId="employeeModal"
        title="Employee"
        formData={employeeForm}
        setFormData={setEmployeeForm}
        handleSubmit={handleSubmit}

        tabs={[
          {
            key: "basic",
            label: "Basic Info",
            fields: [
              { name: "employeeId", type: "text", placeholder: "Employee ID" },
              { name: "username", type: "text", placeholder: "Username" },
              { name: "firstName", type: "text", placeholder: "First Name" },
              { name: "lastName", type: "text", placeholder: "Last Name" },
              { name: "email", type: "email", placeholder: "Email" },
              { name: "password", type: "password", placeholder: "Password" },
            ],
          },
          {
            key: "work",
            label: "Work Info",
            fields: [
              { name: "phone", type: "text", placeholder: "Phone" },
              { name: "designation", type: "text", placeholder: "Designation" },
              { name: "roleId", type: "text", placeholder: "Role ID" },
              {
                name: "departmentId",
                type: "text",
                placeholder: "Department ID",
              },
              {
                name: "status",
                type: "select",
                options: ["ACTIVE", "INACTIVE"],
              },
            ],
          },
        ]}
      />
    </div>
  );
}

export default Employee;
