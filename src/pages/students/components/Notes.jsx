import { useState } from "react";
import { useStudents } from "../../../context/useStudents";

export default function Notes({ student }) {
  const { addNote } = useStudents();
  const [noteText, setNoteText] = useState("");

  const handleAddNote = () => {
    if (!noteText.trim()) return;

    addNote(student.id, noteText);
    setNoteText("");
  };

  return (
    <div className="notes-container">
      <h3>Notes</h3>

      <div className="notes-list">
        {student.notes?.map((note) => (
          <div key={note.id} className="note-card">
            <p>{note.message}</p>

            <small>
              {note.author} • {new Date(note.date).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
      <textarea
        placeholder="Write a note..."
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleAddNote}>
        Add Note
      </button>
    </div>
  );
}
