import { createContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  // FETCH STUDENTS
  const fetchStudents = async () => {
    const { data, error } = await supabase.from("students").select("*");

    if (!error) {
      setStudents(data);
    } else {
      console.error(error);
    }
  };

  // ADD NOTE
  const addNote = async (studentId, message) => {
    const student = students.find((s) => s.id === studentId);

    const newNote = {
      id: Date.now(),
      message,
      author: "Admin",
      date: new Date().toISOString(),
    };

    const updatedNotes = [...(student.notes ?? []), newNote];

    const { data, error } = await supabase
      .from("students")
      .update({ notes: updatedNotes })
      .eq("id", studentId)
      .select();

    if (!error) {
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? data[0] : s))
      );
    }
  };

  // ADD STUDENT
  const addStudent = async (studentData) => {
    const { data, error } = await supabase
      .from("students")
      .insert([studentData])
      .select();

    if (!error) {
      setStudents((prev) => [...prev, data[0]]);
    }
  };

  // UPDATE STUDENT
  const updateStudent = async (id, updates) => {
    const student = students.find((s) => s.id === id);

    const newTimeline = [...(student.timeline || [])];

    if (updates.status && updates.status !== student.status) {
      newTimeline.push({
        id: Date.now(),
        message: `Status changed from ${student.status} to ${updates.status}`,
        date: new Date().toISOString(),
        type: "status",
      });
    }

    const { data, error } = await supabase
      .from("students")
      .update({
        ...updates,
        timeline: newTimeline,
      })
      .eq("id", id)
      .select();

    if (!error) {
      setStudents((prev) => prev.map((s) => (s.id === id ? data[0] : s)));
    }
  };

  // DELETE STUDENT
  const deleteStudent = async (id) => {
    await supabase.from("students").delete().eq("id", id);

    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        addNote,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};
