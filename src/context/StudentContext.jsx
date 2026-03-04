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
      id: Date.now().toString(),
      ...studentData,

      statusHistory: [
        {
          status: studentData.status,
          date: new Date().toISOString(),
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

  const updateStudent = (id, updatedData) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== id) return student;

        const statusChanged =
          updatedData.status && updatedData.status !== student.status;

        return {
          ...student,
          ...updatedData,
          statusHistory: statusChanged
            ? [
                ...(student.statusHistory || []),
                {
                  status: updatedData.status,
                  date: new Date().toISOString(),
                },
              ]
            : student.statusHistory || [],
        };
      })
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
