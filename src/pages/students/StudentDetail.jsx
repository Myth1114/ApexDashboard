import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStudents } from "../../context/useStudents";
import "../../styles/studentdetail.css";
import "../students/components/common/ConfirmModal";
import ConfirmModal from "../students/components/common/ConfirmModal";

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, deleteStudent } = useStudents();
  const student = students.find((s) => s.id === id);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const getStatusClass = (status) => {
    switch (status) {
      case "Visa Approved":
        return "status-visa";
      case "Rejected":
        return "status-rejected";
      case "In Process":
        return "status-process";
      case "Offer Received":
        return "status-offer";
      case "Contacted":
        return "status-contacted";
      case "New Lead":
      default:
        return "status-new";
    }
  };
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

          <div className={`status-badge ${getStatusClass(student.status)}`}>
            {student.status}
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
