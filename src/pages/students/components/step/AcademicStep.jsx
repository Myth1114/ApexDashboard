import Input from "../Input";
import "../../../../styles/steps.css";

export default function AcademicStep({ formData, updateField }) {
  return (
    <div className="academic-grid">
      <Input
        label="Preferred Country"
        value={formData.academic.preferredCountry}
        onChange={(e) =>
          updateField("academic", "preferredCountry", e.target.value)
        }
      />

      <Input
        label="Preferred University"
        value={formData.academic.preferredUniversity}
        onChange={(e) =>
          updateField("academic", "preferredUniversity", e.target.value)
        }
      />

      <Input
        label="Preferred Course"
        value={formData.academic.preferredCourse}
        onChange={(e) =>
          updateField("academic", "preferredCourse", e.target.value)
        }
      />
      <Input
        label="Intake"
        value={formData.academic.intake}
        onChange={(e) => updateField("academic", "intake", e.target.value)}
      />

      <Input
        label="IELTS/PTE Test Score (if)"
        value={formData.academic.englishTestScore}
        onChange={(e) =>
          updateField("academic", "englishTestScore", e.target.value)
        }
      />
    </div>
  );
}
