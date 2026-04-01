import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { STATUS_CONFIG } from "../../constants/StatusOptions";
import { useStudents } from "../../context/useStudents";
import "../../styles/studentdetail.css";
import "../students/components/common/ConfirmModal";
import ConfirmModal from "../students/components/common/ConfirmModal";
import Notes from "./components/Notes";
import Timeline from "./components/timeline/Timeline";
import { ListChecks } from "lucide-react";
import TaskModal from "./components/Taskmodal";
export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, deleteStudent, updateStudent } = useStudents();
  const student = students.find((s) => s.id === id);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [openTaskModal, setOpenTaskModal] = useState(false);

  if (!student) {
    return <div className="student-detail-container">Student not found</div>;
  }

  return (
    <div className="StudentDetailContainer">
      <div className="student-profile-card">
        <div className="card-top">
          <div className="avatar">
            {student.personal.firstName?.[0]}
            {student.personal.lastName?.[0]}
          </div>
          <div className="top-name-group">
            <div className="name">
              {student.personal.firstName} {student.personal.lastName}
            </div>
            <div className="role">Student Applicant</div>
          </div>
          <span
            className={`status-badge ${
              STATUS_CONFIG[student.status]?.className || ""
            }`}
          >
            {STATUS_CONFIG[student.status]?.label}
          </span>
          <div class="actions">
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
            <button
              className="btn btn-primary"
              onClick={() => setOpenTaskModal(true)}
            >
              + Add Reminder
            </button>
          </div>
        </div>
        <div className="card-body">
          {/* <!-- Personal Information --> */}
          <div className="section">
            <div className="section-title">Personal Information</div>
            <div className="field-row">
              <span className="field-label">Phone</span>
              <span className="field-value">{student.contact.phone}</span>
            </div>
            <div className="field-row">
              <span className="field-label">Email</span>
              <span className="field-value"> {student.contact.email}</span>
            </div>
            <div className="field-row">
              <span className="field-label">Gender</span>
              <span className="field-value"> {student.personal.gender}</span>
            </div>
            <div className="field-row">
              <span className="field-label">Date of Birth</span>
              <span className="field-value">
                {" "}
                {student.personal.dateOfBirth}
              </span>
            </div>
          </div>

          {/* <!-- Academic Information --> */}
          <div className="section">
            <div className="section-title">Academic Information</div>
            <div className="field-row">
              <span className="field-label">Education Level</span>
              <span className="field-value">
                {student.academic.highestLevelofEducation}
              </span>
            </div>
            <div className="field-row">
              <span className="field-label">GPA / Percentage</span>
              <span className="field-value"> {student.academic.GPA}</span>
            </div>
            <div className="field-row">
              <span className="field-label">Preferred Country</span>
              <span className="field-value">
                {student.academic.preferredCountry}
              </span>
            </div>
            <div className="field-row">
              <span className="field-label">Course</span>
              <span className="field-value">
                {student.academic.preferredCourse}
              </span>
            </div>
            <div className="field-row">
              <span className="field-label">Intake</span>
              <span className="field-value">
                <span className="tag">{student.academic.intake}</span>
              </span>
            </div>
          </div>
        </div>
        {/* <div className="detail-header">
          <div>
            <h2 className="student-name">
              {student.personal.firstName} {student.personal.lastName}
            </h2>
          </div>
          <div
            className={`status-badge ${
              STATUS_CONFIG[student.status]?.className || ""
            }`}
          >
            {STATUS_CONFIG[student.status]?.label}
          </div>
        </div> */}
        {/* <div className="detail-section">
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
        </div> */}

        {/* <div className="detail-section">
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
        </div> */}

        {/* <div className="button-group">
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
        </div> */}
      </div>
      <div className="student-detail-container">
        <div className="document-grid">
          <h3>
            <ListChecks className="titleIcons" />
            Document Checklist
          </h3>
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
        <TaskModal
          isOpen={openTaskModal}
          onClose={() => setOpenTaskModal(false)}
          studentId={student.id}
        />
      </div>
    </div>
  );
}
