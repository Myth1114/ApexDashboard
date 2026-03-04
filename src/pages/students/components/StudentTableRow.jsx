import { useStudents } from "../../../context/useStudents";
import { useNavigate } from "react-router-dom";
import "../../../styles/studentcard.css";

export default function StudentTableRow({ student }) {
  const { updateStudent, deleteStudent } = useStudents();
  const navigate = useNavigate();

  const handleStatusChange = (e) => {
    updateStudent(student.id, { status: e.target.value });
  };

  return (
    <tr className="student-row">
      <td>
        <div className="student-name">
          {student.personal.firstName} {student.personal.lastName}
        </div>
        <div className="student-email">{student.contact.email}</div>
      </td>
      <td>{student.academic.preferredCountry}</td>
      <td>{student.academic.preferredCourse}</td>

      <td>
        <select
          value={student.status}
          onChange={handleStatusChange}
          className="status-select"
        >
          <option value="New Lead">New Lead</option>
          <option value="Contacted">Contacted</option>
          <option value="In Process">In Process</option>
          <option value="Offer Received">Offer Received</option>
          <option value="Visa Approved">Visa Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </td>

      <td className="ThreeButtons">
        <button
          type="button"
          className="btn btn-view"
          onClick={() => navigate(`/students/${student.id}`)}
        >
          View
        </button>
        <button
          type="button"
          className="btn btn-edit"
          onClick={() => navigate(`/students/edit/${student.id}`)}
        >
          Edit
        </button>
        {/* <button
          type="button"
          className="btn btn-delete"
          onClick={() => deleteStudent(student.id)}
        >
          Delete
        </button> */}
      </td>
    </tr>
  );
}
