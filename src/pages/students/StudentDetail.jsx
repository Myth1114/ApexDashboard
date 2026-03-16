import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { STATUS_CONFIG } from "../../constants/StatusOptions";
import { useStudents } from "../../context/useStudents";
import "../../styles/studentdetail.css";
import "../students/components/common/ConfirmModal";
import ConfirmModal from "../students/components/common/ConfirmModal";
import Notes from "./components/Notes";
import Timeline from "./components/timeline/Timeline";

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, deleteStudent, updateStudent } = useStudents();
  const student = students.find((s) => s.id === id);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (!student) {
    return <div className="student-detail-container">Student not found</div>;
  }

  return (
    <div className="student-detail-container">
      <div className="student-profile-card">
        <div className="detail-header">
          <div>
            <h2 className="student-name">
              {student.personal.firstName} {student.personal.lastName}
            </h2>
            {/* <p className="student-email">{student.contact.email}</p> */}
          </div>

          <div
            className={`status-badge ${
              STATUS_CONFIG[student.status]?.className || ""
            }`}
          >
            {STATUS_CONFIG[student.status]?.label}
          </div>
        </div>

        <div className="detail-section">
          <h3>Personal Information</h3>
          <p>
            <strong>Phone:</strong> {student.contact.phone}
          </p>
          <p>
            <strong>Email: </strong>
            {student.contact.email}
          </p>
          <p>
            <strong>Gender: </strong>
            {student.personal.gender}
          </p>
          <p>
            <strong>Date of Birth: </strong>
            {student.personal.dateOfBirth}
          </p>
        </div>

        <div className="detail-section">
          <h3>Academic Information</h3>
          <p>
            <strong>Highest Level of Education:</strong>
            {student.academic.highestLevelofEducation}
          </p>
          <p>
            <strong>GPA or Percentage:</strong>
            {student.academic.GPA}
          </p>
          <p>
            <strong>Preferred Country:</strong>
            {student.academic.preferredCountry}
          </p>
          <p>
            <strong>Course:</strong> {student.academic.preferredCourse}
          </p>
          <p>
            <strong>Intake:</strong> {student.academic.intake}
          </p>
        </div>

        <div className="button-group">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate(`/students/edit/${student.id}`)}
          >
            Edit
          </button>

          <button
            type="button"
            className="btn btn-delete"
            onClick={() => setIsDeleteOpen(true)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="document-grid">
        <h3>Document Checklist</h3>
        <div className="documentItems">
          {Object.keys(student.documents).map((docKey) => (
            <label key={docKey} className="document-item">
              <input
                type="checkbox"
                checked={student.documents[docKey]}
                onChange={() =>
                  updateStudent(student.id, {
                    documents: {
                      ...student.documents,
                      [docKey]: !student.documents[docKey],
                    },
                  })
                }
              />
              {docKey}
            </label>
          ))}
        </div>
      </div>

      <Timeline timeline={student.timeline} />
      <Notes student={student} />
      <ConfirmModal
        isOpen={isDeleteOpen}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          deleteStudent(student.id);
          navigate("/");
        }}
      />
    </div>
  );
}
