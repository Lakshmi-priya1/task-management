// styles/projectStyles.js

export const getProjectStyles = (isDark) => ({

  // ── Toolbar row ──────────────────────────────────────
  toolbarSx: {
    display: "flex", gap: 2,
    flexWrap: "wrap", mb: 2,
    alignItems: "center",
  },

  // ── Search input ─────────────────────────────────────
  inputSx: {
    minWidth: 240,
    "& .MuiOutlinedInput-root": { borderRadius: "16px" },
  },

  // ── Status filter ────────────────────────────────────
  filterSx: {
    minWidth: 180,
    "& .MuiOutlinedInput-root": { borderRadius: "16px" },
  },

  // ── Add button ───────────────────────────────────────
  addButtonSx: {
    ml: "auto", px: 2.5, py: 1,
    borderRadius: "14px", fontWeight: 700,
    background: "linear-gradient(135deg,#6366f1,#a855f7)",
    color: "#fff", textTransform: "none",
    "&:hover": { opacity: 0.88 },
  },

  // ── Table card ───────────────────────────────────────
  cardSx: {
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 12px 30px rgba(0,0,0,.05)",
  },

  // ── Card header ──────────────────────────────────────
  cardHeaderSx: {
    px: 3, py: 2,
    borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,.06)"}`,
    display: "flex", alignItems: "center", gap: 1,
  },

  // ── Card header title ────────────────────────────────
  cardTitleSx: {
    fontWeight: 800,
    color: isDark ? "#e0e7ff" : "#312e81",
  },

  // ── Assign drawer container ──────────────────────────
  drawerBoxSx: {
    width: "100%",  
     height: "100%",
    bgcolor: "background.paper",
    display: "flex", flexDirection: "column",
  },

  // ── Drawer header ────────────────────────────────────
  drawerHeaderSx: {
    p: 3, display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // ── Drawer title ─────────────────────────────────────
  drawerTitleSx: {
    fontWeight: 800, fontSize: 22,
    color: "text.primary",
  },

  // ── Drawer subtitle ──────────────────────────────────
  drawerSubtitleSx: {
    fontSize: 13, color: "text.secondary", mt: 0.5,
  },

  // ── Section label ────────────────────────────────────
  sectionLabelSx: {
    fontWeight: 700, mb: 1.5, color: "#6366f1",
  },

  // ── Empty text ───────────────────────────────────────
  emptyTextSx: {
    color: "#94a3b8", fontSize: 14,
  },

  // ── Assigned chip ────────────────────────────────────
  chipSx: {
    background: "#ede9fe", color: "#6366f1", fontWeight: 700,
    "& .MuiChip-deleteIcon": { color: "#8b5cf6" },
  },

  // ── Drawer footer ────────────────────────────────────
  drawerFooterSx: {
    p: 3, mt: "auto",
  },

  // ── Assign button ────────────────────────────────────
  assignButtonSx: {
    py: 1.4, borderRadius: "14px", fontWeight: 700,
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
  },

  // ── Back button ──────────────────────────────────────
  backButtonSx: {
    py: 1.2, borderRadius: "14px", fontWeight: 700,
    borderColor: "#cbd5e1", color: "#475569",
  },

  // ── Success alert ────────────────────────────────────
  alertSx: {
    mb: 2, borderRadius: "14px",
  },

  // ── Extra action — assign team ───────────────────────
  assignTeamAction: {
    label: "Assign Team",
    color: "#0891b2",
    bg: "rgba(8,145,178,0.07)",
  },
});