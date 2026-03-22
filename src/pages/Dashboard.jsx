import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStudents } from "../context/useStudents";
import StudentTableRow from "./students/components/StudentTableRow";
import { signOut } from "../lib/auth";
import "./dashboard.css";
import { STATUS_CONFIG, STATUS_OPTIONS } from "../constants/StatusOptions";
import Spinner from "./students/components/Spinner";
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
} from "recharts";
import { Area } from "recharts";
export default function Dashboard() {
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
  } = useStudents();
  const navigate = useNavigate();

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const totalPages = Math.ceil(totalCount / limit);
  const totalStudents = stats.totalStudents;

  const pendingApplications = stats.pendingApplications;

  const visaApprovedCount = stats.visaApproved;

  const getCountryKey = (country) =>
    country?.toLowerCase().replace(/\s+/g, "-");
  const countryStats = students.reduce((acc, student) => {
    const country = student.academic?.preferredCountry?.trim()?.toUpperCase();
    if (!country) return acc; // ignore empty countries
    if (!acc[country]) {
      acc[country] = 0;
    }
    acc[country] += 1;
    return acc;
  }, {});

  const countryData = Object.entries(countryStats).map(([country, count]) => ({
    country,
    count,
  }));

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

  const filteredStudents = students.filter((student) => {
    const firstName = student.personal?.firstName || "";
    const lastName = student.personal?.lastName || "";
    const email = student.personal?.email || "";

    const fullText = `${firstName} ${lastName} ${email}`.toLowerCase();

    return fullText.includes(debouncedSearch.toLowerCase());
  });

  const handleLogout = async () => {
    await signOut();
    navigate("/login"); // 🔥 IMPORTANT
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

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

  const monthlyStats = students.reduce((acc, student) => {
    if (!student.created_at) return acc;

    const date = new Date(student.created_at);
    const month = date.toLocaleString("default", { month: "short" });

    if (!acc[month]) acc[month] = 0;
    acc[month] += 1;

    return acc;
  }, {});

  // Convert to array
  const monthlyData = Object.entries(monthlyStats).map(([month, count]) => ({
    month,
    count,
  }));
  return (
    <>
      <div className="dashboard-wrapper">
        {loading && (
          <div className="loading-overlay">
            <Spinner />
          </div>
        )}
        <div className="kpi-grid">
          <div className="kpi-card totalStudents fade-in-up">
            <div className="kpi-title">Total Students</div>
            <div className="kpi-value">{totalStudents}</div>
          </div>

          <div className="kpi-card pendingApplications fade-in-up">
            <div className="kpi-title">Pending Applications</div>
            <div className="kpi-value">{pendingApplications}</div>
          </div>

          <div className="kpi-card visaApproved fade-in-up">
            <div className="kpi-title">Visa Approved</div>
            <div className="kpi-value">{visaApprovedCount}</div>
          </div>
        </div>
        <div className="charts-grid fade-in-up">
          {/* Country Chart */}
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

                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

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

          {/* Status Chart */}
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
                        fill={`url(#status-${entry.status.replace(
                          /\s+/g,
                          "-"
                        )})`}
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
                    {statusData.reduce(
                      (acc, item) => acc + (item.count || 0),
                      0
                    )}
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
        </div>
        <div className="chart-card fade-in-up">
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
        {/* countries */}
        <div className="country-section fade-in-up">
          <h3>Applications by Country</h3>

          <div className="country-grid">
            {countryData.map(({ country, count }) => (
              <div
                key={country}
                className={`country-card ${country
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                onClick={() => setCountry(country)}
              >
                <div className="country-name">{country}</div>
                <div className="country-count">{count}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Student Table */}
        <div className="student-table-container fade-in-up">
          <div className="table-header">
            <h3>Recent Students</h3>
            {/* <input
            type="text"
            placeholder="Search student..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          /> */}
          </div>
          <div className="dashboard-controls">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />

            <select
              className="filter-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Status</option>

              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {STATUS_CONFIG[status].label}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>

          <table className="student-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Country</th>
                <th>Course</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">
                    {search
                      ? `No results found for "${search}"`
                      : "No students yet. Add your first student 🚀"}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <StudentTableRow key={student.id} student={student} />
                ))
              )}
            </tbody>
          </table>
          <div className="pagination-container">
            <button
              className="pagination-btn"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              ◀
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`pagination-number ${
                  page === index + 1 ? "active" : ""
                }`}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="pagination-btn"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              ▶
            </button>
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </>
  );
}
