import { useEffect, useRef } from "react";
import { IconButton, Box, Typography, Divider } from "@mui/material";
import { Close, Visibility, TaskAltRounded, AssignmentLateRounded } from "@mui/icons-material";

function ViewDrawer({
  isOpen,
  onClose,
  title,
  status,
  sections = [],
  footer,
}) {
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      drawerRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const colorMap = {
   
  // Status
 ACTIVE:      { bg: "#f0fdf4", color: "#15803d" },  // green
  INACTIVE:    { bg: "#fef2f2", color: "#b91c1c" },  // red
  PENDING:     { bg: "#fffbeb", color: "#b45309" },  // amber
  COMPLETED:   { bg: "#f3fff6", color: "#05c663" },  // purple
  IN_PROGRESS: { bg: "#eff6ff", color: "#1d4ed8" },  // blue
  

  // Priority
  LOW:         { bg: "#f0fdfa", color: "#0f766e" },  // teal
  MEDIUM:      { bg: "#fdf4ff", color: "#7e22ce" },  // violet
  HIGH:        { bg: "#fff1f2", color: "#be123c" },  
  };

  const renderBadge = (value) => {
    const s = String(value || "").toUpperCase();
    const style = colorMap[s] || { bg: "#f1f5f9", color: "#64748b" };
    return (
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.6,
          px: 1.5,
          py: 0.4,
          borderRadius: "999px",
          backgroundColor: style.bg,
          color: style.color,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.4,
          whiteSpace: "nowrap",
        }}
      >
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: style.color,
          }}
        />
        {value || "N/A"}
      </Box>
    );
  };

  const renderValue = (field) => {
    if (field.badge) return renderBadge(field.value);
    return (
      <Typography
        sx={{
          fontSize: 13,
          color: "#1e293b",
          fontWeight: 600,
          textAlign: "right",
          maxWidth: "55%",
          wordBreak: "break-word",
        }}
      >
        {field.value || "—"}
      </Typography>
    );
  };

  /* ── Detect if section is the tasks section ── */
  const isTasksSection = (section) =>
    section.heading?.toLowerCase().includes("assigned task");

  return (
    <>
      {/* Backdrop */}
      <Box
        onClick={onClose}
        sx={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(15,10,40,0.45)",
          backdropFilter: "blur(3px)",
          zIndex: 1300,
        }}
      />

      {/* Drawer */}
      <Box
        ref={drawerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: { xs: "100%", sm: 440 },
          backgroundColor: "#faf9ff",
          zIndex: 1301,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 48px rgba(99,102,241,0.18)",
          outline: "none",
          overflow: "hidden",
        }}
      >
        {/* ── HERO HEADER ── */}
        <Box
          sx={{
            position: "relative",
            px: 3,
            pt: 4,
            pb: 3,
            background:
              "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)",
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <Box sx={{ position: "absolute", top: -30, right: -30, width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
          <Box sx={{ position: "absolute", bottom: -20, left: "30%", width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

          {/* Close button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              color: "rgba(255,255,255,0.8)",
              backgroundColor: "rgba(255,255,255,0.12)",
              borderRadius: "10px",
              width: 34,
              height: 34,
              "&:hover": { backgroundColor: "rgba(255,255,255,0.22)", color: "#fff" },
            }}
          >
            <Close fontSize="small" />
          </IconButton>

          

          <Typography sx={{ fontWeight: 800, fontSize: 20, color: "#fff", letterSpacing: 0.2 }}>
            {title}
          </Typography>

          <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.65)", mt: 0.4 }}>
            Viewing full details below
          </Typography>

          {/* Status pill */}
          {status && (() => {
            const s = status.toUpperCase();
            const style = colorMap[s] || { bg: "#f1f5f9", color: "#64748b" };
            return (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.6,
                  mt: 2,
                  px: 1.8,
                  py: 0.5,
                  borderRadius: "999px",
                  backgroundColor: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    backgroundColor: style.color,
                    boxShadow: `0 0 6px ${style.color}`,
                  }}
                />
                {status}
              </Box>
            );
          })()}
        </Box>

        {/* ── BODY ── */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 3,
            py: 3,
            "&::-webkit-scrollbar": { width: 4 },
            "&::-webkit-scrollbar-thumb": { borderRadius: 4, backgroundColor: "#c4b5fd" },
          }}
        >
          {sections.map((section, si) => (
            <Box key={si} sx={{ mb: 3 }}>

              {/* Section heading */}
              {section.heading && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Box
                    sx={{
                      width: 4,
                      height: 18,
                      borderRadius: "4px",
                      background: "linear-gradient(180deg,#6366f1,#a855f7)",
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: 1.4,
                      color: "#6366f1",
                      textTransform: "uppercase",
                    }}
                  >
                    {section.heading}
                  </Typography>

                  {/* Task count badge */}
                  {isTasksSection(section) && (
                    <Box
                      sx={{
                        ml: "auto",
                        px: 1.2,
                        py: 0.2,
                        borderRadius: "999px",
                        backgroundColor: "rgba(99,102,241,0.1)",
                        color: "#6366f1",
                        fontSize: 11,
                        fontWeight: 800,
                      }}
                    >
                      {section.fields[0]?.label === "No tasks assigned"
                        ? "0"
                        : section.fields.length}{" "}
                      tasks
                    </Box>
                  )}
                </Box>
              )}

              {/* ── TASKS SECTION — special card layout ── */}
              {isTasksSection(section) ? (
                section.fields[0]?.label === "No tasks assigned" ? (
                  /* Empty state */
                  <Box
                    sx={{
                      borderRadius: "18px",
                      border: "1.5px dashed rgba(99,102,241,0.2)",
                      backgroundColor: "#fff",
                      py: 4,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <AssignmentLateRounded sx={{ fontSize: 36, color: "#c4b5fd" }} />
                    <Typography sx={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>
                      No tasks assigned yet
                    </Typography>
                  </Box>
                ) : (
                  /* Task cards grid */
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {section.fields.map((field, fi) => {
                      const s = String(field.value || "").toUpperCase();
                      const style = colorMap[s] || { bg: "#f1f5f9", color: "#64748b" };
                      return (
                        <Box
                          key={fi}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            px: 2,
                            py: 1.5,
                            borderRadius: "14px",
                            backgroundColor: "#fff",
                            border: "1px solid rgba(99,102,241,0.1)",
                            boxShadow: "0 2px 8px rgba(99,102,241,0.05)",
                            transition: "all 0.15s",
                            "&:hover": {
                              boxShadow: "0 4px 16px rgba(99,102,241,0.12)",
                              borderColor: "rgba(99,102,241,0.25)",
                              transform: "translateY(-1px)",
                            },
                          }}
                        >
                          {/* Left — icon + task name */}
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 34,
                                height: 34,
                                borderRadius: "10px",
                                backgroundColor: style.bg,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <TaskAltRounded sx={{ fontSize: 17, color: style.color }} />
                            </Box>
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#1e293b",
                                maxWidth: 200,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {field.label}
                            </Typography>
                          </Box>

                          {/* Right — status badge */}
                          {renderBadge(field.value)}
                        </Box>
                      );
                    })}
                  </Box>
                )
              ) : (
                /* ── NORMAL SECTION — label/value rows ── */
                <Box
                  sx={{
                    borderRadius: "18px",
                    border: "1px solid rgba(99,102,241,0.1)",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 12px rgba(99,102,241,0.06)",
                    overflow: "hidden",
                  }}
                >
                  {section.fields.map((field, fi) => (
                    <Box key={fi}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          px: 2.5,
                          py: 1.8,
                          transition: "background 0.15s",
                          "&:hover": { backgroundColor: "rgba(99,102,241,0.04)" },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box
                            sx={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              backgroundColor: "rgba(99,102,241,0.25)",
                            }}
                          />
                          <Typography sx={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>
                            {field.label}
                          </Typography>
                        </Box>
                        {renderValue(field)}
                      </Box>
                      {fi < section.fields.length - 1 && (
                        <Divider sx={{ borderColor: "rgba(99,102,241,0.07)", mx: 2 }} />
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>

        {/* ── FOOTER ── */}
        {footer && (
          <Box
            sx={{
              px: 3,
              py: 2.5,
              borderTop: "1px solid rgba(99,102,241,0.1)",
              backgroundColor: "#fff",
            }}
          >
            {footer}
          </Box>
        )}
      </Box>
    </>
  );
}

export default ViewDrawer;