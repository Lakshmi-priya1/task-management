import React, { useState, useEffect, useRef } from "react";
import {
FaTasks,
FaCheckCircle,
FaHourglassHalf,
FaList,
} from "react-icons/fa";
import "../assets/Dashboard.css";
import welcomeImg from "../assets/icon.jpg";
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
const [time, setTime] = useState(new Date());
const [message, setMessage] = useState("Stay productive 🚀");

const messageIndex = useRef(0);

/* 🔄 Fetch Tasks */
useEffect(() => {
getAllTasks()
.then((data) => {
setTasks(Array.isArray(data) ? data : data.data || []);
})
.catch((err) => console.log(err));
}, []);

/* ⏰ Live Time */
useEffect(() => {
const interval = setInterval(() => {
setTime(new Date());
}, 1000);
return () => clearInterval(interval);
}, []);

/* 💬 Stable Message Rotation */
useEffect(() => {
const messages = [
"Stay productive 🚀",
"Keep pushing forward ✨",
"You’re doing great 🌟",
];


const interval = setInterval(() => {
  messageIndex.current =
    (messageIndex.current + 1) % messages.length;

  setMessage(messages[messageIndex.current]);
}, 5000);

return () => clearInterval(interval);


}, []);

/* 👋 Greeting */
const getGreeting = () => {
const hour = time.getHours();
if (hour < 12) return "Good Morning ☀️";
if (hour < 18) return "Good Afternoon 🌤️";
if (hour < 22) return "Good Evening 🌙";
return "Good Night 🌕";
};

/* ⚡ Optimized Stats */
const stats = tasks.reduce(
(acc, t) => {
acc.total++;
if (t.status === "COMPLETED") acc.completed++;
else if (t.status === "PENDING") acc.pending++;
else if (t.status === "IN_PROGRESS") acc.inProgress++;
return acc;
},
{ total: 0, completed: 0, pending: 0, inProgress: 0 }
);

const chartData = [
{ name: "Completed", value: stats.completed },
{ name: "In Progress", value: stats.inProgress },
{ name: "Pending", value: stats.pending },
];

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b"];

return ( <div className="container-fluid page-content">


  <div className="card shadow mb-4 welcome-card">
    <div className="card-body d-flex justify-content-between align-items-center">

      {/* LEFT */}
      <div>
        <h3 className="fw-bold mb-1">{getGreeting()}</h3>

        <p className="mb-1 text-muted">
          You have <strong>{stats.pending}</strong> pending tasks and{" "}
          <strong>{stats.inProgress}</strong> in progress.
        </p>

        <small className="text-secondary fade-text">
          {message}
        </small>
      </div>

      {/* RIGHT */}
      <div className="text-end d-flex flex-column align-items-center">
        <img src={welcomeImg} alt="welcome" className="welcome-img mb-2" />
        <div className="text-muted">
          {time.toLocaleTimeString()}
        </div>
      </div>

    </div>
  </div>

  {/* 📊 STATS */}
  <div className="row mb-4">
    <div className="col-md-3">
      <div className="card shadow text-center p-3">
        <FaList size={22} />
        <h6>Total Tasks</h6>
        <h3>{stats.total}</h3>
      </div>
    </div>

    <div className="col-md-3">
      <div className="card shadow text-center p-3">
        <FaCheckCircle size={22} className="text-success" />
        <h6>Completed</h6>
        <h3 className="text-success">{stats.completed}</h3>
      </div>
    </div>

    <div className="col-md-3">
      <div className="card shadow text-center p-3">
        <FaHourglassHalf size={22} className="text-primary" />
        <h6>In Progress</h6>
        <h3 className="text-primary">{stats.inProgress}</h3>
      </div>
    </div>

    <div className="col-md-3">
      <div className="card shadow text-center p-3">
        <FaTasks size={22} className="text-warning" />
        <h6>Pending</h6>
        <h3 className="text-warning">{stats.pending}</h3>
      </div>
    </div>
  </div>

  {/* 📈 CHARTS */}
  <div className="row mb-4">

    {/* PIE */}
    <div className="col-md-6">
      <div className="card shadow p-3">
        <h5 className="text-center mb-3">Task Distribution</h5>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} dataKey="value" outerRadius={100}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* BAR */}
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
