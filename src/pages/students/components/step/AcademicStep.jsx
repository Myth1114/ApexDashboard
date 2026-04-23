import { useState } from "react";
import Input from "../Input";
import "../../../../styles/steps.css";
import { useStudents } from "../../../../context/useStudents";
import ConfirmModal from "../common/ConfirmModal";
import AddCountryModal from "../common/AddCountryModal";
export default function AcademicStep({ formData, updateField, errors }) {
  const { countries } = useStudents();
  const [showCountryModal, setShowCountryModal] = useState(false);

  const [newCountry, setNewCountry] = useState("");

  const handleAddCountry = async () => {
    if (!newCountry.trim()) return;

    const { error } = await supabase
      .from("countries")
      .insert([{ name: newCountry.trim() }]);

    if (error) {
      console.error(error);
      return;
    }

    setNewCountry(""); // clear input
    setShowCountryModal(false); // close modal
    await fetchCountries(); // refresh dropdown
  };
  // console.log(countries);
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
      {/* <Input
        label="Preferred Country"
        value={formData.academic.preferredCountry}
        onChange={(e) =>
          updateField("academic", "preferredCountry", e.target.value)
        }
        required
        error={errors.preferredCountry}
      /> */}
      <div className="form-group">
        <label>Preferred Country</label>

        <select
          value={formData.academic.preferredCountry || ""}
          onChange={(e) =>
            updateField("academic", "preferredCountry", e.target.value)
          }
          className="input-field"
        >
          <option value="">Select Country</option>

          {(countries || []).map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {errors.preferredCountry && (
          <span className="error">{errors.preferredCountry}</span>
        )}
        {/* <button
          type="button"
          className="add-country-btn"
          onClick={() => setShowCountryModal(true)}
        >
          + Add
        </button> */}
      </div>

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
      <AddCountryModal
        isOpen={showCountryModal}
        onClose={() => setShowCountryModal(false)}
        onAdd={handleAddCountry}
        value={newCountry}
        setValue={setNewCountry}
      />
    </div>
  );
}
