// styles/loginStyles.js

if (typeof document !== "undefined" && !document.getElementById("login-global-styles")) {
  const el = document.createElement("style");
  el.id = "login-global-styles";
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');

    @keyframes blobDrift1 {
      0%,100% { transform: translate(0,0) scale(1); }
      40%     { transform: translate(50px,-40px) scale(1.1); }
      70%     { transform: translate(-30px,60px) scale(0.92); }
    }
    @keyframes blobDrift2 {
      0%,100% { transform: translate(0,0) scale(1.05); }
      50%     { transform: translate(-60px,35px) scale(0.9); }
    }
    @keyframes blobDrift3 {
      0%,100% { transform: translate(-50%,-50%) scale(1); }
      33%     { transform: translate(-50%,-50%) scale(1.15); }
      66%     { transform: translate(-50%,-50%) scale(0.88); }
    }
    @keyframes spinCW  { to { transform: rotate(360deg);  } }
    @keyframes spinCCW { to { transform: rotate(-360deg); } }
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(20px); }
      to   { opacity:1; transform:translateY(0);    }
    }
    @keyframes softPulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
      50%     { box-shadow: 0 0 0 6px rgba(99,102,241,0.15); }
    }

    .lp-fade-up-1 { animation: fadeUp 0.55s 0.05s cubic-bezier(0.16,1,0.3,1) both; }
    .lp-fade-up-2 { animation: fadeUp 0.55s 0.15s cubic-bezier(0.16,1,0.3,1) both; }
    .lp-fade-up-3 { animation: fadeUp 0.55s 0.25s cubic-bezier(0.16,1,0.3,1) both; }

    .lp-social-btn {
      transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1),
                  box-shadow 0.22s ease,
                  background 0.2s ease !important;
    }
    .lp-social-btn:hover {
      transform: translateY(-4px) scale(1.08) !important;
      box-shadow: 0 8px 20px rgba(99,102,241,0.15) !important;
      background: #f5f3ff !important;
    }

    .lp-submit-btn { transition: transform 0.2s ease, box-shadow 0.2s ease !important; }
    .lp-submit-btn:not(:disabled):hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 12px 32px rgba(99,102,241,0.38) !important;
    }
    .lp-submit-btn:not(:disabled):active { transform: translateY(0) !important; }

    /* Light autofill fix */
    .lp-input input:-webkit-autofill,
    .lp-input input:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0 100px #f8f7ff inset !important;
      -webkit-text-fill-color: #1e1b4b !important;
    }
  `;
  document.head.appendChild(el);
}

export const loginStyles = {
  // ── Root ──────────────────────────────────────────
  root: {
    height: "100vh",
    maxHeight: "100vh",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
    fontFamily: "'Outfit', sans-serif",
    background: "#fff",
  },

  // ══════════════════════════════════════════════════
  // LEFT PANEL — soft lavender with blobs + illustration
  // ══════════════════════════════════════════════════
  leftPanel: {
    display: { xs: "none", md: "flex" },
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(145deg, #eef2ff 0%, #f5f3ff 50%, #faf5ff 100%)",
  },

  blob1: {
    position: "absolute",
    width: 480, height: 480,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 68%)",
    top: "0%", left: "-5%",
    animation: "blobDrift1 14s ease-in-out infinite",
    filter: "blur(50px)",
    pointerEvents: "none",
  },
  blob2: {
    position: "absolute",
    width: 380, height: 380,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(168,85,247,0.14) 0%, transparent 68%)",
    bottom: "5%", right: "-5%",
    animation: "blobDrift2 17s ease-in-out infinite",
    filter: "blur(55px)",
    pointerEvents: "none",
  },
  blob3: {
    position: "absolute",
    width: 280, height: 280,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 68%)",
    top: "50%", left: "50%",
    animation: "blobDrift3 20s ease-in-out infinite",
    filter: "blur(60px)",
    pointerEvents: "none",
  },

  illustrationWrap: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flex: 1,
  },

  orbitOuter: {
    position: "absolute",
    width: 340, height: 340,
    borderRadius: "50%",
    border: "1.5px solid rgba(99,102,241,0.15)",
    animation: "spinCW 22s linear infinite",
    "&::after": {
      content: '""', position: "absolute",
      width: 10, height: 10, borderRadius: "50%",
      background: "#6366f1",
      top: -5, left: "50%", transform: "translateX(-50%)",
      boxShadow: "0 0 12px 4px rgba(99,102,241,0.45)",
    },
  },
  orbitMid: {
    position: "absolute",
    width: 240, height: 240,
    borderRadius: "50%",
    border: "1.5px solid rgba(168,85,247,0.12)",
    animation: "spinCCW 14s linear infinite",
    "&::after": {
      content: '""', position: "absolute",
      width: 8, height: 8, borderRadius: "50%",
      background: "#a855f7",
      bottom: -4, left: "50%", transform: "translateX(-50%)",
      boxShadow: "0 0 10px 3px rgba(168,85,247,0.45)",
    },
  },

  leftTagline: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    pb: 5,
    px: 5,
  },
  leftTaglineHeading: {
    fontFamily: "'DM Serif Display', serif",
    fontStyle: "italic",
    fontSize: 26,
    color: "#3730a3",
    lineHeight: 1.3,
    letterSpacing: "-0.3px",
  },
  leftTaglineSub: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 12,
    color: "#a5b4fc",
    mt: 1,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },

  // ══════════════════════════════════════════════════
  // RIGHT PANEL — pure white, clean
  // ══════════════════════════════════════════════════
  rightPanel: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    px: { xs: 3, sm: 5 },
    overflow: "hidden",
    background: "#ffffff",
  },

  // Subtle corner accents
  rightBlobTR: {
    position: "absolute", top: -60, right: -60,
    width: 220, height: 220, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
    filter: "blur(30px)", pointerEvents: "none",
  },
  rightBlobBL: {
    position: "absolute", bottom: -60, left: -60,
    width: 200, height: 200, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)",
    filter: "blur(30px)", pointerEvents: "none",
  },

  formWrapper: {
    width: "100%", maxWidth: 420, zIndex: 2,
  },

  heading: {
    fontFamily: "'DM Serif Display', serif",
    color: "#1e1b4b",
    fontSize: { xs: 36, sm: 46 },
    fontWeight: 400,
    lineHeight: 1.05,
    mb: 0.5,
    letterSpacing: "-1.5px",
  },
  headingItalic: {
    fontStyle: "italic",
    background: "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subheading: {
    fontFamily: "'Outfit', sans-serif",
    color: "#6b7280",
    fontSize: 14,
    mb: 4,
    fontWeight: 400,
    lineHeight: 1.6,
  },

  // Card — white with soft shadow, no blur needed on white bg
  card: {
    p: { xs: 3, sm: "28px 32px" },
    borderRadius: "22px",
    background: "#ffffff",
    border: "1px solid #ede9fe",
    boxShadow: "0 4px 6px rgba(99,102,241,0.04), 0 20px 50px rgba(99,102,241,0.08)",
  },

  // Social buttons
  socialRow: {
    display: "flex", justifyContent: "center", gap: 2, mb: 3,
  },
  socialBtn: {
    width: 46, height: 46,
    borderRadius: "13px",
    border: "1px solid #e5e7eb",
    background: "#fafafa",
    color: "#6b7280",
  },

  divider: {
    mb: 3,
    "&::before, &::after": { borderColor: "#f3f4f6" },
    color: "#9ca3af",
    fontSize: 10,
    fontFamily: "'Outfit', sans-serif",
    letterSpacing: "0.12em",
  },

  // Inputs
  inputSx: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "13px",
      background: "#fafafa",
      fontFamily: "'Outfit', sans-serif",
      fontSize: 14,
      color: "#1e1b4b",
      transition: "box-shadow 0.2s",
      "& fieldset":             { borderColor: "#e5e7eb" },
      "&:hover fieldset":       { borderColor: "#a5b4fc" },
      "&.Mui-focused fieldset": { borderColor: "#6366f1", borderWidth: "1.5px" },
      "&.Mui-focused":          { boxShadow: "0 0 0 3px rgba(99,102,241,0.12)" },
    },
    "& .MuiFormHelperText-root": {
      fontFamily: "'Outfit', sans-serif",
      fontSize: 12,
    },
    "& input::placeholder": { color: "#9ca3af", opacity: 1 },
  },

  adornmentIcon:        { color: "#6366f1" },
  adornmentIconMuted:   { color: "#d1d5db" },
  visibilityIconActive: { color: "#6366f1" },

  rememberRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3,
  },

  checkboxSx: {
    color: "#d1d5db",
    "&.Mui-checked": { color: "#6366f1" },
    "& .MuiSvgIcon-root": { fontSize: 18 },
  },

  rememberLabel: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 13,
    color: "#6b7280",
  },

  forgotLink: {
    textDecoration: "none",
    fontFamily: "'Outfit', sans-serif",
    color: "#6366f1",
    fontSize: 13,
    fontWeight: 600,
  },

  submitButton: {
    height: 50,
    borderRadius: "13px",
    color: "#fff",
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: "0.08em",
    fontFamily: "'Outfit', sans-serif",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    animation: "softPulse 3s ease-in-out infinite",
    "&:disabled": {
      background: "#e0e7ff",
      color: "#a5b4fc",
      animation: "none",
    },
  },

  signupRow: {
    mt: "14px",
    textAlign: "center",
    fontFamily: "'Outfit', sans-serif",
    fontSize: 13,
    color: "#9ca3af",
  },

  signupLink: {
    color: "#6366f1",
    fontWeight: 600,
    textDecoration: "none",
    ml: "4px",
  },
};