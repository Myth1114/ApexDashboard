import { useStudents } from "../context/useStudents";
import { useNavigate } from "react-router-dom";
import "./studentsrecord.css";
import { STATUS_CONFIG, STATUS_OPTIONS } from "../constants/StatusOptions";

export default function Studentsrecord() {
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
  } = useStudents();

  const navigate = useNavigate();

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="students-page">
      {/* 🔝 TOP CONTROL BAR */}
      <div className="students-header">
        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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

        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">All Countries</option>
          <option value="UK">UK</option>
          <option value="Australia">Australia</option>
          <option value="Canada">Canada</option>
          <option value="China">China</option>
          <option value="New Zealand">New Zealand</option>
        </select>

        <button onClick={() => navigate("/students/add")}>+ Add Student</button>
      </div>

      {/* 📊 TABLE */}
      <div className="students-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Country</th>
              <th>Course</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Loading...</td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="6">No students found</td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <span>
                      {student.personal?.firstName} {student.personal?.lastName}
                    </span>
                    <span>{student.contact?.email}</span>
                  </td>
                  <td>{student.contact?.phone || "-"}</td>
                  <td>{student.academic?.preferredCountry || "—"}</td>
                  <td>{student.academic?.preferredCourse || "—"}</td>
                  <td
                    className={`status-select ${
                      STATUS_CONFIG[student.status]?.className || ""
                    }`}
                  >
                    {student.status}
                  </td>

                  <td>
                    <button
                      className="btn btn-view"
                      onClick={() => navigate(`/students/${student.id}`)}
                    >
                      View
                    </button>

                    <button
                      className="btn btn-edit"
                      onClick={() => navigate(`/students/edit/${student.id}`)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 PAGINATION */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
