// hooks/useHierarchy.js
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchProjects,
  fetchAllEmployees,
} from "../store/slices/projectSlice";

import {
  fetchMilestones,
  fetchEmployeesForMilestone,
} from "../store/slices/milestoneSlice";

import {
  fetchTasks,
  fetchEmployeesForTask,
} from "../store/slices/taskSlice";

export function useHierarchy() {
  const dispatch = useDispatch();

  // ── pull from existing slices ────────────────────────
  const { list: projects, employees: projectEmployees } =
    useSelector((s) => s.projects);

  const { list: milestones, employees: milestoneEmployees } =
    useSelector((s) => s.milestones);

  const { list: tasks, employees: taskEmployees } =
    useSelector((s) => s.tasks);

  // ── local expand state ───────────────────────────────
  const [expandedProjects,   setExpandedProjects]   = useState(new Set());
  const [expandedMilestones, setExpandedMilestones] = useState(new Set());
  const [loading,            setLoading]            = useState(true);
  const [search,             setSearch]             = useState("");

  // ── fetch everything once ────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([
        dispatch(fetchProjects({ keyword: "", status: "", page: 0, size: 100 })),
        dispatch(fetchAllEmployees()),
        dispatch(fetchMilestones({ keyword: "", projectId: "", page: 0, size: 100 })),
        dispatch(fetchEmployeesForMilestone()),
        dispatch(fetchTasks({ keyword: "", status: "", page: 0, size: 100 })),
        dispatch(fetchEmployeesForTask()),
      ]);
      setLoading(false);
    };
    load();
  }, [dispatch]);

  // ── single employees list (merge all three sources) ──
  const employees = [
    ...projectEmployees,
    ...milestoneEmployees,
    ...taskEmployees,
  ].filter(
    (e, i, arr) =>
      arr.findIndex((x) => Number(x.employeeId) === Number(e.employeeId)) === i
  );

  const getEmpName = (id) => {
    const e = employees.find((x) => Number(x.employeeId) === Number(id));
    return e ? `${e.firstName} ${e.lastName || ""}`.trim() : `#${id}`;
  };

  // ── toggle helpers ───────────────────────────────────
  const toggleProject = (id) =>
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleMilestone = (id) =>
    setExpandedMilestones((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const expandAll = () => {
    setExpandedProjects(new Set(projects.map((p) => p.projectId)));
    setExpandedMilestones(new Set(milestones.map((m) => m.milestoneId)));
  };

  const collapseAll = () => {
    setExpandedProjects(new Set());
    setExpandedMilestones(new Set());
  };

  // ── derived tree with search filter ─────────────────
  const q = search.toLowerCase();

  const tree = projects
    .filter((p) => !q || p.projectName?.toLowerCase().includes(q))
    .map((p) => {
      const pMilestones = milestones.filter(
        (m) => Number(m.projectId) === Number(p.projectId)
      );

      const enrichedMilestones = pMilestones.map((m) => {
        const mTasks = tasks.filter(
          (t) => Number(t.milestoneId) === Number(m.milestoneId)
        );
        return {
          ...m,
          tasks: mTasks,
          taskCount: mTasks.length,
          employeeNames: (m.employeeIds || []).map(getEmpName),
        };
      });

      return {
        ...p,
        milestones: enrichedMilestones,
        milestoneCount: pMilestones.length,
        employeeNames: (p.employeeIds || []).map(getEmpName),
      };
    });

  return {
    tree,
    loading,
    search, setSearch,
    expandedProjects, expandedMilestones,
    toggleProject, toggleMilestone,
    expandAll, collapseAll,
    getEmpName,
  };
}