import { useState } from "react";
import { useStudents } from "../../../context/useStudents";
import { useNavigate } from "react-router-dom";

import ConfirmModal from "./common/ConfirmModal";
import {
  STATUS_OPTIONS,
  STATUS_CONFIG,
} from "../../../constants/StatusOptions";

import "../../../styles/studentcard.css";

export default function StudentTableRow({ student }) {
  const { updateStudent, deleteStudent } = useStudents();
  const navigate = useNavigate();

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  const confirmStatusChange = () => {
    if (!pendingStatus) return;
    updateStudent(student.id, { status: pendingStatus });
    setPendingStatus(null);
    setIsStatusModalOpen(false);
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
          className={`status-select ${
            STATUS_CONFIG[student.status]?.className || ""
          }`}
          value={student.status}
          onChange={(e) => {
            const newStatus = e.target.value;

            if (newStatus === student.status) return;

            setPendingStatus(newStatus);
            setIsStatusModalOpen(true);
          }}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {STATUS_CONFIG[status].label}
            </option>
          ))}
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
      <ConfirmModal
        isOpen={isStatusModalOpen}
        title="Confirm Status Change"
        message={
          pendingStatus
            ? `You are changing status from 
"${student.status}" 
to 
"${pendingStatus}". 

Do you want to proceed?`
            : ""
        }
        onCancel={() => {
          setIsStatusModalOpen(false);
          setPendingStatus(null);
        }}
        onConfirm={confirmStatusChange}
        isDanger={true}
      />
    </tr>
  );
}
