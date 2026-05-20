import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllTasks, getMyTasks } from "../services/taskService";
import { getMilestones } from "../services/mileStoneService";

const quotes = [
  "Stay consistent, results will follow 💪",
  "Small progress each day adds up to big results 🚀",
  "Focus on progress, not perfection ✨",
  "Discipline is stronger than motivation 🔥",
  "Great things take time — keep going ⏳",
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 21) return "Good Evening";
  return "Good Night";
};

const calcTaskStats = (tasks) =>
  tasks.reduce(
    (a, t) => {
      a.total++;
      if (t.status === "COMPLETED")  a.completed++;
      if (t.status === "PENDING")    a.pending++;
      if (t.status === "IN_PROGRESS") a.progress++;
      return a;
    },
    { total: 0, completed: 0, pending: 0, progress: 0 }
  );

export function useDashboard() {
  const role = useSelector((state) => state.auth.role);

  const [tasks,      setTasks]      = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade,       setFade]       = useState(true);
  const [time,       setTime]       = useState(new Date());
  const [greeting,   setGreeting]   = useState(getGreeting());

  // Fetch data based on role
  useEffect(() => {
    if (role === "EMPLOYEE") {
      getMyTasks()
        .then((res) => setTasks(Array.isArray(res) ? res : res?.content || []))
        .catch(console.error);
    } else {
      getAllTasks()
        .then((res) => setTasks(Array.isArray(res) ? res : res?.content || res?.data || []))
        .catch(console.error);
    }

    if (role === "TEAM_LEAD" || role === "PROJECT_MANAGER" || role === "ADMIN") {
      getMilestones({ page: 0, size: 100 })
        .then((res) => setMilestones(res?.content || []))
        .catch(console.error);
    }
  }, [role]);

  // Clock
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setGreeting(getGreeting());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Rotating quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const taskStats = calcTaskStats(tasks);

  const milestoneStats = milestones.reduce(
    (a, m) => {
      a.total++;
      if (m.status === "COMPLETED")  a.completed++;
      if (m.status === "IN_PROGRESS") a.progress++;
      if (m.status === "PENDING")    a.pending++;
      return a;
    },
    { total: 0, completed: 0, pending: 0, progress: 0 }
  );

  const taskChartData = [
    { name: "Completed", value: taskStats.completed },
    { name: "In Progress", value: taskStats.progress },
    { name: "Pending",   value: taskStats.pending },
  ];

  const milestoneChartData = [
    { name: "Completed", value: milestoneStats.completed },
    { name: "In Progress", value: milestoneStats.progress },
    { name: "Pending",   value: milestoneStats.pending },
  ];

  return {
    role,
    taskStats,
    milestoneStats,
    taskChartData,
    milestoneChartData,
    // legacy alias so existing PageContent still works
    stats: taskStats,
    chartData: taskChartData,
    quotes,
    quoteIndex,
    fade,
    time,
    greeting,
  };
}
