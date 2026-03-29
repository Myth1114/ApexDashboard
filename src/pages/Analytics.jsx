import { useStudents } from "../context/useStudents";
import {
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Area,
} from "recharts";
import "../pages/dashboard.css";

export default function Analytics() {
  const {
    students,
    loading,
    page,
    totalCount,
    limit,
    setPage,
    search,
    setSearch,
    status,
    setStatus,
    country,
    setCountry,
    sortBy,
    setSortBy,
    stats,
    analytics,
  } = useStudents();
  const totalStudents = stats.totalStudents;
  const getCountryKey = (country) =>
    country?.toLowerCase().replace(/\s+/g, "-");
  // ✅ Country Data (same logic)
  const countryStats = students.reduce((acc, student) => {
    const country = student.academic?.preferredCountry?.trim()?.toUpperCase();

    if (!country) return acc;

    if (!acc[country]) acc[country] = 0;
    acc[country] += 1;

    return acc;
  }, {});

  const countryData = Object.entries(countryStats).map(([country, count]) => ({
    country,
    count,
  }));

  // ✅ Status Data
  const statusStats = students.reduce((acc, student) => {
    const status = student.status || "Unknown";

    if (!acc[status]) acc[status] = 0;
    acc[status] += 1;

    return acc;
  }, {});

  const statusData = Object.entries(statusStats).map(([status, count]) => ({
    status,
    count,
  }));

  // ✅ Monthly Data
  const monthlyStats = students.reduce((acc, student) => {
    if (!student.created_at) return acc;

    const date = new Date(student.created_at);
    const month = date.toLocaleString("default", { month: "short" });

    if (!acc[month]) acc[month] = 0;
    acc[month] += 1;

    return acc;
  }, {});

  const monthlyData = Object.entries(monthlyStats).map(([month, count]) => ({
    month,
    count,
  }));
  const COUNTRY_GRADIENTS = {
    australia: ["rgb(107,119,250)", "rgb(63,76,250)"],
    canada: ["#ff416c", "#ff4b2b"],
    uk: ["rgba(69,209,200,1)", "rgba(31,181,172,1)"],
    "united-kingdom": ["rgba(69,209,200,1)", "rgba(31,181,172,1)"],
    usa: ["#396afc", "#2948ff"],
    china: ["rgba(255,120,120,1)", "rgba(255,22,22,1)"],
    "new-zealand": ["rgba(255,158,79,1)", "rgba(253,126,20,1)"],
  };

  const STATUS_COLORS = {
    Inquiry: ["#60a5fa", "#2563eb"],
    "Documents Pending": ["#fbbf24", "#f59e0b"],
    Applied: ["#a78bfa", "#7c3aed"],
    "Visa Approved": ["#34d399", "#059669"],
    Rejected: ["#f87171", "#dc2626"],
  };
  return (
    <div className="charts-grid fade-in-up">
      {/* 🌍 Country Chart */}
      <div className="chart-card">
        <h3>Students by Country</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={countryData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              {countryData.map((entry, index) => {
                const key = getCountryKey(entry.country);
                const gradient = COUNTRY_GRADIENTS[key];

                const start = gradient ? gradient[0] : "#4f46e5";
                const end = gradient ? gradient[1] : "#c7d2fe";
                return (
                  <linearGradient
                    key={index}
                    id={`bar-${key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={start} />
                    <stop offset="100%" stopColor={end} />
                  </linearGradient>
                );
              })}
            </defs>

            <XAxis
              dataKey="country"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />

            <Tooltip
              contentStyle={{
                background: "#ffffff",
                border: "none",
                borderRadius: "10px",
                color: "#000000",
              }}
              labelStyle={{ color: "#94a3b8" }}
              cursor={{
                stroke: "#6366f1",
                strokeWidth: 1.5,
                strokeDasharray: "3 3",
                opacity: 0.6,
              }}
            />
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              opacity={0.2}
            />
            <Bar dataKey="count" radius={[10, 10, 0, 0]}>
              {countryData.map((entry, index) => {
                const key = getCountryKey(entry.country);
                return <Cell key={index} fill={`url(#bar-${key})`} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 Status Pie */}
      <div className="chart-card">
        <h3>Status Distribution</h3>
        <ResponsiveContainer width="100%" height={260}>
          <div className="Piechart-wrapper">
            <PieChart width={250} height={250}>
              <defs>
                {statusData.map((entry, index) => {
                  const gradient = STATUS_COLORS[entry.status];

                  const start = gradient ? gradient[0] : "#4f46e5";
                  const end = gradient ? gradient[1] : "#c7d2fe";

                  return (
                    <linearGradient
                      key={index}
                      id={`status-${entry.status.replace(/\s+/g, "-")}`}
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={start} />
                      <stop offset="100%" stopColor={end} />
                    </linearGradient>
                  );
                })}
              </defs>
              <Pie
                data={statusData}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={`url(#status-${entry.status.replace(/\s+/g, "-")})`}
                  />
                ))}
              </Pie>
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="donut-center-text"
              >
                {/* {statusData.reduce(
                      (acc, item) => acc + (item.count || 0),
                      0
                    )} */}
                {stats.totalStudents}
              </text>
              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  color: "#000000",
                }}
                labelStyle={{ color: "#94a3b8" }}
                cursor={{
                  stroke: "#6366f1",
                  strokeWidth: 1.5,
                  strokeDasharray: "3 3",
                  opacity: 0.6,
                }}
              />
            </PieChart>

            <div className="status-legend">
              {statusData.map((item, index) => {
                const key = item.status.replace(/\s+/g, "-");
                const gradient = STATUS_COLORS[item.status];

                return (
                  <div key={index} className="legend-item">
                    <span
                      className="legend-dot"
                      style={{
                        background: gradient
                          ? `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`
                          : "#4f46e5",
                      }}
                    ></span>

                    <span className="legend-label">{item.status}</span>
                    <span className="legend-value">{item.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </ResponsiveContainer>
      </div>

      {/* 📈 Monthly Trend */}
      <div className="chart-card">
        <div className="chart-header">
          <h3>Student Growth</h3>
          <span className="chart-subtitle">Monthly trend</span>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={monthlyData}>
            {/* GRID (very soft) */}
            <CartesianGrid stroke="#1e293b" strokeDasharray="2 2" />

            {/* X AXIS */}
            <XAxis
              dataKey="month"
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            {/* Y AXIS */}
            <YAxis
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            {/* TOOLTIP */}
            <Tooltip
              contentStyle={{
                background: "#ffffff",
                border: "none",
                borderRadius: "10px",
                color: "#000000",
              }}
              labelStyle={{ color: "#94a3b8" }}
              cursor={{
                stroke: "#6366f1",
                strokeWidth: 1.5,
                strokeDasharray: "3 3",
                opacity: 0.6,
              }}
            />

            {/* GRADIENT AREA */}
            <defs>
              <linearGradient id="growthArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="growthLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
              <filter id="lineGlow" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* AREA (adds premium feel) */}
            <Area
              type="monotone"
              dataKey="count"
              stroke="none"
              fill="url(#growthArea)"
            />

            {/* LINE */}
            <Line
              type="monotone"
              dataKey="count"
              stroke="url(#growthLine)"
              strokeWidth={3}
              filter="url(#lineGlow)"
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-in-out"
              dot={{
                r: 4,
                stroke: "#6366f1",
                strokeWidth: 2,
                fill: "#0f172a",
                style: { transition: "all 0.3s ease" },
              }}
              activeDot={{
                r: 8,
                stroke: "#22c55e",
                strokeWidth: 3,
                fill: "#fff",
                style: { transition: "all 0.3s ease" },
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
