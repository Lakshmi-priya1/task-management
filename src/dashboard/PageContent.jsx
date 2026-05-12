import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
} from "@mui/material";
import {
  AssignmentRounded,
  CheckCircleRounded,
  PendingActionsRounded,
  AutorenewRounded,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { useDashboard } from "../hooks/useDashboard";
import {
  COLORS,
  heroCardSx,
  heroContentSx,
  heroRowSx,
  greetingTextSx,
  quoteTextSx,
  clockBoxSx,
  clockLabelSx,
  clockTimeSx,
  clockDateSx,
  chipSx,
  chipRowSx,
  statsGridSx,
  statCardSx,
  statIconBoxSx,
  statLabelSx,
  statValueSx,
  chartsGridSx,
  chartCardSx,
  chartTitleSx,
  chartBoxSx,
  getStatCards,
} from "../styles/dashboardStyles";

// Icons paired with each stat card (in order)
const STAT_ICONS = [
  <AssignmentRounded />,
  <CheckCircleRounded />,
  <AutorenewRounded />,
  <PendingActionsRounded />,
];

export default function PageContent() {
  const { stats, chartData, quotes, quoteIndex, fade, time, greeting } =
    useDashboard();

  const statCards = getStatCards(stats);

  return (
    <Box>
      {/* ── Hero greeting card ─────────────────────────────────────────── */}
      <Card sx={heroCardSx}>
        <CardContent sx={heroContentSx}>
          <Box sx={heroRowSx}>
            {/* Left: greeting + quote */}
            <Box>
              <Typography sx={greetingTextSx}>{greeting}</Typography>
              <Typography sx={quoteTextSx(fade)}>
                {quotes[quoteIndex]}
              </Typography>
            </Box>

            {/* Right: clock */}
            <Box sx={clockBoxSx}>
              <br />
              <Typography sx={clockLabelSx}>Local Time</Typography>
              <Typography sx={clockTimeSx}>
                {time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
              <Typography sx={clockDateSx}>
                {time.toLocaleDateString([], {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </Typography>
            </Box>
          </Box>

          {/* Status chips */}
          <Box sx={chipRowSx}>
            <Chip label={`${stats.pending} Pending`} sx={chipSx} />
            <Chip label={`${stats.completed} Done`}  sx={chipSx} />
          </Box>
        </CardContent>
      </Card>

      {/* ── Stat cards ─────────────────────────────────────────────────── */}
      <Box sx={statsGridSx}>
        {statCards.map((card, i) => (
          <Card key={i} sx={statCardSx}>
            <CardContent>
              <Box sx={statIconBoxSx(card.color)}>{STAT_ICONS[i]}</Box>
              <Typography sx={statLabelSx}>{card.title}</Typography>
              <Typography sx={statValueSx}>{card.value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* ── Charts ─────────────────────────────────────────────────────── */}
      <Box sx={chartsGridSx}>
        {/* Pie chart */}
        <Card sx={chartCardSx}>
          <Typography sx={chartTitleSx}>Task Distribution</Typography>
          <Box sx={chartBoxSx}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  outerRadius={110}
                  innerRadius={55}
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        {/* Bar chart */}
        <Card sx={chartCardSx}>
          <Typography sx={chartTitleSx}>Status Overview</Typography>
          <Box sx={chartBoxSx}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}