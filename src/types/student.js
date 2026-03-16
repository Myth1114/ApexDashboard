export const initialStudent = {
  personal: {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    passportNumber: "",
    gender: "",
  },
  contact: {
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  },
  academic: {
    preferredCountry: "",
    preferredUniversity: "",
    preferredCourse: "",
    intake: "",
    englishTest: "",
    englishTestScore: "",
    highestLevelofEducation: "",
    GPA: "",
  },
  documents: {
    passportCopy: null,
    transcript: null,
    cv: null,
  },
  status: "New Lead",
  notes: [],

  timeline: [
    {
      id: Date.now(),
      message: "Student profile created",
      date: new Date().toISOString(),
      type: "system",
    },
  ],
  statusHistory: [],
};
