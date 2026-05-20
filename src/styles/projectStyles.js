export const getProjectStyles = (isDark) => ({
  toolbarSx: {
    display: "flex", gap: 2, flexWrap: "wrap", mb: 2, alignItems: "center",
  },
  inputSx: {
    minWidth: 240,
    "& .MuiOutlinedInput-root": { borderRadius: "16px" },
  },
  filterSx: {
    minWidth: 180,
    "& .MuiOutlinedInput-root": { borderRadius: "16px" },
  },
  addButtonSx: {
    ml: "auto", px: 2.5, py: 1,
    borderRadius: "14px", fontWeight: 700,
    background: "linear-gradient(135deg,#6366f1,#a855f7)",
    color: "#fff", textTransform: "none",
    "&:hover": { opacity: 0.88 },
  },
  cardSx: {
    borderRadius: "24px", overflow: "hidden",
    boxShadow: "0 12px 30px rgba(0,0,0,.05)",
  },
  cardHeaderSx: {
    px: 3, py: 2,
    borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,.06)"}`,
    display: "flex", alignItems: "center", gap: 1,
  },
  cardTitleSx: {
    fontWeight: 800,
    color: isDark ? "#e0e7ff" : "#312e81",
  },
  drawerHeaderSx: {
    p: 3, flexShrink: 0,
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  drawerTitleSx: { fontWeight: 800, fontSize: 22, color: "text.primary" },
  drawerSubtitleSx: { fontSize: 13, color: "text.secondary", mt: 0.5 },
  sectionLabelSx: { fontWeight: 700, mb: 1.5, color: "#6366f1" },
  emptyTextSx: { color: "#94a3b8", fontSize: 14 },
  chipSx: {
    background: "#ede9fe", color: "#6366f1", fontWeight: 700,
    "& .MuiChip-deleteIcon": { color: "#8b5cf6" },
  },
  moreChipSx: (isDark) => ({
    backgroundColor: isDark ? "rgba(99,102,241,0.15)" : "#ede9fe",
    color: "#6366f1", fontWeight: 700, fontSize: 12, cursor: "pointer",
    "&:hover": { backgroundColor: isDark ? "rgba(99,102,241,0.25)" : "#ddd6fe" },
  }),
  drawerFooterSx: {
    p: 3, pt: 2, flexShrink: 0,
    borderTop: "1px solid rgba(0,0,0,0.08)",
  },
  assignButtonSx: {
    py: 1.4, borderRadius: "14px", fontWeight: 700,
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
  },
  backButtonSx: {
    py: 1.2, borderRadius: "14px", fontWeight: 700,
    borderColor: "#cbd5e1", color: "#475569",
  },
  banner: (isSuccess, isDark) => ({
    mx: 2, mb: 1.5, px: 2, py: 1, minHeight: 44,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    borderRadius: 2,
    backgroundColor: isSuccess
      ? isDark ? "rgba(34,197,94,0.12)"  : "#f0fdf4"
      : isDark ? "rgba(239,68,68,0.12)"  : "#fef2f2",
    border: `1px solid ${isSuccess
      ? isDark ? "rgba(34,197,94,0.30)"  : "#bbf7d0"
      : isDark ? "rgba(239,68,68,0.30)"  : "#fecaca"}`,
    transition: "background-color 0.25s ease, border-color 0.25s ease",
  }),
  bannerText: (isSuccess, isDark) => ({
    fontSize: 13, fontWeight: 500, lineHeight: 1.3,
    color: isSuccess
      ? isDark ? "#86efac" : "#16a34a"
      : isDark ? "#fca5a5" : "#dc2626",
  }),
  bannerIcon: (isSuccess, isDark) => ({
    fontSize: 16,
    color: isSuccess
      ? isDark ? "#86efac" : "#16a34a"
      : isDark ? "#fca5a5" : "#dc2626",
  }),
});