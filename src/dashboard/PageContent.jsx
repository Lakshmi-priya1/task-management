import React from "react";
import { Box, Card, CardContent, Typography, Chip } from "@mui/material";
import {
  AssignmentRounded, CheckCircleRounded,
  PendingActionsRounded, AutorenewRounded, FlagRounded,
} from "@mui/icons-material";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid, XAxis, YAxis,
} from "recharts";

import { useDashboard } from "../hooks/useDashboard";
import {
  COLORS,
  heroCardSx, heroContentSx, heroRowSx,
  greetingTextSx, quoteTextSx,
  clockBoxSx, clockLabelSx, clockTimeSx, clockDateSx,
  chipSx, chipRowSx,
  statsGridSx, statCardSx, statIconBoxSx, statLabelSx, statValueSx,
  chartsGridSx, chartCardSx, chartTitleSx, chartBoxSx,
  getStatCards, getMilestoneStatCards, getEmployeeStatCards,
} from "../styles/dashboardStyles";

const TASK_ICONS = [
  <AssignmentRounded />,
  <CheckCircleRounded />,
  <AutorenewRounded />,
  <PendingActionsRounded />,
];

const MILESTONE_ICONS = [
  <FlagRounded />,
  <CheckCircleRounded />,
  <AssignmentRounded />,
  <CheckCircleRounded />,
];

function StatCards({ cards, icons }) {
  return (
    <Box sx={statsGridSx}>
      {cards.map((card, i) => (
        <Card key={i} sx={statCardSx}>
          <CardContent>
            <Box sx={statIconBoxSx(card.color)}>{icons[i]}</Box>
            <Typography sx={statLabelSx}>{card.title}</Typography>
            <Typography sx={statValueSx}>{card.value}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

function Charts({ data, title1 = "Task Distribution", title2 = "Status Overview" }) {
  return (
    <Box sx={chartsGridSx}>
      <Card sx={chartCardSx}>
        <Typography sx={chartTitleSx}>{title1}</Typography>
        <Box sx={chartBoxSx}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="value" outerRadius={110} innerRadius={55}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Card>
      <Card sx={chartCardSx}>
        <Typography sx={chartTitleSx}>{title2}</Typography>
        <Box sx={chartBoxSx}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Card>
    </Box>
  );
}

export default function PageContent() {
  const {
    role,
    taskStats, milestoneStats,
    taskChartData, milestoneChartData,
    quotes, quoteIndex, fade, time, greeting,
  } = useDashboard();

  // Determine stat cards + icons based on role
  let statCards, statIcons;
  if (role === "TEAM_LEAD") {
    statCards = getMilestoneStatCards(milestoneStats, taskStats);
    statIcons = MILESTONE_ICONS;
  } else if (role === "EMPLOYEE") {
    statCards = getEmployeeStatCards(taskStats);
    statIcons = TASK_ICONS;
  } else {
    // ADMIN + PROJECT_MANAGER
    statCards = getStatCards(taskStats);
    statIcons = TASK_ICONS;
  }

  const heroChips =
    role === "TEAM_LEAD"
      ? [
          { label: `${milestoneStats.pending} Milestones Pending` },
          { label: `${milestoneStats.completed} Milestones Done` },
        ]
      : [
          { label: `${taskStats.pending} Pending` },
          { label: `${taskStats.completed} Done` },
        ];

  return (
    <Box>
      {/* Hero greeting card */}
      <Card sx={heroCardSx}>
        <CardContent sx={heroContentSx}>
          <Box sx={heroRowSx}>
            <Box>
              <Typography sx={greetingTextSx}>{greeting}</Typography>
              <Typography sx={quoteTextSx(fade)}>{quotes[quoteIndex]}</Typography>
            </Box>
            <Box sx={clockBoxSx}>
              <br />
              <Typography sx={clockLabelSx}>Local Time</Typography>
              <Typography sx={clockTimeSx}>
                {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Typography>
              <Typography sx={clockDateSx}>
                {time.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })}
              </Typography>
            </Box>
          </Box>
          <Box sx={chipRowSx}>
            {heroChips.map((c, i) => (
              <Chip key={i} label={c.label} sx={chipSx} />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Stat cards */}
      <StatCards cards={statCards} icons={statIcons} />

      {/* Charts */}
      {role === "TEAM_LEAD" ? (
        <>
          <Charts
            data={milestoneChartData}
            title1="Milestone Distribution"
            title2="Milestone Status"
          />
          <Box sx={{ mt: 2 }}>
            <Charts
              data={taskChartData}
              title1="Task Distribution"
              title2="Task Status"
            />
          </Box>
        </>
      ) : (
        <Charts data={taskChartData} />
      )}
    </Box>
  );
}
