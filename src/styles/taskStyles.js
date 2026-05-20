export const taskStyles = {
  // ── Toolbar ────────────────────────────────────────
  toolbar: {
    display: "flex",
    gap: 2,
    flexWrap: "wrap",
    mb: 2,
    alignItems: "center",
  },

  searchInput: {
    minWidth: 240,
    "& .MuiOutlinedInput-root": {
      borderRadius: "16px",
    },
  },

  statusFilterControl: {
    minWidth: 180,
    "& .MuiOutlinedInput-root": {
      borderRadius: "16px",
    },
  },

  addButton: {
    ml: "auto",
    px: 2.5,
    py: 1,
    borderRadius: "14px",
    fontWeight: 700,
    background: "linear-gradient(135deg,#6366f1,#a855f7)",
    color: "#fff",
    textTransform: "none",

    "&:hover": {
      opacity: 0.88,
    },
  },

  // ── Table card ─────────────────────────────────────
  tableCard: {
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 12px 30px rgba(0,0,0,.05)",
  },

  tableCardHeader: (isDark) => ({
    px: 3,
    py: 2,
    borderBottom: `1px solid ${
      isDark
        ? "rgba(255,255,255,0.06)"
        : "rgba(0,0,0,.06)"
    }`,
    display: "flex",
    alignItems: "center",
    gap: 1,
  }),

  tableCardTitle: (isDark) => ({
    fontWeight: 800,
    color: isDark ? "#e0e7ff" : "#312e81",
  }),

  taskIcon: {
    color: "#6366f1",
  },

  // ── Drawer ─────────────────────────────────────────
  drawerSx: (isDark) => ({
    "& .MuiDrawer-root": {
      width: 420,
    },

    "& .MuiPaper-root": {
      width: 420,
      maxWidth: 420,
      backgroundColor: isDark ? "#13131f" : "#faf9ff",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      overflowX: "hidden",
    },
  }),

  drawerContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflow: "hidden",
  },

  drawerHeader: {
    p: 3,
    flexShrink: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  drawerTitle: {
    fontWeight: 800,
    fontSize: 22,
    color: "text.primary",
  },

  drawerSubtitle: {
    fontSize: 13,
    color: "text.secondary",
    mt: 0.5,
  },

  drawerScrollableContent: {
    flex: 1,
    overflowY: "auto",
  },

  sectionContainer: {
    p: 3,
  },

  addEmployeeSection: {
    px: 3,
    pt: 3,
    pb: 3,
  },

  sectionLabel: {
    fontWeight: 700,
    mb: 1.5,
    color: "#6366f1",
  },

  addEmployeeLabel: {
    fontWeight: 700,
    mb: 1,
    color: "#6366f1",
  },

  emptyText: {
    color: "#94a3b8",
    fontSize: 14,
  },

  chipContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: 1,
  },

  assignedChip: {
    background: "#ede9fe",
    color: "#6366f1",
    fontWeight: 700,

    "& .MuiChip-deleteIcon": {
      color: "#8b5cf6",
    },

    maxWidth: 130,

    "& .MuiChip-label": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },

  moreChip: (isDark) => ({
    backgroundColor: isDark
      ? "rgba(99,102,241,0.15)"
      : "#ede9fe",

    color: "#6366f1",
    fontWeight: 700,
    fontSize: 12,
    cursor: "pointer",

    "&:hover": {
      backgroundColor: isDark
        ? "rgba(99,102,241,0.25)"
        : "#ddd6fe",
    },
  }),

  // ── Banner ─────────────────────────────────────────
  banner: (assignSuccess, isDark) => {
    const isSuccessBanner = assignSuccess?.type === "success";

    return {
      mx: 2,
      mb: 1.5,
      px: 2,
      py: 1,
      minHeight: 44,

      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",

      borderRadius: 2,

      visibility: assignSuccess ? "visible" : "hidden",

      backgroundColor: isSuccessBanner
        ? isDark
          ? "rgba(34,197,94,0.12)"
          : "#f0fdf4"
        : isDark
        ? "rgba(239,68,68,0.12)"
        : "#fef2f2",

      border: `1px solid ${
        isSuccessBanner
          ? isDark
            ? "rgba(34,197,94,0.30)"
            : "#bbf7d0"
          : isDark
          ? "rgba(239,68,68,0.30)"
          : "#fecaca"
      }`,

      transition:
        "background-color 0.25s ease, border-color 0.25s ease",
    };
  },

  bannerContent: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },

  bannerText: (assignSuccess, isDark) => {
    const isSuccessBanner = assignSuccess?.type === "success";

    return {
      fontSize: 13,
      fontWeight: 500,
      lineHeight: 1.3,

      color: isSuccessBanner
        ? isDark
          ? "#86efac"
          : "#16a34a"
        : isDark
        ? "#fca5a5"
        : "#dc2626",
    };
  },

  bannerCloseButton: (assignSuccess, isDark) => {
    const isSuccessBanner = assignSuccess?.type === "success";

    return {
      color: isSuccessBanner
        ? isDark
          ? "#86efac"
          : "#16a34a"
        : isDark
        ? "#fca5a5"
        : "#dc2626",

      p: 0.5,
      flexShrink: 0,
    };
  },

  // ── Footer ─────────────────────────────────────────
  drawerFooter: {
    p: 3,
    pt: 2,
    flexShrink: 0,
    borderTop: "1px solid rgba(0,0,0,0.08)",
  },

  assignButton: {
    py: 1.4,
    borderRadius: "14px",
    fontWeight: 700,
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
  },

  backButton: {
    py: 1.2,
    borderRadius: "14px",
    fontWeight: 700,
    borderColor: "#cbd5e1",
    color: "#475569",
  },
  bannerIcon: (isSuccess, isDark) => ({
  fontSize: 18,
  color: isSuccess
    ? isDark ? "#86efac" : "#16a34a"
    : isDark ? "#fca5a5" : "#dc2626",
}),
};