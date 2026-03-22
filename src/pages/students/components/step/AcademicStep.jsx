import Input from "../Input";
import "../../../../styles/steps.css";

export default function AcademicStep({ formData, updateField, errors }) {
  return (
    <div className="academic-grid">
      <Input
        label="Highest Level of Education"
        value={formData.academic.highestLevelofEducation}
        onChange={(e) =>
          updateField("academic", "highestLevelofEducation", e.target.value)
        }
        required
        error={errors.highestLevelofEducation}
      />
      <Input
        label="GPA or Percentage"
        value={formData.academic.GPA}
        onChange={(e) => updateField("academic", "GPA", e.target.value)}
        required
        error={errors.GPA}
      />
      <Input
        label="Preferred Country"
        value={formData.academic.preferredCountry}
        onChange={(e) =>
          updateField("academic", "preferredCountry", e.target.value)
        }
        required
        error={errors.preferredCountry}
      />

      <Input
        label="Preferred University"
        value={formData.academic.preferredUniversity}
        onChange={(e) =>
          updateField("academic", "preferredUniversity", e.target.value)
        }
        required
        error={errors.preferredUniversity}
      />

      <Input
        label="Preferred Course"
        value={formData.academic.preferredCourse}
        onChange={(e) =>
          updateField("academic", "preferredCourse", e.target.value)
        }
        required
        error={errors.preferredCourse}
      />
      <Input
        label="Intake"
        value={formData.academic.intake}
        onChange={(e) => updateField("academic", "intake", e.target.value)}
        required
        error={errors.intake}
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
