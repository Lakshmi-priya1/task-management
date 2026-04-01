import React, { useState, useEffect } from "react";
import {
  FaTasks,
  FaCheckCircle,
  FaHourglassHalf,
  FaList,
} from "react-icons/fa";

import { getAllTasks } from "../services/taskService";

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
  Legend,
} from "recharts";

function PageContent() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getAllTasks()
      .then((data) => {
        setTasks(Array.isArray(data) ? data : data.data || []);
      })
      .catch((err) => console.log(err));
  }, []);

  const totalTasks = tasks.length;

  const completed = tasks.filter((t) => t.status === "COMPLETED").length;

  const pending = tasks.filter((t) => t.status === "PENDING").length;

  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;

  const chartData = [
    { name: "Completed", value: completed },
    { name: "In Progress", value: inProgress },
    { name: "Pending", value: pending },
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
              Monitor tasks and track progress efficiently.
            </p>
          </div>
          <FaTasks size={40} />
        </div>
      </div>

      {/* TASK STATS CARDS */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card shadow text-center p-3">
            <FaList size={22} className="mb-2 text-dark" />
            <h6>Total Tasks</h6>
            <h3>{totalTasks}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow text-center p-3">
            <FaCheckCircle size={22} className="mb-2 text-success" />
            <h6>Completed</h6>
            <h3 className="text-success">{completed}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow text-center p-3">
            <FaHourglassHalf size={22} className="mb-2 text-primary" />
            <h6>In Progress</h6>
            <h3 className="text-primary">{inProgress}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow text-center p-3">
            <FaTasks size={22} className="mb-2 text-warning" />
            <h6>Pending</h6>
            <h3 className="text-warning">{pending}</h3>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="row mb-4">
        {/* PIE CHART */}
        <div className="col-md-6">
          <div className="card shadow p-3">
            <h5 className="text-center mb-3">Task Distribution</h5>

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
            <h5 className="text-center mb-3">Task Status Chart</h5>

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
