import { useState, useEffect } from "react";
import { useStudents } from "../context/useStudents";
import StudentTableRow from "./students/components/StudentTableRow";

import "./dashboard.css";
import { STATUS_CONFIG, STATUS_OPTIONS } from "../constants/StatusOptions";

export default function Dashboard() {
  const { students } = useStudents();
  const [search, setSearch] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [countryFilter, setCountryFilter] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400); // 400ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredStudents = students
    .filter((student) => {
      const firstName = student.personal?.firstName || "";
      const lastName = student.personal?.lastName || "";
      const email = student.personal?.email || "";

      const fullName = `${firstName} ${lastName}`.toLowerCase();
      const searchValue = debouncedSearch.toLowerCase();

      const matchesSearch =
        fullName.includes(searchValue) ||
        email.toLowerCase().includes(searchValue);

      const matchesStatus = !statusFilter || student.status === statusFilter;

      const matchesCountry =
        !countryFilter || student.academic?.preferredCountry === countryFilter;

      return matchesSearch && matchesStatus && matchesCountry;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === "name") {
        const nameA = a.personal?.firstName || "";
        const nameB = b.personal?.firstName || "";
        return nameA.localeCompare(nameB);
      }
      return 0;
    });

  const totalStudents = students.length;

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
    const country = student.academic?.preferredCountry?.trim();

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
  return (
    <>
      <div className="dashboard-header fade-in-up">
        <h1>Dashboard Overview</h1>
      </div>

      {/* KPI Cards */}
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
              onClick={() => setCountryFilter(country)}
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
      </div>
    </>
  );
}
