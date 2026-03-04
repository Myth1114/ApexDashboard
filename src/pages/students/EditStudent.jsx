import { useParams, useNavigate } from "react-router-dom";
import { useStudents } from "../../context/useStudents";
import { useState } from "react";
import PersonalStep from "./components/step/PersonalStep";
import AcademicStep from "./components/step/AcademicStep";
import DocumentsStep from "./components/step/DocumentsStep";
import ReviewStep from "./components/step/ReviewStep";
import StepIndicator from "./components/StepIndicator";
import "../../styles/addstudents.css";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, updateStudent } = useStudents();

  const existingStudent = students.find((s) => s.id === id);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(existingStudent);

  if (!existingStudent) {
    return <div className="add-student-container">Student not found</div>;
  }

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const updateField = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PersonalStep formData={formData} updateField={updateField} />;
      case 2:
        return <AcademicStep formData={formData} updateField={updateField} />;
      case 3:
        return <DocumentsStep formData={formData} setFormData={setFormData} />;
      case 4:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  const handleUpdate = () => {
    updateStudent(id, formData);
    navigate(`/students/${id}`);
  };

  return (
    <div className="container">
      <StepIndicator step={step} />

      <div className="card">{renderStep()}</div>

      <div className="button-group">
        {step > 1 && (
          <button className="btn btn-primary" onClick={prevStep}>
            Back
          </button>
        )}

        {step < 4 ? (
          <button className="btn btn-primary" onClick={nextStep}>
            Next
          </button>
        ) : (
          <button className="btn btn-success" onClick={handleUpdate}>
            Update Student
          </button>
        )}
      </div>
    </div>
  );
}
