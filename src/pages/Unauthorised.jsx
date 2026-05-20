import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

/* ── design tokens ───────────────────────────────────── */
const P = {
  bg: "#f0ebff",
  bgCard: "#ffffff",
  primary: "#7c3aed",
  mid: "#9d60f8",
  soft: "#c4b5fd",
  softer: "#ede9fe",
  border: "#ddd6fe",
  text: "#2e1065",
  muted: "#6d5c8e",
  chip: "#f3eeff",
};

/* ── tiny keyframes injected once ───────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

  html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  body {
    overflow: hidden;
  }

  @keyframes floatA {
    0%,100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-22px) scale(1.04); }
  }

  @keyframes floatB {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-14px) rotate(6deg); }
  }

  @keyframes floatC {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-18px) rotate(-5deg); }
  }

  @keyframes spinSlow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes pulseRing {
    0% {
      transform: scale(0.92);
      opacity: 0.6;
    }
    70% {
      transform: scale(1.18);
      opacity: 0;
    }
    100% {
      transform: scale(0.92);
      opacity: 0;
    }
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(24px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes countUp {
    from {
      opacity: 0;
      transform: scale(0.7);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .fade-up-1 {
    animation: fadeUp 0.55s cubic-bezier(.22,1,.36,1) 0.05s both;
  }

  .fade-up-2 {
    animation: fadeUp 0.55s cubic-bezier(.22,1,.36,1) 0.18s both;
  }

  .fade-up-3 {
    animation: fadeUp 0.55s cubic-bezier(.22,1,.36,1) 0.30s both;
  }

  .fade-up-4 {
    animation: fadeUp 0.55s cubic-bezier(.22,1,.36,1) 0.42s both;
  }

  .fade-up-5 {
    animation: fadeUp 0.55s cubic-bezier(.22,1,.36,1) 0.54s both;
  }

  .count-anim {
    animation: countUp 0.7s cubic-bezier(.34,1.56,.64,1) 0.1s both;
  }

  .btn-primary {
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(124,58,237,0.38) !important;
  }

  .btn-primary:active {
    transform: translateY(0);
  }

  .btn-ghost {
    transition: background 0.15s ease, transform 0.15s ease;
  }

  .btn-ghost:hover {
    background: #ede9fe !important;
    transform: translateY(-2px);
  }
`;

export default function Unauthorized() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  /* ── wave canvas bg ─────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let animId;
    let w;
    let h;
    let t = 0;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };

    resize();

    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      t += 0.008;

      const blobs = [
        { cx: w * 0.15, cy: h * 0.2, r: 220, a: 0.13, phase: 0 },
        { cx: w * 0.85, cy: h * 0.15, r: 180, a: 0.10, phase: 1.5 },
        { cx: w * 0.7, cy: h * 0.8, r: 240, a: 0.09, phase: 3.0 },
        { cx: w * 0.2, cy: h * 0.75, r: 160, a: 0.08, phase: 4.5 },
        { cx: w * 0.5, cy: h * 0.5, r: 130, a: 0.06, phase: 2.0 },
      ];

      blobs.forEach(({ cx, cy, r, a, phase }) => {
        const x = cx + Math.sin(t + phase) * 18;
        const y = cy + Math.cos(t + phase * 0.7) * 12;

        const g = ctx.createRadialGradient(x, y, 0, x, y, r);

        g.addColorStop(0, `rgba(167,139,250,${a})`);
        g.addColorStop(0.5, `rgba(196,181,253,${a * 0.5})`);
        g.addColorStop(1, `rgba(237,233,254,0)`);

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <style>{STYLES}</style>

      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background:
            "linear-gradient(145deg, #f0ebff 0%, #faf8ff 50%, #ede9fe 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          inset: 0,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {/* animated blob canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />

        {/* dot grid */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "radial-gradient(circle, #c4b5fd 1.2px, transparent 1.2px)",
            backgroundSize: "32px 32px",
            opacity: 0.22,
          }}
        />

        {/* floating shapes */}
        <Box
          sx={{
            position: "absolute",
            top: "8%",
            left: "6%",
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "3px solid #c4b5fd",
            opacity: 0.5,
            animation: "floatA 6s ease-in-out infinite",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: "12%",
            right: "8%",
            width: 52,
            height: 52,
            borderRadius: "14px",
            background: "linear-gradient(135deg, #ddd6fe, #c4b5fd)",
            opacity: 0.55,
            animation: "floatB 7s ease-in-out infinite",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: "14%",
            left: "9%",
            width: 44,
            height: 44,
            borderRadius: "10px",
            background: "linear-gradient(135deg, #ede9fe, #a78bfa)",
            opacity: 0.45,
            transform: "rotate(45deg)",
            animation: "floatC 8s ease-in-out infinite",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: "10%",
            right: "7%",
            width: 68,
            height: 68,
            borderRadius: "50%",
            border: "2.5px dashed #a78bfa",
            opacity: 0.4,
            animation: "spinSlow 18s linear infinite",
          }}
        />

        {/* ── MAIN CARD ── */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            px: { xs: 3, sm: 5.5 },
            py: { xs: 4.5, sm: 6 },
            maxWidth: 480,
            width: "92%",
            bgcolor: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(24px)",
            border: "1.5px solid rgba(221,214,254,0.9)",
            borderRadius: "28px",
            boxShadow: `
              0 2px 0 rgba(255,255,255,0.9) inset,
              0 24px 64px rgba(124,58,237,0.13),
              0 4px 16px rgba(124,58,237,0.07)
            `,
          }}
        >
          {/* pulse icon */}
          <Box
            className="fade-up-1"
            sx={{
              position: "relative",
              display: "inline-flex",
              mb: 3,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: -10,
                borderRadius: "50%",
                border: "2px solid rgba(167,139,250,0.5)",
                animation: "pulseRing 2.2s ease-out infinite",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                inset: -10,
                borderRadius: "50%",
                border: "2px solid rgba(167,139,250,0.3)",
                animation: "pulseRing 2.2s ease-out infinite 0.7s",
              }}
            />

            <Box
  sx={{
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
    border: "2px solid #c4b5fd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 24px rgba(124,58,237,0.18)",
  }}
