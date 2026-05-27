import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import {
  Kanban,
  CalendarDays,
  BarChart4,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  AlertTriangle,
  Clock,
  User,
  CheckCircle2,
  Circle,
  Loader,
  Ban,
  RefreshCw,
} from "lucide-react";
import { taskApi } from "@/api";
import { toast } from "sonner";

/* ─── shared helpers ─────────────────────────────────────── */

const PRIORITY_CONFIG = {
  high: { label: "High", color: "#ef4444", bg: "#fef2f2", border: "#fca5a5" },
  medium: { label: "Med", color: "#f59e0b", bg: "#fffbeb", border: "#fcd34d" },
  low: { label: "Low", color: "#22c55e", bg: "#f0fdf4", border: "#86efac" },
};

const STATUS_CONFIG = {
  todo: { label: "To Do", color: "#6366f1", bg: "#eef2ff", icon: Circle },
  in_progress: {
    label: "In Progress",
    color: "#f59e0b",
    bg: "#fffbeb",
    icon: Loader,
  },
  review: { label: "Review", color: "#8b5cf6", bg: "#f5f3ff", icon: RefreshCw },
  done: { label: "Done", color: "#22c55e", bg: "#f0fdf4", icon: CheckCircle2 },
  blocked: { label: "Blocked", color: "#ef4444", bg: "#fef2f2", icon: Ban },
};

function Avatar({ name = "", size = 28 }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const hue = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <div
      title={name}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `hsl(${hue},55%,55%)`,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.38,
        fontWeight: 600,
        flexShrink: 0,
        border: "2px solid #fff",
        boxShadow: "0 1px 3px rgba(0,0,0,.15)",
      }}
    >
      {initials}
    </div>
  );
}

