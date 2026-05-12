// ── CONSTANTS ────────────────────────────────────────────────────────────────

export const TASK_STATUS_CONFIG = {
  COMPLETED:   { color: "#22c55e", bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.3)",   fill: 100 },
  IN_PROGRESS: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)",  fill: 50  },
  PENDING:     { color: "#94a3b8", bg: "rgba(148,163,184,0.1)",  border: "rgba(148,163,184,0.2)", fill: 0   },
};

// ── PAGE ─────────────────────────────────────────────────────────────────────

export const pageStyles = {
  root: { pb: 4 },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexWrap: "wrap", gap: 2, mb: 3,
  },
  headerControls: { display: "flex", alignItems: "center", gap: 1.5 },
  legend: { display: "flex", alignItems: "center", gap: 3, mb: 2.5, px: 0.5, flexWrap: "wrap" },
  legendItem: { display: "flex", alignItems: "center", gap: 0.6 },
  emptyState: { textAlign: "center", py: 10 },
  loadingBox: { display: "flex", justifyContent: "center", py: 8 },
};

export const titleStyles = (isDark) => ({
  fontSize: 22, fontWeight: 800,
  color: isDark ? "#e2e8f0" : "#0f172a",
  letterSpacing: -0.5,
});

export const subtitleStyles = (isDark) => ({
  fontSize: 13, color: isDark ? "#64748b" : "#94a3b8", mt: 0.3,
});

export const legendLabelStyles = (isDark) => ({
  fontSize: 12, color: isDark ? "#64748b" : "#94a3b8", fontWeight: 500,
});

export const emptyTextStyles = (isDark) => ({
  fontSize: 14, color: isDark ? "#475569" : "#94a3b8",
});

export const treeContainerStyles = (isDark) => ({
  backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
  border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
  borderRadius: "16px",
  py: 1.5,
});

export const searchFieldStyles = (isDark) => ({
  width: 220,
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontSize: 13,
    backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#fff",
  },
});

export const expandBtnStyles = (isDark) => ({
  backgroundColor: isDark ? "rgba(99,102,241,0.1)" : "#ede9fe",
  color: "#6366f1",
  borderRadius: "8px",
  "&:hover": { backgroundColor: isDark ? "rgba(99,102,241,0.2)" : "#ddd6fe" },
});

export const collapseBtnStyles = (isDark) => ({
  backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
  color: isDark ? "#94a3b8" : "#64748b",
  borderRadius: "8px",
  "&:hover": { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0" },
});

// ── PROGRESS BAR ─────────────────────────────────────────────────────────────

export const progressWrapStyles = { display: "flex", alignItems: "center", gap: 1 };

export const progressCountStyles = (isDark) => ({
  fontSize: 11, color: isDark ? "#475569" : "#94a3b8", whiteSpace: "nowrap",
});

export const progressTrackStyles = (isDark) => ({
  width: 64, height: 4, borderRadius: 2,
  backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
  overflow: "hidden",
});

export const progressFillStyles = (pct, color) => ({
  height: "100%", width: `${pct}%`, borderRadius: 2,
  backgroundColor: color, transition: "width 0.3s ease",
});

export const progressPctStyles = (isDark) => ({
  fontSize: 11, color: isDark ? "#64748b" : "#94a3b8",
  fontWeight: 500, minWidth: 28,
});

// ── DUE DATE CHIP ─────────────────────────────────────────────────────────────

export const dueDateChipStyles = (isDark, isLate) => ({
  display: "inline-flex", alignItems: "center", gap: 0.5,
  px: 1, py: 0.3, borderRadius: "6px",
  backgroundColor: isLate
    ? isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.08)"
    : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
  border: `1px solid ${
    isLate ? "rgba(239,68,68,0.25)"
    : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
  }`,
});

export const dueDateIconStyles = (isDark, isLate) => ({
  fontSize: 11,
  color: isLate ? "#ef4444" : isDark ? "#64748b" : "#94a3b8",
});

export const dueDateTextStyles = (isDark, isLate) => ({
  fontSize: 11, fontWeight: 500,
  color: isLate ? "#ef4444" : isDark ? "#64748b" : "#94a3b8",
});

// ── TASK ROW ─────────────────────────────────────────────────────────────────

export const taskRowStyles = (isDark) => ({
  display: "flex", alignItems: "center",
  ml: "72px", mr: 2, mb: 0.5,
  px: 2, py: 1.2,
  borderRadius: "0 10px 10px 0",
  backgroundColor: isDark ? "rgba(99,102,241,0.04)" : "rgba(99,102,241,0.03)",
  border: `1px solid ${isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.1)"}`,
  borderLeftWidth: "3px",
  borderLeftColor: "rgba(99,102,241,0.35)",
  transition: "background 0.15s",
  "&:hover": {
    backgroundColor: isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.07)",
  },
});

