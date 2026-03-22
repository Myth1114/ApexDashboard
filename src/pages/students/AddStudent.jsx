import { useState, useEffect } from "react";
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

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };
  const prevStep = () => setStep((prev) => prev - 1);
  const [errors, setErrors] = useState({});
  const updateField = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const validateStep = () => {
    let newErrors = {};

    if (step === 1) {
      if (!formData.personal.firstName) {
        newErrors.firstName = "First name is required";
      }

      if (!formData.contact.email) {
        newErrors.email = "Email is required";
      } else if (!/^\S+@\S+\.\S+$/.test(formData.contact.email)) {
        newErrors.email = "Invalid email";
      }
    }

    if (step === 2) {
      if (!formData.academic.highestLevelofEducation) {
        newErrors.highestLevelofEducation = "Education Level is required";
      }
      if (!formData.academic.GPA) {
        newErrors.GPA = "GPA or Percentage is required";
      }
      if (!formData.academic.preferredCountry) {
        newErrors.preferredCountry = "Country is required";
      }
      if (!formData.academic.preferredUniversity) {
        newErrors.preferredUniversity = "University is required";
      }
      if (!formData.academic.preferredCourse) {
        newErrors.preferredCourse = "Course is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const savedDraft = localStorage.getItem("studentDraft");
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("studentDraft", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PersonalStep
            formData={formData}
            updateField={updateField}
            errors={errors}
          />
        );
      case 2:
        return (
          <AcademicStep
            formData={formData}
            updateField={updateField}
            errors={errors}
          />
        );
      case 3:
        return <DocumentsStep formData={formData} setFormData={setFormData} />;
      case 4:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    if (!validateStep()) return;
    addStudent(formData);
    localStorage.removeItem("studentDraft");
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
