// pages/Login.jsx
import { Link } from "react-router-dom";
import {
  Box, Button, Typography, TextField, InputAdornment,
  IconButton, Checkbox, FormControlLabel, CircularProgress,
  Paper, Divider,
} from "@mui/material";
import {
  Visibility, VisibilityOff, EmailOutlined,
  LockOutlined, ArrowForwardRounded,
} from "@mui/icons-material";
import { FaGoogle, FaGithub, FaLinkedinIn } from "react-icons/fa";

import { useLogin }         from "../hooks/useLogin";
import { loginStyles as s } from "../styles/loginStyles";

// ── Static SVG illustration (light palette) ────────────────────
function DashboardIllustration() {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "72%", maxWidth: 300 }}
    >
      {/* Card base */}
      <rect x="20" y="40" width="280" height="200" rx="20"
        fill="#ffffff" stroke="#e0e7ff" strokeWidth="1.5" />

      {/* Drop shadow effect */}
      <rect x="30" y="48" width="280" height="200" rx="20"
        fill="rgba(99,102,241,0.04)" />

      {/* Top bar dots */}
      <circle cx="44" cy="65" r="5" fill="#fca5a5" />
      <circle cx="60" cy="65" r="5" fill="#fcd34d" />
      <circle cx="76" cy="65" r="5" fill="#6ee7b7" />

      {/* Sidebar */}
      <rect x="20" y="80" width="60" height="160" rx="0"
        fill="#f5f3ff" />
      <rect x="30" y="100" width="40" height="6" rx="3" fill="#6366f1" />
      <rect x="30" y="116" width="32" height="5" rx="2.5" fill="#c7d2fe" />
      <rect x="30" y="130" width="36" height="5" rx="2.5" fill="#c7d2fe" />
      <rect x="30" y="144" width="28" height="5" rx="2.5" fill="#c7d2fe" />
      <rect x="30" y="158" width="34" height="5" rx="2.5" fill="#c7d2fe" />

      {/* Stat cards */}
      <rect x="90" y="88" width="70" height="44" rx="10"
        fill="#eef2ff" stroke="#e0e7ff" strokeWidth="1" />
      <rect x="96" y="96" width="30" height="4" rx="2" fill="#a5b4fc" />
      <rect x="96" y="105" width="22" height="8" rx="4" fill="#6366f1" />
      <rect x="120" y="107" width="18" height="4" rx="2" fill="#6ee7b7" />

      <rect x="170" y="88" width="70" height="44" rx="10"
        fill="#faf5ff" stroke="#ede9fe" strokeWidth="1" />
      <rect x="176" y="96" width="30" height="4" rx="2" fill="#d8b4fe" />
      <rect x="176" y="105" width="22" height="8" rx="4" fill="#a855f7" />
      <rect x="200" y="107" width="18" height="4" rx="2" fill="#fcd34d" />

      {/* Chart area */}
      <rect x="90" y="142" width="150" height="82" rx="10"
        fill="#fafafa" stroke="#f3f4f6" strokeWidth="1" />

      {/* Chart bars */}
      <rect x="105" y="188" width="12" height="24" rx="4" fill="#e0e7ff" />
      <rect x="123" y="175" width="12" height="37" rx="4" fill="#6366f1" />
      <rect x="141" y="182" width="12" height="30" rx="4" fill="#e0e7ff" />
      <rect x="159" y="168" width="12" height="44" rx="4" fill="#818cf8" />
      <rect x="177" y="178" width="12" height="34" rx="4" fill="#e0e7ff" />
      <rect x="195" y="172" width="12" height="40" rx="4" fill="#6366f1" />

      {/* Chart line */}
      <polyline
        points="111,186 129,172 147,179 165,165 183,175 201,169"
        stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        fill="none" />
      {[
        [111,186],[129,172],[147,179],[165,165],[183,175],[201,169]
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="#a855f7" />
      ))}

      {/* Avatar row */}
      <circle cx="108" cy="158" r="6" fill="#a5b4fc" />
      <circle cx="120" cy="158" r="6" fill="#d8b4fe" />
      <circle cx="132" cy="158" r="6" fill="#6ee7b7" />
      <rect x="142" y="154" width="40" height="4" rx="2" fill="#e5e7eb" />
      <rect x="142" y="161" width="28" height="3.5" rx="1.5" fill="#f3f4f6" />

      {/* Floating badge */}
      <rect x="218" y="128" width="72" height="28" rx="10"
        fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" />
      <circle cx="232" cy="142" r="4" fill="#22c55e" />
      <rect x="240" y="139" width="38" height="4" rx="2" fill="#86efac" />
      <rect x="240" y="146" width="26" height="3" rx="1.5" fill="#d1fae5" />
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────
export default function Login() {
  const {
    form, errors, loading,
    showPassword, togglePassword,
    handleChange, handleLogin,
  } = useLogin();

  return (
    <Box sx={s.root}>

      {/* ── LEFT PANEL ───────────────────────────────── */}
      <Box sx={s.leftPanel}>
        <Box sx={s.blob1} />
        <Box sx={s.blob2} />
        <Box sx={s.blob3} />

        <Box sx={s.illustrationWrap}>
          <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Box sx={s.orbitOuter} />
            <Box sx={s.orbitMid} />
            <DashboardIllustration />
          </Box>
        </Box>

        <Box sx={s.leftTagline}>
          <Typography sx={s.leftTaglineHeading}>
            Built for teams that<br />move fast.
          </Typography>
          <Typography sx={s.leftTaglineSub}>
            Task &amp; Project Management
          </Typography>
        </Box>
      </Box>

      {/* ── RIGHT PANEL ──────────────────────────────── */}
      <Box sx={s.rightPanel}>
        <Box sx={s.rightBlobTR} />
        <Box sx={s.rightBlobBL} />

        <Box sx={s.formWrapper}>

          <Typography sx={s.heading} className="lp-fade-up-1">
            Task{" "}
            <Box component="span" sx={s.headingItalic}>Management</Box>
          </Typography>
          <Typography sx={s.subheading} className="lp-fade-up-2">
            Sign in to manage employees, projects and productivity.
          </Typography>

          <Paper elevation={0} sx={s.card} className="lp-fade-up-3">

            {/* Social */}
            <Box sx={s.socialRow}>
              <IconButton className="lp-social-btn" sx={{ ...s.socialBtn, "&:hover": { color: "#ea4335" } }}>
                <FaGoogle size={17} />
              </IconButton>
              <IconButton className="lp-social-btn" sx={{ ...s.socialBtn, "&:hover": { color: "#111827" } }}>
                <FaGithub size={17} />
              </IconButton>
              <IconButton className="lp-social-btn" sx={{ ...s.socialBtn, "&:hover": { color: "#0a66c2" } }}>
                <FaLinkedinIn size={17} />
              </IconButton>
            </Box>

            <Divider sx={s.divider}>OR LOGIN WITH EMAIL</Divider>

            <form onSubmit={handleLogin} noValidate>
              {/* Email */}
              <TextField
                fullWidth name="email" placeholder="Email address"
                value={form.email} onChange={handleChange}
                error={!!errors.email} helperText={errors.email}
                size="small" className="lp-input"
                sx={{ mb: 2, ...s.inputSx }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined sx={s.adornmentIcon} fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* Password */}
              <TextField
                fullWidth name="password" placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={form.password} onChange={handleChange}
                error={!!errors.password} helperText={errors.password}
                size="small" className="lp-input"
                sx={{ mb: 1.5, ...s.inputSx }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={s.adornmentIcon} fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePassword} edge="end" size="small">
                          {showPassword
                            ? <Visibility sx={s.visibilityIconActive} fontSize="small" />
                            : <VisibilityOff sx={s.adornmentIconMuted} fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* Remember / Forgot */}
              <Box sx={s.rememberRow}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.remember}
                      name="remember"
                      onChange={handleChange}
                      size="small"
                      sx={s.checkboxSx}
                    />
                  }
                  label={<Typography sx={s.rememberLabel}>Remember me</Typography>}
                />
                <Link to="/forgot-password" style={s.forgotLink}>
                  Forgot password?
                </Link>
              </Box>

              {/* Submit */}
              <Button
                fullWidth type="submit" disabled={loading}
                endIcon={!loading && <ArrowForwardRounded />}
                className="lp-submit-btn"
                sx={s.submitButton}
              >
                {loading
                  ? <CircularProgress size={18} sx={{ color: "rgba(255,255,255,0.7)" }} />
                  : "SIGN IN"}
              </Button>
            </form>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}