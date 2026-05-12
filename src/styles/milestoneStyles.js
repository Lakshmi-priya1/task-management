// styles/milestoneStyles.js

export const milestoneStyles = {
  // ── Toolbar ────────────────────────────────────────
  toolbar: {
    display: "flex", gap: 2, flexWrap: "wrap", mb: 2, alignItems: "center",
  },

  searchInput: {
    minWidth: 240,
    "& .MuiOutlinedInput-root": { borderRadius: "16px" },
  },

  projectFilterControl: {
    minWidth: 180,
    "& .MuiOutlinedInput-root": { borderRadius: "16px" },
  },

  addButton: {
    ml: "auto", px: 2.5, py: 1,
    borderRadius: "14px", fontWeight: 700,
    background: "linear-gradient(135deg,#6366f1,#a855f7)",
    color: "#fff", textTransform: "none",
    "&:hover": { opacity: 0.88 },
  },

  // ── Table card ─────────────────────────────────────
  tableCard: {
    borderRadius: "24px", overflow: "hidden",
    boxShadow: "0 12px 30px rgba(0,0,0,.05)",
  },

  tableCardHeader: (isDark) => ({
    px: 3, py: 2,
    borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,.06)"}`,
    display: "flex", alignItems: "center", gap: 1,
  }),

  tableCardTitle: (isDark) => ({
    fontWeight: 800,
    color: isDark ? "#e0e7ff" : "#312e81",
  }),

  flagIcon: { color: "#6366f1" },

  // ── Assign drawer ──────────────────────────────────
  // NOTE: drawerPaper is no longer used as the outer wrapper in JSX;
  // layout is handled by the Drawer sx MuiPaper-root override directly.
  drawerPaper: {
    width: 420,
    background: "linear-gradient(180deg,#f8fafc,#ffffff)",
  },

  drawerHeader: {
    p: 3,
    flexShrink: 0,          // ← never shrink; always full height
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },

  drawerTitle: {
    fontWeight: 800, fontSize: 22, color: "#312e81",
  },

  drawerSubtitle: {
    fontSize: 13, color: "#64748b", mt: 0.5,
  },

  sectionLabel: {
    fontWeight: 700, mb: 1.5, color: "#6366f1",
  },

  emptyText: {
    color: "#94a3b8", fontSize: 14,
  },

  assignedChip: {
    background: "#ede9fe", color: "#6366f1", fontWeight: 700,
    "& .MuiChip-deleteIcon": { color: "#8b5cf6" },
  },

  successBanner: {
    mx: 3, mt: 2, p: 2, borderRadius: "12px",
    background: "#f0fdf4", border: "1px solid #bbf7d0",
    display: "flex", alignItems: "center", gap: 1.5,
  },

  successIcon: { color: "#16a34a", fontSize: 20 },

  successText: {
    fontSize: 13, color: "#15803d", fontWeight: 600,
  },

  assignButton: {
    py: 1.4, borderRadius: "14px", fontWeight: 700,
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
  },

  closeButton: {
    py: 1.2, borderRadius: "14px", fontWeight: 700,
    borderColor: "#e2e8f0", color: "#64748b",
    "&:hover": { borderColor: "#6366f1", color: "#6366f1", background: "#f5f3ff" },
  },

  // Footer: flexShrink 0 so it never shrinks; no mt:"auto" needed
  drawerButtons: {
    p: 3,
    flexShrink: 0,
    display: "flex", flexDirection: "column", gap: 1.5,
  },
};