function PriorityBadge({ priority }) {
  const cfg = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.medium;
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: ".04em",
        textTransform: "uppercase",
        padding: "2px 6px",
        borderRadius: 4,
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
    >
      {cfg.label}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════
   KANBAN VIEW
══════════════════════════════════════════════════════════ */

const KANBAN_COLUMNS = [
  { key: "todo", ...STATUS_CONFIG.todo },
  { key: "in_progress", ...STATUS_CONFIG.in_progress },
  { key: "review", ...STATUS_CONFIG.review },
  { key: "done", ...STATUS_CONFIG.done },
  { key: "blocked", ...STATUS_CONFIG.blocked },
];

function KanbanCard({ task }) {
  const isOverdue = task.isOverdue;
  const priorityCfg = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.medium;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderLeft: `3px solid ${priorityCfg.color}`,
        borderRadius: 8,
        padding: "10px 12px",
        cursor: "pointer",
        transition: "box-shadow .15s,transform .15s",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,.1)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "none";
      }}
    >
      {/* title row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
        {isOverdue && (
          <AlertTriangle
            size={13}
            color="#ef4444"
            style={{ marginTop: 2, flexShrink: 0 }}
          />
        )}
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 600,
            color: isOverdue ? "#ef4444" : "#111827",
            lineHeight: 1.4,
          }}
        >
          {task.title}
        </p>
      </div>

      {/* progress bar */}
      {typeof task.progress === "number" && task.progress > 0 && (
        <div
          style={{
            height: 4,
            background: "#f3f4f6",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${task.progress}%`,
              background: priorityCfg.color,
              borderRadius: 2,
            }}
          />
        </div>
      )}

      {/* footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <PriorityBadge priority={task.priority} />
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {task.dueDate && (
            <span
              style={{
                fontSize: 10,
                color: isOverdue ? "#ef4444" : "#9ca3af",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Clock size={10} />
              {new Date(task.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
          {task.assignedTo && (
            <Avatar name={task.assignedTo.name ?? ""} size={22} />
          )}
        </div>
      </div>
    </div>
  );
}

function KanbanView({ data }) {
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");

  const filterTask = (task) => {
    const matchSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchPriority =
      filterPriority === "all" || task.priority === filterPriority;
    return matchSearch && matchPriority;
  };

  return (
    <div>
      {/* filter bar */}
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "6px 12px",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            fontSize: 13,
            outline: "none",
            flex: "1 1 180px",
            minWidth: 140,
          }}
        />
        {["all", "high", "medium", "low"].map((p) => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            style={{
              padding: "5px 12px",
              border: "1px solid",
              borderColor:
                filterPriority === p
                  ? (PRIORITY_CONFIG[p]?.color ?? "#6366f1")
                  : "#e5e7eb",
              borderRadius: 20,
              background:
                filterPriority === p
                  ? (PRIORITY_CONFIG[p]?.bg ?? "#eef2ff")
                  : "#fff",
              color:
                filterPriority === p
                  ? (PRIORITY_CONFIG[p]?.color ?? "#6366f1")
                  : "#6b7280",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {p === "all" ? "All" : p}
          </button>
        ))}
      </div>

      {/* columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 12,
          alignItems: "start",
        }}
      >
        {KANBAN_COLUMNS.map((col) => {
          const tasks = (data[col.key] ?? []).filter(filterTask);
          const StatusIcon = col.icon;
          return (
            <div
              key={col.key}
              style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              {/* column header */}
              <div
                style={{
                  padding: "10px 14px",
                  borderBottom: "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#fff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <StatusIcon size={14} color={col.color} />
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}
                  >
                    {col.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: col.color,
                    background: col.bg,
                    borderRadius: 20,
                    padding: "1px 8px",
                  }}
                >
                  {tasks.length}
                </span>
              </div>

              {/* cards */}
              <div
                style={{
                  padding: "10px 10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  minHeight: 80,
                }}
              >
                {tasks.length === 0 ? (
                  <p
                    style={{
                      margin: 0,
                      textAlign: "center",
                      fontSize: 12,
                      color: "#d1d5db",
                      padding: "20px 0",
                    }}
                  >
                    Empty
                  </p>
                ) : (
                  tasks.map((task) => <KanbanCard key={task._id} task={task} />)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   GANTT VIEW
══════════════════════════════════════════════════════════ */

const GANTT_STATUS_COLORS = {
  todo: { bar: "#818cf8", track: "#e0e7ff" },
  in_progress: { bar: "#fbbf24", track: "#fef9c3" },
  review: { bar: "#a78bfa", track: "#f5f3ff" },
  done: { bar: "#34d399", track: "#d1fae5" },
  blocked: { bar: "#f87171", track: "#fee2e2" },
};

function GanttView({ data }) {
  const [zoom, setZoom] = useState(1); // 0.5 … 2
  const containerRef = useRef(null);

  if (!data || data.length === 0) {
    return (
      <p style={{ color: "#9ca3af", textAlign: "center", padding: 32 }}>
        No tasks found.
      </p>
    );
  }

  const dates = data.flatMap((t) => [new Date(t.start), new Date(t.end)]);
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  // Pad by a few days
  minDate.setDate(minDate.getDate() - 2);
  maxDate.setDate(maxDate.getDate() + 4);

  const totalDays = Math.ceil((maxDate - minDate) / 86400000);
  const dayWidth = Math.round(28 * zoom); // px per day
  const chartWidth = totalDays * dayWidth;
  const rowHeight = 46;
  const labelWidth = 180;
  const headerHeight = 40;
  const todayOffset = Math.ceil((new Date() - minDate) / 86400000);

  function dayOffset(dateStr) {
    return Math.ceil((new Date(dateStr) - minDate) / 86400000);
  }

  // Build day ticks
  const ticks = [];
  const d = new Date(minDate);
  while (d <= maxDate) {
    ticks.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }

  // Month boundaries
  const months = [];
  let cur = new Date(minDate);
  while (cur <= maxDate) {
    const start = dayOffset(cur);
    const endOfMonth = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
    const end = Math.min(dayOffset(endOfMonth), totalDays);
    months.push({
      label: cur.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      x: start * dayWidth,
      width: (end - start) * dayWidth,
    });
    cur = endOfMonth;
  }

  const svgHeight = headerHeight + data.length * rowHeight + 8;

  return (
    <div>
      {/* controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <button
          onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.2).toFixed(1)))}
          style={btnStyle}
          title="Zoom out"
        >
          <ZoomOut size={14} />
        </button>
        <span
          style={{
            fontSize: 12,
            color: "#6b7280",
            minWidth: 40,
            textAlign: "center",
          }}
        >
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(3, +(z + 0.2).toFixed(1)))}
          style={btnStyle}
          title="Zoom in"
        >
          <ZoomIn size={14} />
        </button>

        {/* legend */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginLeft: "auto",
            flexWrap: "wrap",
          }}
        >
          {Object.entries(GANTT_STATUS_COLORS).map(([key, { bar }]) => (
            <div
              key={key}
              style={{ display: "flex", alignItems: "center", gap: 5 }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: bar,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: "#6b7280",
                  textTransform: "capitalize",
                }}
              >
                {key.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* scrollable chart */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <div style={{ display: "flex" }}>
          {/* fixed label column */}
          <div
            style={{
              flexShrink: 0,
              width: labelWidth,
              zIndex: 2,
              background: "#fff",
            }}
          >
            {/* header */}
            <div
              style={{
                height: headerHeight,
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#9ca3af",
                  letterSpacing: ".05em",
                  textTransform: "uppercase",
                }}
              >
                Task
              </span>
            </div>
            {data.map((task, i) => {
              const colors =
                GANTT_STATUS_COLORS[task.status] ?? GANTT_STATUS_COLORS.todo;
              return (
                <div
                  key={task.id}
                  style={{
                    height: rowHeight,
                    borderBottom: "1px solid #f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 14px",
                    gap: 8,
                    background: i % 2 === 0 ? "#fff" : "#fafafa",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: colors.bar,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ overflow: "hidden" }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#111827",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: labelWidth - 46,
                      }}
                    >
                      {task.name}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 10,
                        color: "#9ca3af",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {task.assignee}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* scrollable chart area */}
          <div
            ref={containerRef}
            style={{
              overflowX: "auto",
              flex: 1,
              position: "relative",
            }}
          >
            <svg
              width={chartWidth}
              height={svgHeight}
              style={{ display: "block" }}
            >
              {/* month headers */}
              {months.map((m, i) => (
                <g key={i}>
                  <rect
                    x={m.x}
                    y={0}
                    width={m.width}
                    height={headerHeight}
                    fill={i % 2 === 0 ? "#f9fafb" : "#f3f4f6"}
                  />
                  <text
                    x={m.x + m.width / 2}
                    y={24}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={700}
                    fill="#6b7280"
                  >
                    {m.label}
                  </text>
                </g>
              ))}

              {/* day grid lines */}
              {ticks.map((tick, i) => {
                const x = i * dayWidth;
                const isWeekend = tick.getDay() === 0 || tick.getDay() === 6;
                return (
                  <line
                    key={i}
                    x1={x}
                    x2={x}
                    y1={headerHeight}
                    y2={svgHeight}
                    stroke={isWeekend ? "#e5e7eb" : "#f3f4f6"}
                    strokeWidth={isWeekend ? 1 : 0.5}
                  />
                );
              })}

              {/* horizontal row stripes */}
              {data.map((_, i) => (
                <rect
                  key={i}
                  x={0}
                  y={headerHeight + i * rowHeight}
                  width={chartWidth}
                  height={rowHeight}
                  fill={i % 2 === 0 ? "transparent" : "rgba(0,0,0,.015)"}
                />
              ))}

              {/* header bottom border */}
              <line
                x1={0}
                x2={chartWidth}
                y1={headerHeight}
                y2={headerHeight}
                stroke="#e5e7eb"
                strokeWidth={1}
              />

              {/* today line */}
              {todayOffset >= 0 && todayOffset <= totalDays && (
                <g>
                  <line
                    x1={todayOffset * dayWidth}
                    x2={todayOffset * dayWidth}
                    y1={0}
                    y2={svgHeight}
                    stroke="#ef4444"
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                  />
                  <rect
                    x={todayOffset * dayWidth - 16}
                    y={2}
                    width={32}
                    height={16}
                    rx={4}
                    fill="#ef4444"
                  />
                  <text
                    x={todayOffset * dayWidth}
                    y={13}
                    textAnchor="middle"
                    fontSize={9}
                    fontWeight={700}
                    fill="#fff"
                  >
                    Today
                  </text>
                </g>
              )}

              {/* task bars */}
              {data.map((task, i) => {
                const colors =
                  GANTT_STATUS_COLORS[task.status] ?? GANTT_STATUS_COLORS.todo;
                const startDay = dayOffset(task.start);
                const endDay = dayOffset(task.end);
                const barStart = Math.min(startDay, endDay) * dayWidth;
                const barWidth = Math.max(
                  Math.abs(endDay - startDay) * dayWidth,
                  dayWidth,
                );
                const barY = headerHeight + i * rowHeight + 12;
                const barH = rowHeight - 24;

                return (
                  <g key={task.id}>
                    {/* track */}
                    <rect
                      x={barStart}
                      y={barY}
                      width={barWidth}
                      height={barH}
                      rx={barH / 2}
                      fill={colors.track}
                    />
                    {/* progress fill */}
                    <rect
                      x={barStart}
                      y={barY}
                      width={(barWidth * (task.progress ?? 0)) / 100}
                      height={barH}
                      rx={barH / 2}
                      fill={colors.bar}
                    />
                    {/* label inside bar if wide enough */}
                    {barWidth > 60 && (
                      <text
                        x={barStart + 10}
                        y={barY + barH / 2 + 4}
                        fontSize={10}
                        fontWeight={600}
                        fill={colors.bar}
                      >
                        {task.progress ?? 0}%
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

const btnStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "5px 8px",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  background: "#fff",
  cursor: "pointer",
  color: "#374151",
};

/* ══════════════════════════════════════════════════════════
   CALENDAR VIEW
══════════════════════════════════════════════════════════ */

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function CalendarView({ data }) {
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const firstDay = new Date(year, month, 1).getDay(); // 0-6
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map tasks by day-of-month
  const tasksByDay = {};
  (data ?? []).forEach((task) => {
    const d = new Date(task.dueDate ?? task.createdAt);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!tasksByDay[day]) tasksByDay[day] = [];
      tasksByDay[day].push(task);
    }
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const today = new Date();
  const isToday = (d) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === d;

  const selectedTasks =
    selected && tasksByDay[selected] ? tasksByDay[selected] : [];

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
        flexWrap: "wrap",
      }}
    >
      {/* Calendar grid */}
      <div
        style={{
          flex: "1 1 400px",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          background: "#fff",
          overflow: "hidden",
        }}
      >
        {/* header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <button
            style={{ ...btnStyle, padding: "4px 8px" }}
            onClick={() => {
              setCursor(new Date(year, month - 1, 1));
              setSelected(null);
            }}
          >
            <ChevronLeft size={14} />
          </button>
          <span style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>
            {cursor.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            style={{ ...btnStyle, padding: "4px 8px" }}
            onClick={() => {
              setCursor(new Date(year, month + 1, 1));
              setSelected(null);
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* day labels */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            background: "#f9fafb",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          {DAYS.map((d) => (
            <div
              key={d}
              style={{
                textAlign: "center",
                padding: "8px 0",
                fontSize: 11,
                fontWeight: 700,
                color: "#9ca3af",
                letterSpacing: ".05em",
                textTransform: "uppercase",
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* cells grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 0,
          }}
        >
          {cells.map((day, idx) => {
            const tasks = day ? (tasksByDay[day] ?? []) : [];
            const active = selected === day;
            const todayFlag = day && isToday(day);

            return (
              <div
                key={idx}
                onClick={() => day && setSelected(active ? null : day)}
                style={{
                  minHeight: 72,
                  padding: "6px 8px",
                  borderBottom: "1px solid #f3f4f6",
                  borderRight:
                    (idx + 1) % 7 !== 0 ? "1px solid #f3f4f6" : "none",
                  background: active
                    ? "#eff6ff"
                    : todayFlag
                      ? "#fefce8"
                      : "transparent",
                  cursor: day ? "pointer" : "default",
                  transition: "background .1s",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (day && !active)
                    e.currentTarget.style.background = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  if (day && !active && !todayFlag)
                    e.currentTarget.style.background = "transparent";
                  else if (day && todayFlag && !active)
                    e.currentTarget.style.background = "#fefce8";
                }}
              >
                {day && (
                  <>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        fontSize: 12,
                        fontWeight: todayFlag ? 700 : 500,
                        color: todayFlag
                          ? "#fff"
                          : active
                            ? "#2563eb"
                            : "#374151",
                        background: todayFlag ? "#2563eb" : "transparent",
                      }}
                    >
                      {day}
                    </span>

                    {/* task dots */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 3,
                        marginTop: 4,
                      }}
                    >
                      {tasks.slice(0, 3).map((t, i) => {
                        const pCfg =
                          PRIORITY_CONFIG[t.priority] ?? PRIORITY_CONFIG.medium;
                        return (
                          <span
                            key={i}
                            title={t.title}
                            style={{
                              display: "block",
                              width: "100%",
                              background: pCfg.color,
                              borderRadius: 3,
                              fontSize: 9,
                              color: "#fff",
                              padding: "1px 4px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              fontWeight: 600,
                            }}
                          >
                            {t.title}
                          </span>
                        );
                      })}
                      {tasks.length > 3 && (
                        <span style={{ fontSize: 9, color: "#9ca3af" }}>
                          +{tasks.length - 3}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* side panel */}
      <div
        style={{
          flex: "0 0 240px",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          background: "#fff",
          overflow: "hidden",
          minHeight: 200,
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #e5e7eb",
            background: "#f9fafb",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 700,
              color: "#374151",
            }}
          >
            {selected
              ? `Tasks — ${cursor.toLocaleDateString("en-US", { month: "short" })} ${selected}`
              : "Select a day"}
          </p>
        </div>
        <div style={{ padding: 12 }}>
          {!selected && (
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "#d1d5db",
                textAlign: "center",
                paddingTop: 24,
              }}
            >
              Click a date to see tasks
            </p>
          )}
          {selected && selectedTasks.length === 0 && (
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "#9ca3af",
                textAlign: "center",
                paddingTop: 24,
              }}
            >
              No tasks due on this day
            </p>
          )}
          {selectedTasks.map((t) => {
            const sCfg = STATUS_CONFIG[t.status] ?? STATUS_CONFIG.todo;
            const pCfg = PRIORITY_CONFIG[t.priority] ?? PRIORITY_CONFIG.medium;
            const StatusIcon = sCfg.icon;
            return (
              <div
                key={t._id}
                style={{
                  padding: "10px 12px",
                  border: `1px solid ${pCfg.border}`,
                  borderLeft: `3px solid ${pCfg.color}`,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              >
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  {t.title}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <StatusIcon size={11} color={sCfg.color} />
                  <span
                    style={{
                      fontSize: 10,
                      color: sCfg.color,
                      textTransform: "capitalize",
                    }}
                  >
                    {t.status?.replace("_", " ")}
                  </span>
                  <PriorityBadge priority={t.priority} />
                </div>
                {t.assignedTo?.name && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      marginTop: 6,
                    }}
                  >
                    <User size={10} color="#9ca3af" />
                    <span style={{ fontSize: 10, color: "#6b7280" }}>
                      {t.assignedTo.name}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */

export function ViewsTab({ projectId }) {
  const [view, setView] = useState("kanban");
  const [kanbanData, setKanbanData] = useState(null);
  const [ganttData, setGanttData] = useState(null);
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchKanban = useCallback(async () => {
    setLoading(true);
    try {
      const res = await taskApi.getKanbanBoard(projectId);
      setKanbanData(res.data?.data);
    } catch {
      toast.error("Failed to load Kanban board");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const fetchGantt = useCallback(async () => {
    setLoading(true);
    try {
      const res = await taskApi.getGanttChart(projectId);
      setGanttData(res.data?.data);
    } catch {
      toast.error("Failed to load Gantt chart");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const fetchCalendar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await taskApi.getCalendarView();
      setCalendarData(res.data?.data);
    } catch {
      toast.error("Failed to load calendar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!projectId) return;
    if (view === "kanban") fetchKanban();
    if (view === "gantt") fetchGantt();
    if (view === "calendar") fetchCalendar();
  }, [view, projectId]);

  if (!projectId) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Project ID not available.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* toggle */}
      <div className="flex justify-center">
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(val) => val && setView(val)}
        >
          <ToggleGroupItem value="kanban" aria-label="Kanban">
            <Kanban className="h-4 w-4 mr-1" /> Kanban
          </ToggleGroupItem>
          <ToggleGroupItem value="gantt" aria-label="Gantt">
            <BarChart4 className="h-4 w-4 mr-1" /> Gantt
          </ToggleGroupItem>
          <ToggleGroupItem value="calendar" aria-label="Calendar">
            <CalendarDays className="h-4 w-4 mr-1" /> Calendar
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* loading skeleton */}
      {loading && (
        <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground text-sm">
          <Loader className="h-4 w-4 animate-spin" />
          Loading {view}…
        </div>
      )}

      {/* views */}
      {!loading && view === "kanban" && kanbanData && (
        <KanbanView data={kanbanData} />
      )}
      {!loading && view === "gantt" && ganttData && (
        <GanttView data={ganttData} />
      )}
      {!loading && view === "calendar" && calendarData && (
        <CalendarView data={calendarData} />
      )}
    </div>
  );
}