export const taskConnectorStyles = (isDark) => ({
  position: "relative", mr: 1.5,
  "&::before": {
    content: '""', position: "absolute",
    left: -16, top: "50%", width: 14, height: "1px",
    backgroundColor: isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.2)",
  },
});

export const taskTitleStyles = (isDark) => ({
  flex: 1, fontSize: 13, fontWeight: 500,
  color: isDark ? "#e2e8f0" : "#1e293b",
  mr: 2,
});

export const taskMetaBoxStyles = {
  display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap",
};

// ── MILESTONE ROW ─────────────────────────────────────────────────────────────

export const milestoneRowStyles = (isDark, isExpanded, hasTasks) => ({
  display: "flex", alignItems: "center",
  ml: "36px", mr: 2, mb: 0.5,
  px: 2, py: 1.4,
  borderRadius: "0 12px 12px 0",
  backgroundColor: isDark
    ? isExpanded ? "rgba(234,179,8,0.07)" : "rgba(255,255,255,0.03)"
    : isExpanded ? "rgba(234,179,8,0.06)" : "rgba(0,0,0,0.02)",
  border: `1px solid ${
    isDark
      ? isExpanded ? "rgba(234,179,8,0.18)" : "rgba(255,255,255,0.06)"
      : isExpanded ? "rgba(234,179,8,0.2)"  : "rgba(0,0,0,0.06)"
  }`,
  borderLeftWidth: "3px",
  borderLeftColor: isExpanded ? "#ca8a04" : "rgba(202,138,4,0.3)",
  cursor: hasTasks ? "pointer" : "default",
  transition: "all 0.15s",
  "&:hover": hasTasks
    ? { backgroundColor: isDark ? "rgba(234,179,8,0.1)" : "rgba(234,179,8,0.08)" }
    : {},
});

export const milestoneNameStyles = (isDark) => ({
  flex: 1, fontSize: 13, fontWeight: 600,
  color: isDark ? "#fde68a" : "#92400e",
  mr: 2,
});

export const milestoneMetaBoxStyles = {
  display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap",
};

export const milestoneEmptyPillStyles = (isDark) => ({
  display: "flex", alignItems: "center", gap: 0.5,
  px: 1.2, py: 0.3, borderRadius: "6px",
  backgroundColor: isDark ? "rgba(234,179,8,0.1)" : "rgba(234,179,8,0.1)",
  border: "1px solid rgba(234,179,8,0.2)",
});

// ── PROJECT ROW ───────────────────────────────────────────────────────────────

export const projectRowWrapStyles = { mb: 1 };

export const projectRowStyles = (isDark, isExpanded, hasMilestones) => ({
  display: "flex", alignItems: "center",
  mx: 2, px: 2.5, py: 1.8,
  borderRadius: "0 14px 14px 0",
  backgroundColor: isDark
    ? isExpanded ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.04)"
    : isExpanded ? "rgba(99,102,241,0.08)" : "#fff",
  border: `1.5px solid ${
    isDark
      ? isExpanded ? "rgba(99,102,241,0.3)"  : "rgba(255,255,255,0.07)"
      : isExpanded ? "rgba(99,102,241,0.25)" : "rgba(0,0,0,0.07)"
  }`,
  borderLeftWidth: "4px",
  borderLeftColor: isExpanded ? "#6366f1" : "rgba(99,102,241,0.3)",
  boxShadow: isExpanded
    ? isDark ? "0 2px 16px rgba(99,102,241,0.1)" : "0 2px 12px rgba(99,102,241,0.08)"
    : isDark ? "none" : "0 1px 4px rgba(0,0,0,0.04)",
  cursor: hasMilestones ? "pointer" : "default",
  transition: "all 0.18s",
  "&:hover": hasMilestones
    ? {
        backgroundColor: isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.06)",
        borderColor: isDark ? "rgba(99,102,241,0.4)" : "rgba(99,102,241,0.3)",
      }
    : {},
});

export const projectNameStyles = (isDark) => ({
  flex: 1, fontSize: 14, fontWeight: 700,
  color: isDark ? "#e2e8f0" : "#0f172a",
  mr: 2,
});

export const projectMetaBoxStyles = {
  display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap",
};

export const milestonePillStyles = (isDark) => ({
  display: "flex", alignItems: "center", gap: 0.5,
  px: 1.2, py: 0.35, borderRadius: "6px",
  backgroundColor: isDark ? "rgba(99,102,241,0.12)" : "#ede9fe",
  border: "1px solid rgba(99,102,241,0.2)",
});

export const projectExpandedBoxStyles = { mt: 0.5, mb: 0.5 };

export const noMilestonesStyles = (isDark) => ({
  ml: "58px", fontSize: 12,
  color: isDark ? "#475569" : "#94a3b8",
  fontStyle: "italic", py: 1,
});

export const expandIconBoxStyles = (size) => ({
  width: size, mr: size === 22 ? 1.2 : 1,
  display: "flex", alignItems: "center",
});