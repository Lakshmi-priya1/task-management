import { Button, CircularProgress, Tooltip, Box, Typography } from "@mui/material";
import { FileDownloadRounded, CheckCircleRounded } from "@mui/icons-material";

function ExportButtons({ onExport, exporting = false, progress = 0 }) {
  const isDone = !exporting && progress === 0 ? false : !exporting && progress >= 100;

  return (
    <Tooltip title={exporting ? `Downloading... ${progress}%` : "Export all employees as Excel"}>
      <span>
        <Button
          onClick={onExport}
          disabled={exporting}
          variant="contained"
          size="small"
          startIcon={
            exporting ? <CircularProgress size={14} color="inherit" /> :
            isDone    ? <CheckCircleRounded /> :
                        <FileDownloadRounded />
          }
          sx={{
            textTransform: "none",
            borderRadius: "12px",
            px: 2.5,
            boxShadow: "none",
            minWidth: 145,
            position: "relative",
            overflow: "hidden",
            background: isDone
              ? "linear-gradient(135deg,#10b981,#059669)"
              : "linear-gradient(135deg,#10b981,#34d399)",
            "&:hover": { opacity: 0.88 },
          }}
        >
          {/* ✅ Progress bar strip at bottom */}
          {exporting && progress > 0 && (
            <Box sx={{
              position: "absolute", bottom: 0, left: 0,
              height: 3,
              width: `${progress}%`,
              bgcolor: "rgba(255,255,255,0.55)",
              transition: "width 0.3s ease",
              borderRadius: 4,
            }} />
          )}
          <Typography sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1 }}>
            {exporting ? `Exporting ${progress}%` : "Export Excel"}
          </Typography>
        </Button>
      </span>
    </Tooltip>
  );
}

export default ExportButtons;