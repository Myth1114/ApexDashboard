import { useState } from "react";
import { useStudents } from "../../../context/useStudents";
import "./taskmodal.css";

export default function TaskModal({ isOpen, onClose, studentId }) {
  const { createTask } = useStudents();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!title || !dueDate) {
      alert("Title and date required");
      return;
    }

    await createTask({
      title,
      description,
      dueDate,
      studentId,
    });

    onClose();
    setTitle("");
    setDescription("");
    setDueDate("");
  };

  return (
    <div className="modal-overlay">
      <div className="task-modal">
        <h2>📝 Add Reminder</h2>

        <input
          type="text"
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div className="modal-actions">
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="save" onClick={handleSubmit}>
            Save Task
          </button>
        </div>
      </div>
    </div>
  );
}
