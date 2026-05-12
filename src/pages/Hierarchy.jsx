import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  SearchRounded,
  FolderRounded,
  FlagRounded,
  TaskRounded,
  KeyboardArrowRightRounded,
  KeyboardArrowDownRounded,
  UnfoldMoreRounded,
  UnfoldLessRounded,
  CalendarTodayRounded,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useHierarchy } from "../hooks/useHierarchy";
import {
  TASK_STATUS_CONFIG,
  pageStyles,
  titleStyles,
  subtitleStyles,
  legendLabelStyles,
  treeContainerStyles,
  expandBtnStyles,
  collapseBtnStyles,
  progressWrapStyles,
  progressCountStyles,
  progressTrackStyles,
  progressFillStyles,
  progressPctStyles,
  dueDateChipStyles,
  dueDateIconStyles,
  dueDateTextStyles,
  taskRowStyles,
  taskConnectorStyles,
  taskTitleStyles,
  taskMetaBoxStyles,
  milestoneRowStyles,
  milestoneNameStyles,
  milestoneMetaBoxStyles,
  milestoneEmptyPillStyles,
  projectRowWrapStyles,
  projectRowStyles,
  projectNameStyles,
  projectMetaBoxStyles,
  milestonePillStyles,
  projectExpandedBoxStyles,
  noMilestonesStyles,
  expandIconBoxStyles,
} from "../styles/hierarchyStyles";

// ── PROGRESS BAR ──────────────────────────────────────────────────────────────
function ProgressBar({ value = 0, color = "#6366f1", isDark, label }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <Box sx={progressWrapStyles}>
      {label && (
        <Typography sx={progressCountStyles(isDark)}>{label}</Typography>
      )}
      <Box sx={progressTrackStyles(isDark)}>
        <Box sx={progressFillStyles(pct, color)} />
      </Box>
      <Typography sx={progressPctStyles(isDark)}>{Math.round(pct)}%</Typography>
    </Box>
  );
}

