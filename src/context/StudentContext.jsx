import { createContext, useEffect, useState } from "react";

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState(() => {
    const stored = localStorage.getItem("students");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const addStudent = (studentData) => {
    const newStudent = {
      ...studentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setStudents((prev) => [...prev, newStudent]);
  };

  const updateStudent = (id, updatedData) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, ...updatedData } : student
      )
    );
  };

  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        addStudent,
        updateStudent,
        deleteStudent,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};
