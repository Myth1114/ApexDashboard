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

  // ADD STUDENT
  const addStudent = (studentData) => {
    const newStudent = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...studentData,

      statusHistory: [
        {
          status: studentData.status,
          date: new Date().toISOString(),
        },
      ],

      timeline: [
        {
          id: Date.now(),
          message: "Student profile created",
          date: new Date().toISOString(),
          type: "system",
        },
      ],

      documents: {
        passport: false,
        transcript: false,
        englishTest: false,
        sop: false,
        financialDocs: false,
        offerLetter: false,
        visaGrant: false,
      },
    };

    setStudents((prev) => [...prev, newStudent]);
  };

  // UPDATE STUDENT
  const updateStudent = (id, updates) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== id) return student;

        const newTimeline = [...(student.timeline || [])];
        const newStatusHistory = [...(student.statusHistory || [])];

        // If status changed
        if (updates.status && updates.status !== student.status) {
          newTimeline.push({
            id: Date.now(),
            message: `Status changed from ${student.status} to ${updates.status}`,
            date: new Date().toISOString(),
            type: "status",
          });

          newStatusHistory.push({
            status: updates.status,
            date: new Date().toISOString(),
          });
        }

        return {
          ...student,
          ...updates,
          timeline: newTimeline,
          statusHistory: newStatusHistory,
        };
      })
    );
  };

  // DELETE STUDENT
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
