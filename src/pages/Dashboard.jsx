import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStudents } from "../context/useStudents";
import StudentTableRow from "./students/components/StudentTableRow";
import { signOut } from "../lib/auth";
import "./dashboard.css";
import { STATUS_CONFIG, STATUS_OPTIONS } from "../constants/StatusOptions";
import Spinner from "./students/components/Spinner";

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
  } = useStudents();
  const navigate = useNavigate();

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const totalPages = Math.ceil(totalCount / limit);
  const totalStudents = totalCount;

  const pendingApplications = students.filter(
    (s) =>
      s.status === "Inquiry" ||
      s.status === "Documents Pending" ||
      s.status === "Applied"
  ).length;

  const visaApprovedCount = students.filter(
    (s) => s.status === "Visa Approved"
  ).length;

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
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="">
          <div className="kpi-grid">
            <div className="kpi-card fade-in-up">
              <div className="kpi-title">Total Students</div>
              <div className="kpi-value">{totalStudents}</div>
            </div>

            <div className="kpi-card fade-in-up">
              <div className="kpi-title">Pending Applications</div>
              <div className="kpi-value">{pendingApplications}</div>
            </div>

            <div className="kpi-card fade-in-up">
              <div className="kpi-title">Visa Approved</div>
              <div className="kpi-value">{visaApprovedCount}</div>
            </div>
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
                {loading ? (
                  <tr>
                    <td colSpan="5">
                      <Spinner />
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="no-data">
                      No students found.
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
      )}
    </>
  );
}
