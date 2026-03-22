import { useParams, useNavigate } from "react-router-dom";
import { useStudents } from "../../context/useStudents";
import { useState, useEffect } from "react";
import PersonalStep from "./components/step/PersonalStep";
import AcademicStep from "./components/step/AcademicStep";
import DocumentsStep from "./components/step/DocumentsStep";
import ReviewStep from "./components/step/ReviewStep";
import StepIndicator from "./components/StepIndicator";
import "../../styles/addstudents.css";
import ConfirmModal from "./components/common/ConfirmModal";
import { initialStudent } from "../../types/student";
import Spinner from "./components/Spinner";
import { supabase } from "../../lib/supabase";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, updateStudent } = useStudents();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState(initialStudent);
  const [loading, setLoading] = useState(true);
  const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  useEffect(() => {
    const savedDraft = localStorage.getItem(`editStudentDraft_${id}`);
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
    }
  }, [id]);

  useEffect(() => {
    localStorage.setItem(`editStudentDraft_${id}`, JSON.stringify(formData));
  }, [formData, id]);
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

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .single();
      if (data) {
        setFormData({
          personal: {
            firstName: data.personal?.firstName || "",
            lastName: data.personal?.lastName || "",
            gender: data.personal?.gender || "",
            dateOfBirth: data.personal?.dateOfBirth || "",
            nationality: data.personal?.nationality || "",
            passportNumber: data.personal?.passportNumber || "",
          },
          contact: {
            email: data.contact?.email || "",
            phone: data.contact?.phone || "",
            address: data.contact?.address || "",
            city: data.contact?.city || "",
            country: data.contact?.country || "",
          },
          academic: data.academic || {},
          documents: data.documents || {},
          status: data.status || "New Lead",
          notes: data.notes || [],
          timeline: data.timeline || [],
          statusHistory: data.statusHistory || [],
        });
      } else {
        console.error(error);
      }
      setLoading(false);
    };
    fetchStudent();
  }, [id]);

  if (
    loading ||
    !formData?.personal ||
    !formData?.contact ||
    !formData?.academic
  ) {
    return <Spinner />;
  }

  const updateField = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };
  const confirmUpdate = () => {
    handleUpdate();
    setIsEditConfirmOpen(false);
  };
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PersonalStep
            formData={formData}
            updateField={updateField}
            errors={{}}
          />
        );
      case 2:
        return (
          <AcademicStep
            formData={formData}
            updateField={updateField}
            errors={{}}
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

  const handleUpdate = () => {
    const payload = {
      personal: formData.personal,
      contact: formData.contact,
      academic: formData.academic, // ✅ keep as object
      documents: formData.documents,
      status: formData.status,
      notes: formData.notes,
      timeline: formData.timeline,
      statusHistory: formData.statusHistory,
    };

    updateStudent(id, payload);
    localStorage.removeItem(`editStudentDraft_${id}`);
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
          <button
            className="btn btn-success"
            type="button"
            onClick={() => setIsEditConfirmOpen(true)}
          >
            Update Student
          </button>
        )}
      </div>
      <ConfirmModal
        isOpen={isEditConfirmOpen}
        title="Confirm Update"
        message="Are you sure you want to update this student's information?"
        onCancel={() => setIsEditConfirmOpen(false)}
        onConfirm={confirmUpdate}
      />
    </div>
  );
}
