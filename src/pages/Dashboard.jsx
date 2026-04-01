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
    analytics,
    fetchTodayTasks,
    todayTasks,
    markTaskComplete,
    overdueTasks,
    upcomingTasks,
  } = useStudents();
  const navigate = useNavigate();

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const totalPages = Math.ceil(totalCount / limit);
  const totalStudents = stats.totalStudents;

  const pendingApplications = stats.pendingApplications;

  const visaApprovedCount = stats.visaApproved;

  const getCountryKey = (country) =>
    country?.toLowerCase().replace(/\s+/g, "-");

  const filteredStudents = students.filter((student) => {
    const firstName = student.personal?.firstName || "";
    const lastName = student.personal?.lastName || "";
    const email = student.personal?.email || "";
    const fullText = `${firstName} ${lastName} ${email}`.toLowerCase();
    return fullText.includes(debouncedSearch.toLowerCase());
  });

  console.log(todayTasks);
  const countryData = Object.entries(analytics?.countries || {}).map(
    ([country, count]) => ({
      country,
      count,
    })
  );
  // console.log(countryData);

  const statusData = Object.entries(analytics?.status || {}).map(
    ([status, count]) => ({
      status,
      count,
    })
  );
  const monthlyData = Object.entries(analytics?.monthly || {}).map(
    ([month, count]) => ({
      month,
      count,
    })
  );

  // ✅ FIX ORDER (IMPORTANT)
  const monthOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  monthlyData.sort(
    (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
  );
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
  useEffect(() => {
    fetchTodayTasks();
  }, []);
  useEffect(() => {
    fetchTodayTasks();
  }, [students]);

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

        <div className="tasks-wrapper">
          <h2>Task Reminder</h2>
          {/* 🔴 OVERDUE */}
          {overdueTasks.length > 0 && (
            <div className="tasks-card overdue">
              <h3>🔴 Overdue</h3>

              {overdueTasks.map((task) => (
                <div className="task-item-minimal">
                  <div className="task-left">
                    <span className="task-dot"></span>

                    <span className="task-title">{task.title}</span>
                    <span className="task-description">{task.description}</span>

                    <span className="task-student">
                      {task.students?.personal?.firstName}{" "}
                      {task.students?.personal?.lastName}
                    </span>
                  </div>

                  <div className="task-right">
                    <span className="task-time">
                      {new Date(task.due_date).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>

                    <button onClick={() => markTaskComplete(task.id)}>✔</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 🟡 TODAY */}
          <div className="tasks-card today">
            <h3>🟡 Today</h3>

            {todayTasks.length === 0 ? (
              <p>No tasks 🎉</p>
            ) : (
              todayTasks.map((task) => (
                <div className="task-item-minimal">
                  <div className="task-left">
                    <span className="task-dot"></span>

                    <span className="task-title">{task.title}</span>
                    <span className="task-description">{task.description}</span>

                    <span className="task-student">
                      {task.students?.personal?.firstName}{" "}
                      {task.students?.personal?.lastName}
                    </span>
                  </div>

                  <div className="task-right">
                    <span className="task-time">
                      {new Date(task.due_date).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>

                    <button onClick={() => markTaskComplete(task.id)}>✔</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 🔵 UPCOMING */}
          {upcomingTasks.length > 0 && (
            <div className="tasks-card upcoming">
              <h3>🔵 Upcoming</h3>

              {upcomingTasks.map((task) => (
                <div className="task-item-minimal">
                  <div className="task-left">
                    <span className="task-dot"></span>

                    <span className="task-title">{task.title}</span>
                    <span className="task-description">{task.description}</span>

                    <span className="task-student">
                      {task.students?.personal?.firstName}{" "}
                      {task.students?.personal?.lastName}
                    </span>
                  </div>

                  <div className="task-right">
                    <span className="task-time">
                      {new Date(task.due_date).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>

                    <button onClick={() => markTaskComplete(task.id)}>✔</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* countries */}
        <div className="countrysection fade-in-up">
          <h2>Applications by Country</h2>

          <div className="countrygrid">
            {countryData.map(({ country, count }) => (
              <div
                key={country}
                className={`countrycard ${country
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                onClick={() => setCountry(country)}
              >
                <div className="countryname">{country}</div>
                <div className="countrycount">{count}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Student Table */}
        <div className="student-table-container fade-in-up">
          <div className="table-header">
            <h2>Recent Students</h2>
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
