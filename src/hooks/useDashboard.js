import { useEffect, useState } from "react";
import { getAllTasks } from "../services/taskService";

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

export function useDashboard() {
  const [tasks, setTasks] = useState([]);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [time, setTime] = useState(new Date());
  const [greeting, setGreeting] = useState(getGreeting());

  // Fetch tasks
  useEffect(() => {
    getAllTasks()
      .then((res) => setTasks(Array.isArray(res) ? res : res.data || []))
      .catch(console.error);
  }, []);

  // Update clock & greeting every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setGreeting(getGreeting());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Rotate quotes with fade transition
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

  // Derived stats
  const stats = tasks.reduce(
    (a, t) => {
      a.total++;
      if (t.status === "COMPLETED") a.completed++;
      if (t.status === "PENDING") a.pending++;
      if (t.status === "IN_PROGRESS") a.progress++;
      return a;
    },
    { total: 0, completed: 0, pending: 0, progress: 0 }
  );

  const chartData = [
    { name: "Completed", value: stats.completed },
    { name: "Progress",  value: stats.progress },
    { name: "Pending",   value: stats.pending },
  ];

  return {
    stats,
    chartData,
    quotes,
    quoteIndex,
    fade,
    time,
    greeting,
  };
}