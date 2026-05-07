import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
} from "@mui/material";

import {
  AssignmentRounded,
  CheckCircleRounded,
  PendingActionsRounded,
  AutorenewRounded,
} from "@mui/icons-material";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { getAllTasks } from "../services/taskService";

const COLORS = ["#10b981", "#6366f1", "#f59e0b"];

export default function PageContent() {
  const [tasks, setTasks] = useState([]);

  const quotes = [
    "Stay consistent, results will follow 💪",
    "Small progress each day adds up to big results 🚀",
    "Focus on progress, not perfection ✨",
    "Discipline is stronger than motivation 🔥",
    "Great things take time — keep going ⏳",
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [time, setTime] = useState(new Date());
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    getAllTasks()
      .then((res) =>
        setTasks(Array.isArray(res) ? res : res.data || [])
      )
      .catch(console.error);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setGreeting(getGreeting());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
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

  const stats = tasks.reduce(
    (a, t) => {
      a.total++;
      if (t.status === "COMPLETED") a.completed++;
      if (t.status === "PENDING") a.pending++;
      if (t.status === "IN_PROGRESS") a.progress++;
      return a;
    },
    {
      total: 0,
      completed: 0,
      pending: 0,
      progress: 0,
    }
  );

  const chartData = [
    { name: "Completed", value: stats.completed },
    { name: "Progress", value: stats.progress },
    { name: "Pending", value: stats.pending },
  ];

  const cards = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: <AssignmentRounded />,
      color: "linear-gradient(135deg,#8b5cf6,#a855f7)",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: <CheckCircleRounded />,
      color: "linear-gradient(135deg,#10b981,#34d399)",
    },
    {
      title: "In Progress",
      value: stats.progress,
      icon: <AutorenewRounded />,
      color: "linear-gradient(135deg,#6366f1,#818cf8)",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: <PendingActionsRounded />,
      color: "linear-gradient(135deg,#f59e0b,#fb923c)",
    },
  ];

  return (
    <Box>
      <Card
        sx={{
          mb: 3,
          borderRadius: "26px",
          background:
            "linear-gradient(135deg,#7c3aed,#8b5cf6,#a855f7)",
          color: "#fff",
          boxShadow: "0 20px 40px rgba(124,58,237,.22)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 30,
                  fontWeight: 800,
                  mb: 1,
                }}
              >
                {greeting}
              </Typography>

              <Typography
                sx={{
                  fontSize: 16,
                  fontStyle: "italic",
                  opacity: fade ? 0.95 : 0,
                  transform: fade
                    ? "translateY(0px)"
                    : "translateY(10px)",
                  transition: "all 0.4s ease",
                }}
              >
                {quotes[quoteIndex]}
              </Typography>
            </Box>
            <Box
              sx={{
                textAlign: "right",
                minWidth: 180,
              }}
            >
              <br />
              <Typography sx={{ fontSize: 15, opacity: 0.8 }}>
                Local Time
              </Typography>

              <Typography sx={{ fontSize: 25, fontWeight: 700 }}>
                {time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
              <Typography sx={{ fontSize: 13, opacity: 0.8 }}>
                {time.toLocaleDateString([], {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}{" "}
              </Typography>
            </Box>
          </Box>

          {/* CHIPS */}
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <Chip
              label={`${stats.pending} Pending`}
              sx={{
                bgcolor: "rgba(255,255,255,.18)",
                color: "#fff",
              }}
            />

            <Chip
              label={`${stats.completed} Done`}
              sx={{
                bgcolor: "rgba(255,255,255,.18)",
                color: "#fff",
              }}
            />
          </Box>
        </CardContent>
      </Card>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(4,1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {cards.map((card, i) => (
          <Card
            key={i}
            sx={{
              borderRadius: "22px",
              background: "rgba(255,255,255,.6)",
              backdropFilter: "blur(14px)",
              boxShadow: "0 12px 30px rgba(0,0,0,.05)",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  background: card.color,
                  mb: 2,
                }}
              >
                {card.icon}
              </Box>

              <Typography sx={{ fontSize: 14, color: "#6b7280" }}>
                {card.title}
              </Typography>

              <Typography
                sx={{
                  fontSize: 34,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* 📈 CHARTS */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 2,
        }}
      >
        {/* PIE */}
        <Card sx={{ borderRadius: "24px", p: 3 }}>
          <Typography sx={{ fontWeight: 800, mb: 2 }}>
            Task Distribution
          </Typography>

          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  outerRadius={110}
                  innerRadius={55}
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        {/* BAR */}
        <Card sx={{ borderRadius: "24px", p: 3 }}>
          <Typography sx={{ fontWeight: 800, mb: 2 }}>
            Status Overview
          </Typography>

          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}