import { useState } from "react";
import { useStudents } from "../context/useStudents";
import StudentTableRow from "./students/components/StudentTableRow";

import "./dashboard.css";

export default function Dashboard() {
  const { students } = useStudents();
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const filteredStudents = students
    .filter((student) => {
      const fullName =
        `${student.personal.firstName} ${student.personal.lastName}`.toLowerCase();

      const matchesSearch =
        fullName.includes(searchTerm.toLowerCase()) ||
        student.personal.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || student.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === "name") {
        return a.personal.firstName.localeCompare(b.personal.firstName);
      }
      return 0;
    });
  return (
    <>
      <div className="dashboard-header fade-in-up">
        <h1>Dashboard Overview</h1>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card fade-in-up">
          <div className="kpi-title">Total Students</div>
          <div className="kpi-value">{students.length}</div>
        </div>

        <div className="kpi-card fade-in-up">
          <div className="kpi-title">Pending Applications</div>
          <div className="kpi-value">3</div>
        </div>

        <div className="kpi-card fade-in-up">
          <div className="kpi-title">Visa Approved</div>
          <div className="kpi-value">4</div>
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Status</option>
            <option value="New Lead">New Lead</option>
            <option value="Contacted">Contacted</option>
            <option value="In Process">In Process</option>
            <option value="Offer Received">Offer Received</option>
            <option value="Visa Approved">Visa Approved</option>
            <option value="Rejected">Rejected</option>
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
