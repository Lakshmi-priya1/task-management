import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "bootstrap";
import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";
import BulkUpload from "../components/BulkUpload";
import Swal from "sweetalert2";

import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee
} from "../services/employeeService";

function Employee() {

  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const navigate = useNavigate();

  // ✅ FULL FORM (REGISTER FIELDS)
  const [employeeForm, setEmployeeForm] = useState({
    employeeId: "",
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    roleId: "",
    departmentId: "",
    phone: "",
    designation: "",
    status: ""
  });

  /* ================= FETCH ================= */

  useEffect(() => {
    getEmployees()
      .then(data => {

        const formattedEmployees = data.map(user => ({
          id: user.id,
          employeeId: user.employeeId,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone,
          designation: user.designation,
          status: user.status,
          roleId: user.roleId,
          departmentId: user.departmentId
        }));

        setEmployees(formattedEmployees);

      })
      .catch(err => console.log(err));
  }, []);

  /* ================= RESET ================= */

  const resetForm = () => {
    setEditingEmployee(null);

    setEmployeeForm({
      employeeId: "",
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      roleId: "",
      departmentId: "",
      phone: "",
      designation: "",
      status: ""
    });
  };

  /* ================= ADD / UPDATE ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (editingEmployee) {
        // eslint-disable-next-line no-unused-vars
        const updated = await updateEmployee(
          editingEmployee.id,
          employeeForm
        );

        setEmployees(
          employees.map(emp =>
            emp.id === editingEmployee.id
              ? { ...emp, ...employeeForm, name: `${employeeForm.firstName} ${employeeForm.lastName}` }
              : emp
          )
        );

      } else {

        const created = await addEmployee(employeeForm);

        setEmployees([
          ...employees,
          {
            ...employeeForm,
            id: created.id || Date.now(),
            name: `${employeeForm.firstName} ${employeeForm.lastName}`
          }
        ]);
      }

      resetForm();

      const modal = window.bootstrap.Modal.getInstance(
        document.getElementById("employeeModal")
      );

      if (modal) modal.hide();

    } catch (error) {
      console.log(error);
    }
  };

  /* ================= VIEW ================= */

  const handleView = (id) => {
    navigate(`/dashboard/employee/${id}`);
  };

  /* ================= EDIT ================= */

  const handleEdit = (employee) => {

    setEditingEmployee(employee);

    setEmployeeForm({
      employeeId: employee.employeeId || "",
      username: employee.username || "",
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      email: employee.email || "",
      password: "",
      phone: employee.phone || "",
      designation: employee.designation || "",
      roleId: employee.roleId || "",
      departmentId: employee.departmentId || "",
      status: employee.status || ""
    });

    const modalElement = document.getElementById("employeeModal");
    const modal = new Modal(modalElement);
    modal.show();
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {

    const result = await Swal.fire({
      title: "Delete Employee?",
      text: "Are you sure you want to delete this employee?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {

      await deleteEmployee(id);

      setEmployees(
        employees.filter(emp => emp.id !== id)
      );

      Swal.fire(
        "Deleted!",
        "Employee has been deleted.",
        "success"
      );
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

      {/* ✅ TABLE */}
      <DataTable
        title="Employee List"
        data={employees}
        columns={["Name", "Email",  "Designation", "Status"]}
        fields={["name", "email","designation", "status"]}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleView={handleView}
      />

      <FormModal
  modalId="employeeModal"
  title="Add Employee"
  formData={employeeForm}
  setFormData={setEmployeeForm}
  handleSubmit={handleSubmit}
  tabs={[
    {
      key: "basic",
      label: "Basic Info",
      fields: [
        { name: "firstName", type: "text", placeholder: "First Name" },
        { name: "lastName", type: "text", placeholder: "Last Name" },
        { name: "email", type: "email", placeholder: "Email", fullWidth: true },
        { name: "password", type: "password", placeholder: "Password", fullWidth: true },
        { name: "phone", type: "text", placeholder: "Phone", fullWidth: true }
      ]
    },
    {
      key: "work",
      label: "Work Info",
      fields: [
        { name: "designation", type: "text", placeholder: "Designation" },
        { name: "status", type: "select", options: ["ACTIVE", "INACTIVE"], fullWidth: true }
      ]
    }
  ]}
/>

    </div>
  );
}

export default Employee;