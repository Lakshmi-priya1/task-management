export const getOrganizationStyles = (isDark) => ({
  toolbarSx: {
    display: "flex", gap: 2, flexWrap: "wrap", mb: 2, alignItems: "center",
  },
  inputSx: {
    minWidth: 240,
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
  cardIconSx: { color: "#7c3aed" },
  cardTitleSx: {
    fontWeight: 800,
    color: isDark ? "#e0e7ff" : "#312e81",
  },
});
