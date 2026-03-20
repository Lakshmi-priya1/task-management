import React, { useState, useEffect } from "react";
import { FaUsers, FaBuilding, FaChartLine, FaUserCheck } from "react-icons/fa";
import { getEmployees } from "../services/employeeService";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

function PageContent() {

  const [employees, setEmployees] = useState([]);

  /* FETCH EMPLOYEES */

  useEffect(() => {

    getEmployees()
      .then(data => {

        const formattedEmployees = data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          department: user.company?.name || "General"
        }));

        setEmployees(formattedEmployees);

      })
      .catch(err => console.log(err));

  }, []);

  /* EMPLOYEE DASHBOARD CARDS */

  const totalEmployees = employees.length;

  const departments = new Set(
    employees.map(emp => emp.department)
  ).size;

  const activeEmployees = Math.floor(totalEmployees * 0.8);
  const growth = "+12%";

  /* TASK DATA FOR CHARTS */

  const tasks = [
    { id: 1, title: "Fix Login Bug", status: "In Progress" },
    { id: 2, title: "Update Dashboard", status: "Pending" },
    { id: 3, title: "Deploy Application", status: "Completed" },
    { id: 4, title: "API Integration", status: "Completed" },
  ];

  const completed = tasks.filter(t => t.status === "Completed").length;
  const pending = tasks.filter(t => t.status === "Pending").length;
  const progress = tasks.filter(t => t.status === "In Progress").length;

  const chartData = [
    { name: "Completed", value: completed },
    { name: "In Progress", value: progress },
    { name: "Pending", value: pending }
  ];

  const COLORS = ["#22c55e", "#3b82f6", "#f59e0b"];

  return (

    <div className="container-fluid page-content">

      {/* WELCOME */}

      <div className="card shadow mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">

          <div>
            <h3 className="fw-bold mb-1">Welcome Back 👋</h3>
            <p className="mb-0">
              Monitor employees and track task progress.
            </p>
          </div>

          <FaUsers size={40} />

        </div>
      </div>

      {/* DASHBOARD CARDS */}

      <div className="row mb-4">

        <div className="col-md-3">
          <div className="card shadow text-center p-3">
            <FaUsers size={25} className="mb-2 text-primary" />
            <h6>Total Employees</h6>
            <h3>{totalEmployees}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow text-center p-3">
            <FaBuilding size={25} className="mb-2 text-success" />
            <h6>Departments</h6>
            <h3>{departments}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow text-center p-3">
            <FaChartLine size={25} className="mb-2 text-warning" />
            <h6>Growth</h6>
            <h3>{growth}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow text-center p-3">
            <FaUserCheck size={25} className="mb-2 text-info" />
            <h6>Active Employees</h6>
            <h3>{activeEmployees}</h3>
          </div>
        </div>

      </div>

      {/* TASK CHARTS */}

      <div className="row mb-4">

        {/* PIE CHART */}

        <div className="col-md-6">
          <div className="card shadow p-3">

            <h5 className="text-center mb-3">
              Task Distribution
            </h5>

            <ResponsiveContainer width="100%" height={300}>

              <PieChart>

                <Pie
                  data={chartData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >

                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>
        </div>

        {/* BAR CHART */}

        <div className="col-md-6">
          <div className="card shadow p-3">

            <h5 className="text-center mb-3">
              Task Status Chart
            </h5>

            <ResponsiveContainer width="100%" height={300}>

              <BarChart data={chartData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar dataKey="value">

                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}

                </Bar>

              </BarChart>

            </ResponsiveContainer>

          </div>
        </div>

      </div>

    </div>

  );
}

export default PageContent;