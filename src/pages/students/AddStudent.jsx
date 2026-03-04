import { useState } from "react";
import { initialStudent } from "../../types/student";
import StepIndicator from "./components/StepIndicator";

import PersonalStep from "./components/step/PersonalStep";
import AcademicStep from "./components/step/AcademicStep";
import DocumentsStep from "./components/step/DocumentsStep";
import ReviewStep from "./components/step/ReviewStep";

import { useStudents } from "../../context/useStudents";
import ConfirmModal from "./components/common/ConfirmModal";
import { useNavigate } from "react-router-dom";

export default function AddStudent() {
  const { addStudent } = useStudents();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialStudent);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const navigate = useNavigate();
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

  const handleSubmit = () => {
    addStudent(formData); // your context function
    navigate("/");
  };
  const confirmSubmit = () => {
    handleSubmit();
    setIsSubmitOpen(false);
  };
  return (
    <div className="container">
      <StepIndicator step={step} />

      <div className="card">{renderStep()}</div>

      <div className="button-group">
        {/* Back Button */}
        {step > 1 && (
          <button onClick={prevStep} className="btn btn-primary">
            Back
          </button>
        )}

        {/* Next or Submit */}
        {step < 4 ? (
          <button onClick={nextStep} className="btn btn-primary">
            Next
          </button>
        ) : (
          <button
            onClick={() => setIsSubmitOpen(true)}
            className="btn btn-success"
          >
            Submit Student
          </button>
        )}
      </div>
      <ConfirmModal
        isOpen={isSubmitOpen}
        title="Submit Student"
        message="Are you sure you want to submit this student information?"
        onCancel={() => setIsSubmitOpen(false)}
        onConfirm={confirmSubmit}
      />
    </div>
  );
}
