export const COLORS = ["#10b981", "#6366f1", "#f59e0b"];

// ── Hero / greeting card ──────────────────────────────────────────────────────
export const heroCardSx = {
  mb: 3,
  borderRadius: "26px",
  background: "linear-gradient(135deg,#7c3aed,#8b5cf6,#a855f7)",
  color: "#fff",
  boxShadow: "0 20px 40px rgba(124,58,237,.22)",
};

export const heroContentSx = { p: 4 };

export const heroRowSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  flexWrap: "wrap",
  gap: 2,
};

export const greetingTextSx = {
  fontSize: 30,
  fontWeight: 800,
  mb: 1,
};

export const quoteTextSx = (fade) => ({
  fontSize: 16,
  fontStyle: "italic",
  opacity: fade ? 0.95 : 0,
  transform: fade ? "translateY(0px)" : "translateY(10px)",
  transition: "all 0.4s ease",
});

export const clockBoxSx = { textAlign: "right", minWidth: 180 };

export const clockLabelSx = { fontSize: 15, opacity: 0.8 };

export const clockTimeSx = { fontSize: 25, fontWeight: 700 };

export const clockDateSx = { fontSize: 13, opacity: 0.8 };

export const chipSx = {
  bgcolor: "rgba(255,255,255,.18)",
  color: "#fff",
};

export const chipRowSx = { display: "flex", gap: 1, mt: 2 };

// ── Stat cards grid ───────────────────────────────────────────────────────────
export const statsGridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    sm: "1fr 1fr",
    md: "repeat(4,1fr)",
  },
  gap: 2,
  mb: 3,
};

export const statCardSx = {
  borderRadius: "22px",
  background: "rgba(255,255,255,.6)",
  backdropFilter: "blur(14px)",
  boxShadow: "0 12px 30px rgba(0,0,0,.05)",
};

export const statIconBoxSx = (color) => ({
  width: 48,
  height: 48,
  borderRadius: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  background: color,
  mb: 2,
});

export const statLabelSx = { fontSize: 14, color: "#6b7280" };

export const statValueSx = { fontSize: 34, fontWeight: 800, color: "#111827" };

// ── Charts grid ───────────────────────────────────────────────────────────────
export const chartsGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
  gap: 2,
};

export const chartCardSx = { borderRadius: "24px", p: 3 };

export const chartTitleSx = { fontWeight: 800, mb: 2 };

export const chartBoxSx = { height: 300 };

// ── Stat card data (icons come from PageContent to keep this file icon-free) ──
export const getStatCards = (stats) => [
  { title: "Total Tasks",  value: stats.total,     color: "linear-gradient(135deg,#8b5cf6,#a855f7)" },
  { title: "Completed",    value: stats.completed, color: "linear-gradient(135deg,#10b981,#34d399)" },
  { title: "In Progress",  value: stats.progress,  color: "linear-gradient(135deg,#6366f1,#818cf8)" },
  { title: "Pending",      value: stats.pending,   color: "linear-gradient(135deg,#f59e0b,#fb923c)" },
];

export const getMilestoneStatCards = (ms, ts) => [
  { title: "Total Milestones",     value: ms.total,     color: "linear-gradient(135deg,#8b5cf6,#a855f7)" },
  { title: "Milestones Done",      value: ms.completed, color: "linear-gradient(135deg,#10b981,#34d399)" },
  { title: "Total Tasks",          value: ts.total,     color: "linear-gradient(135deg,#6366f1,#818cf8)" },
  { title: "Tasks Completed",      value: ts.completed, color: "linear-gradient(135deg,#f59e0b,#fb923c)" },
];

export const getEmployeeStatCards = (stats) => [
  { title: "My Tasks",    value: stats.total,     color: "linear-gradient(135deg,#8b5cf6,#a855f7)" },
  { title: "Completed",   value: stats.completed, color: "linear-gradient(135deg,#10b981,#34d399)" },
  { title: "In Progress", value: stats.progress,  color: "linear-gradient(135deg,#6366f1,#818cf8)" },
  { title: "Pending",     value: stats.pending,   color: "linear-gradient(135deg,#f59e0b,#fb923c)" },
];