// ── TASK STATUS RING ──────────────────────────────────────────────────────────
function TaskStatusRing({ status = "PENDING" }) {
  const cfg = TASK_STATUS_CONFIG[status] || TASK_STATUS_CONFIG.PENDING;
  const r = 7, cx = 9, cy = 9;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - cfg.fill / 100);
  return (
    <Box
      sx={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 28, height: 28, borderRadius: "50%",
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.border}`,
        flexShrink: 0,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={cfg.border} strokeWidth="2" />
        {cfg.fill > 0 && (
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={cfg.color}
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        )}
        {status === "COMPLETED" && (
          <path
            d="M5.5 9L8 11.5L12.5 7"
            fill="none"
            stroke={cfg.color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: "rotate(90deg) translate(0, -18px)" }}
          />
        )}
      </svg>
    </Box>
  );
}

// ── DUE DATE CHIP ─────────────────────────────────────────────────────────────
function DueDateChip({ dueDate, isDark }) {
  if (!dueDate) return null;
  const date = new Date(dueDate);
  const isLate = date < new Date();
  const label = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return (
    <Box sx={dueDateChipStyles(isDark, isLate)}>
      <CalendarTodayRounded sx={dueDateIconStyles(isDark, isLate)} />
      <Typography sx={dueDateTextStyles(isDark, isLate)}>{label}</Typography>
    </Box>
  );
}

// ── TASK ROW ──────────────────────────────────────────────────────────────────
function TaskRow({ task, isDark }) {
  const status = task.status || "PENDING";
  return (
    <Box sx={taskRowStyles(isDark)}>
      <Box sx={taskConnectorStyles(isDark)}>
        <TaskStatusRing status={status} />
      </Box>
      <Typography sx={taskTitleStyles(isDark)}>
        {task.title}
      </Typography>
      <Box sx={taskMetaBoxStyles}>
        <DueDateChip dueDate={task.dueDate} isDark={isDark} />
      </Box>
    </Box>
  );
}

// ── MILESTONE ROW ─────────────────────────────────────────────────────────────
function MilestoneRow({ milestone, isExpanded, onToggle, isDark }) {
  const hasTasks = milestone.taskCount > 0;
  const completedCount = milestone.tasks.filter((t) => t.status === "COMPLETED").length;
  const progressPct = hasTasks ? (completedCount / milestone.taskCount) * 100 : 0;

  return (
    <>
      <Box
        onClick={hasTasks ? onToggle : undefined}
        sx={milestoneRowStyles(isDark, isExpanded, hasTasks)}
      >
        <Box sx={expandIconBoxStyles(20)}>
          {hasTasks ? (
            isExpanded
              ? <KeyboardArrowDownRounded sx={{ fontSize: 18, color: "#ca8a04" }} />
              : <KeyboardArrowRightRounded sx={{ fontSize: 18, color: isDark ? "#64748b" : "#94a3b8" }} />
          ) : (
            <Box sx={{ width: 18 }} />
          )}
        </Box>

        <FlagRounded sx={{ fontSize: 16, color: "#ca8a04", mr: 1.2 }} />

        <Typography sx={milestoneNameStyles(isDark)}>
          {milestone.milestoneName}
        </Typography>

        <Box sx={milestoneMetaBoxStyles}>
          {hasTasks ? (
            <ProgressBar
              value={progressPct}
              color="#ca8a04"
              isDark={isDark}
              label={`${completedCount}/${milestone.taskCount}`}
            />
          ) : (
            <Box sx={milestoneEmptyPillStyles(isDark)}>
              <TaskRounded sx={{ fontSize: 11, color: "#ca8a04" }} />
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#ca8a04" }}>
                0 tasks
              </Typography>
            </Box>
          )}
          <DueDateChip dueDate={milestone.dueDate} isDark={isDark} />
        </Box>
      </Box>

      {isExpanded && milestone.tasks.map((task) => (
        <TaskRow key={task.id} task={task} isDark={isDark} />
      ))}
    </>
  );
}

// ── PROJECT ROW ───────────────────────────────────────────────────────────────
function ProjectRow({ project, expandedMilestones, toggleMilestone, isDark, isExpanded, onToggle }) {
  const hasMilestones = project.milestoneCount > 0;
  const totalTasks = project.milestones.reduce((acc, m) => acc + m.taskCount, 0);
  const completedTasks = project.milestones.reduce(
    (acc, m) => acc + m.tasks.filter((t) => t.status === "COMPLETED").length, 0
  );
  const progressPct = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Box sx={projectRowWrapStyles}>
      <Box
        onClick={hasMilestones ? onToggle : undefined}
        sx={projectRowStyles(isDark, isExpanded, hasMilestones)}
      >
        <Box sx={expandIconBoxStyles(22)}>
          {hasMilestones ? (
            isExpanded
              ? <KeyboardArrowDownRounded sx={{ fontSize: 20, color: "#6366f1" }} />
              : <KeyboardArrowRightRounded sx={{ fontSize: 20, color: isDark ? "#475569" : "#94a3b8" }} />
          ) : (
            <Box sx={{ width: 20 }} />
          )}
        </Box>

        <FolderRounded sx={{ fontSize: 20, color: "#6366f1", mr: 1.5 }} />

        <Typography sx={projectNameStyles(isDark)}>
          {project.projectName}
        </Typography>

        <Box sx={projectMetaBoxStyles}>
          {totalTasks > 0 && (
            <ProgressBar
              value={progressPct}
              color="#6366f1"
              isDark={isDark}
              label={`${completedTasks}/${totalTasks}`}
            />
          )}
          <Box sx={milestonePillStyles(isDark)}>
            <FlagRounded sx={{ fontSize: 11, color: "#6366f1" }} />
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#6366f1" }}>
              {project.milestoneCount} milestone{project.milestoneCount !== 1 ? "s" : ""}
            </Typography>
          </Box>
          {project.endDate && (
            <DueDateChip dueDate={project.endDate} isDark={isDark} />
          )}
        </Box>
      </Box>

      {isExpanded && (
        <Box sx={projectExpandedBoxStyles}>
          {project.milestones.length === 0 ? (
            <Typography sx={noMilestonesStyles(isDark)}>
              No milestones yet
            </Typography>
          ) : (
            project.milestones.map((m) => (
              <MilestoneRow
                key={m.milestoneId}
                milestone={m}
                isDark={isDark}
                isExpanded={expandedMilestones.has(m.milestoneId)}
                onToggle={() => toggleMilestone(m.milestoneId)}
              />
            ))
          )}
        </Box>
      )}
    </Box>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function Hierarchy() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const {
    tree, loading, 
    expandedProjects, expandedMilestones,
    toggleProject, toggleMilestone,
    expandAll, collapseAll,
  } = useHierarchy();

  return (
    <Box sx={pageStyles.root}>

      {/* ── HEADER ── */}
      <Box sx={pageStyles.header}>
        <Box>
          <Typography sx={titleStyles(isDark)}>Project Hierarchy</Typography>
          <Typography sx={subtitleStyles(isDark)}>Projects → Milestones → Tasks</Typography>
        </Box>
        <Box sx={pageStyles.headerControls}>
          
          <Tooltip title="Expand all">
            <IconButton onClick={expandAll} size="small" sx={expandBtnStyles(isDark)}>
              <UnfoldMoreRounded sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Collapse all">
            <IconButton onClick={collapseAll} size="small" sx={collapseBtnStyles(isDark)}>
              <UnfoldLessRounded sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* ── LEGEND ── */}
      <Box sx={pageStyles.legend}>
        {[
          { icon: <FolderRounded sx={{ fontSize: 14, color: "#6366f1" }} />, label: "Project"   },
          { icon: <FlagRounded   sx={{ fontSize: 14, color: "#ca8a04" }} />, label: "Milestone" },
          { icon: <TaskRounded   sx={{ fontSize: 14, color: "#818cf8" }} />, label: "Task"      },
        ].map(({ icon, label }) => (
          <Box key={label} sx={pageStyles.legendItem}>
            {icon}
            <Typography sx={legendLabelStyles(isDark)}>{label}</Typography>
          </Box>
        ))}
      </Box>

      {/* ── TREE ── */}
      {loading ? (
        <Box sx={pageStyles.loadingBox}>
          <CircularProgress size={32} sx={{ color: "#6366f1" }} />
        </Box>
      ) : tree.length === 0 ? (
        <Box sx={pageStyles.emptyState}>
          <FolderRounded sx={{ fontSize: 48, mb: 1, opacity: 0.4, color: isDark ? "#475569" : "#94a3b8" }} />
          
        </Box>
      ) : (
        <Box sx={treeContainerStyles(isDark)}>
          {tree.map((project) => (
            <ProjectRow
              key={project.projectId}
              project={project}
              isDark={isDark}
              expandedMilestones={expandedMilestones}
              toggleMilestone={toggleMilestone}
              isExpanded={expandedProjects.has(project.projectId)}
              onToggle={() => toggleProject(project.projectId)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}