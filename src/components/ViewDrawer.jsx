import { useEffect, useRef } from "react";
import { IconButton, Box, Typography, Divider } from "@mui/material";
import { Close, TaskAltRounded, AssignmentLateRounded } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const colorMap = {
  ACTIVE:      { bg: "#dcfce7", color: "#16a34a" },
  INACTIVE:    { bg: "#fef2f2", color: "#b91c1c" },
  PENDING:     { bg: "#fffbeb", color: "#b45309" },
  COMPLETED:   { bg: "#f0fdf4", color: "#10b981" },
  IN_PROGRESS: { bg: "#eff6ff", color: "#1d4ed8" },
  LOW:         { bg: "#f0fdfa", color: "#0f766e" },
  MEDIUM:      { bg: "#fdf4ff", color: "#7e22ce" },
  HIGH:        { bg: "#fff1f2", color: "#be123c" },
};

export default function ViewDrawer({ isOpen, onClose, title, status, sections = [], footer }) {
  const drawerRef = useRef(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const bg = isDark ? "#13131f" : "#faf9ff";
  const cardBg = isDark ? "#1a1a2e" : "#fff";
  const borderColor = isDark ? "rgba(139,92,246,0.15)" : "rgba(99,102,241,0.1)";
  const labelColor = isDark ? "#94a3b8" : "#64748b";
  const valueColor = isDark ? "#e2e8f0" : "#1e293b";

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) { document.body.style.overflow = "hidden"; drawerRef.current?.focus(); }
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const renderBadge = (value) => {
    const s = String(value || "").toUpperCase();
    const style = colorMap[s] || { bg: isDark ? "#1e1e2e" : "#f1f5f9", color: isDark ? "#94a3b8" : "#64748b" };
    return (
      <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.6, px: 1.5, py: 0.4, borderRadius: "999px", backgroundColor: style.bg, color: style.color, fontSize: 11, fontWeight: 700, letterSpacing: 0.4, whiteSpace: "nowrap" }}>
        <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: style.color }} />
        {value || "N/A"}
      </Box>
    );
  };

  const isTasksSection = (section) => section.heading?.toLowerCase().includes("assigned task");

  return (
    <>
      <Box onClick={onClose} sx={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,10,40,0.55)", backdropFilter: "blur(3px)", zIndex: 1300 }} />

      <Box ref={drawerRef} tabIndex={-1} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}
        sx={{ position: "fixed", top: 0, right: 0, height: "100vh", width: { xs: "100%", sm: 440 }, backgroundColor: bg, zIndex: 1301, display: "flex", flexDirection: "column", boxShadow: "-8px 0 48px rgba(99,102,241,0.2)", outline: "none", overflow: "hidden" }}>

        {/* HEADER */}
        <Box sx={{ position: "relative", px: 3, pt: 4, pb: 3, background: "linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#a855f7 100%)", overflow: "hidden" }}>
          <Box sx={{ position: "absolute", top: -30, right: -30, width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
          <Box sx={{ position: "absolute", bottom: -20, left: "30%", width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <IconButton onClick={onClose} sx={{ position: "absolute", top: 12, right: 12, color: "rgba(255,255,255,0.8)", backgroundColor: "rgba(255,255,255,0.12)", borderRadius: "10px", width: 34, height: 34, "&:hover": { backgroundColor: "rgba(255,255,255,0.22)" } }}>
            <Close fontSize="small" />
          </IconButton>
          <Typography sx={{ fontWeight: 800, fontSize: 20, color: "#fff", letterSpacing: 0.2 }}>{title}</Typography>
          <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.65)", mt: 0.4 }}>Viewing full details below</Typography>
          {status && (() => {
            const s = status.toUpperCase();
            const style = colorMap[s] || { color: "#94a3b8" };
            return (
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.6, mt: 2, px: 1.8, py: 0.5, borderRadius: "999px", backgroundColor: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                <Box sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: style.color, boxShadow: `0 0 6px ${style.color}` }} />
                {status}
              </Box>
            );
          })()}
        </Box>

        {/* BODY */}
        <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 3, bgcolor: bg, "&::-webkit-scrollbar": { width: 4 }, "&::-webkit-scrollbar-thumb": { borderRadius: 4, backgroundColor: isDark ? "#3d2d6e" : "#c4b5fd" } }}>
          {sections.map((section, si) => (
            <Box key={si} sx={{ mb: 3 }}>
              {section.heading && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Box sx={{ width: 4, height: 18, borderRadius: "4px", background: "linear-gradient(180deg,#6366f1,#a855f7)" }} />
                  <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.4, color: "#8b5cf6", textTransform: "uppercase" }}>
                    {section.heading}
                  </Typography>
                  {isTasksSection(section) && (
                    <Box sx={{ ml: "auto", px: 1.2, py: 0.2, borderRadius: "999px", backgroundColor: isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.1)", color: "#8b5cf6", fontSize: 11, fontWeight: 800 }}>
                      {section.fields[0]?.label === "No tasks assigned" ? "0" : section.fields.length} tasks
                    </Box>
                  )}
                </Box>
              )}

              {isTasksSection(section) ? (
                section.fields[0]?.label === "No tasks assigned" ? (
                  <Box sx={{ borderRadius: "18px", border: `1.5px dashed ${borderColor}`, backgroundColor: cardBg, py: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <AssignmentLateRounded sx={{ fontSize: 36, color: isDark ? "#3d2d6e" : "#c4b5fd" }} />
                    <Typography sx={{ fontSize: 13, color: labelColor, fontWeight: 600 }}>No tasks assigned yet</Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {section.fields.map((field, fi) => {
                      const s = String(field.value || "").toUpperCase();
                      const style = colorMap[s] || { bg: isDark ? "#1e1e2e" : "#f1f5f9", color: "#64748b" };
                      return (
                        <Box key={fi} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1.5, borderRadius: "14px", backgroundColor: cardBg, border: `1px solid ${borderColor}`, boxShadow: "0 2px 8px rgba(99,102,241,0.05)", transition: "all 0.15s", "&:hover": { boxShadow: "0 4px 16px rgba(99,102,241,0.12)", transform: "translateY(-1px)" } }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Box sx={{ width: 34, height: 34, borderRadius: "10px", backgroundColor: style.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <TaskAltRounded sx={{ fontSize: 17, color: style.color }} />
                            </Box>
                            <Typography sx={{ fontSize: 13, fontWeight: 700, color: valueColor, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {field.label}
                            </Typography>
                          </Box>
                          {renderBadge(field.value)}
                        </Box>
                      );
                    })}
                  </Box>
                )
              ) : (
                <Box sx={{ borderRadius: "18px", border: `1px solid ${borderColor}`, backgroundColor: cardBg, boxShadow: "0 2px 12px rgba(99,102,241,0.06)", overflow: "hidden" }}>
                  {section.fields.map((field, fi) => (
                    <Box key={fi}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2.5, py: 1.8, transition: "background 0.15s", "&:hover": { backgroundColor: isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.04)" } }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: isDark ? "rgba(139,92,246,0.4)" : "rgba(99,102,241,0.25)" }} />
                          <Typography sx={{ fontSize: 13, color: labelColor, fontWeight: 600 }}>{field.label}</Typography>
                        </Box>
                        {field.badge ? renderBadge(field.value) : (
                          <Typography sx={{ fontSize: 13, color: valueColor, fontWeight: 600, textAlign: "right", maxWidth: "55%", wordBreak: "break-word" }}>
                            {field.value || "—"}
                          </Typography>
                        )}
                      </Box>
                      {fi < section.fields.length - 1 && <Divider sx={{ borderColor: isDark ? "rgba(139,92,246,0.1)" : "rgba(99,102,241,0.07)", mx: 2 }} />}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>

        {footer && (
          <Box sx={{ px: 3, py: 2.5, borderTop: `1px solid ${borderColor}`, backgroundColor: cardBg }}>
            {footer}
          </Box>
        )}
      </Box>
    </>
  );
}