>
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
    <rect
      x="4.5"
      y="10.5"
      width="15"
      height="11"
      rx="3"
      fill="#a78bfa"
      stroke="#7c3aed"
      strokeWidth="1.4"
    />

    <path
      d="M8 10.5V7a4 4 0 0 1 8 0v3.5"
      stroke="#7c3aed"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <circle cx="12" cy="16" r="1.8" fill="white" />

    <line
      x1="12"
      y1="17.8"
      x2="12"
      y2="19.5"
      stroke="white"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
</Box>
          </Box>

          {/* 403 */}
          <Typography
            className="count-anim"
            sx={{
              fontSize: { xs: "5rem", sm: "7rem" },
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.05em",
              background:
                "linear-gradient(135deg, #7c3aed 0%, #a78bfa 60%, #c4b5fd 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            403
          </Typography>

          <Typography
            className="fade-up-3"
            sx={{
              fontSize: "1.3rem",
              fontWeight: 700,
              color: P.text,
              mb: 1,
            }}
          >
            Oops! You're not authorised
          </Typography>

          <Typography
            className="fade-up-3"
            sx={{
              fontSize: "0.9rem",
              color: P.muted,
              mb: 4,
              lineHeight: 1.8,
            }}
          >
            You don't have permission to access this page.
            <br />
            Contact your administrator if you think this is a mistake.
          </Typography>

          <Box
            className="fade-up-5"
            sx={{
              display: "flex",
              gap: 1.5,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            

            <Button
              className="btn-primary"
              onClick={() => navigate("/", { replace: true })}
              variant="contained"
              sx={{
                background:
                  "linear-gradient(135deg, #7c3aed 0%, #9d60f8 100%)",
                color: "#fff",
                fontWeight: 700,
                borderRadius: "14px",
                px: 3.5,
                py: 1.1,
                textTransform: "none",
                boxShadow: "0 6px 22px rgba(124,58,237,0.30)",
              }}
            >
              ← Go Back
            </Button>
          </Box>

          <Typography
            className="fade-up-5"
            sx={{
              mt: 3,
              fontSize: "0.68rem",
              color: "#c4b5fd",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Error 403 · Forbidden · Unauthorized Access
          </Typography>
        </Box>
      </Box>
    </>
  );
}