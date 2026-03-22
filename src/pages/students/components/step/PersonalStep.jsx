import Input from "../Input";
import "../../../../styles/steps.css";

export default function PersonalStep({ formData, updateField, errors }) {
  console.log("FORM DATA:", formData);
  return (
    <div className="personal-grid">
      <Input
        label="First Name"
        value={formData.personal?.firstName || ""}
        onChange={(e) => updateField("personal", "firstName", e.target.value)}
        required
        error={errors.firstName}
      />

      <Input
        label="Last Name"
        value={formData.personal?.lastName || ""}
        onChange={(e) => updateField("personal", "lastName", e.target.value)}
        required
        error={errors.lastName}
      />
      <Input
        label="Gender"
        value={formData.personal?.gender || ""}
        onChange={(e) => updateField("personal", "gender", e.target.value)}
        required
        error={errors.gender}
      />
      <Input
        label="Email"
        type="email"
        value={formData.contact?.email || ""}
        onChange={(e) => updateField("contact", "email", e.target.value)}
        required
        error={errors.email}
      />
      <Input
        label="Contact Number"
        type="number"
        value={formData.contact?.phone || ""}
        onChange={(e) => updateField("contact", "phone", e.target.value)}
        required
        error={errors.phone}
      />
      <Input
        label="Date of Birth"
        type="date"
        value={formData.personal?.dateOfBirth || ""}
        onChange={(e) => updateField("personal", "dateOfBirth", e.target.value)}
        required
      />

      <Input
        label="Passport Number"
        value={formData.personal?.passportNumber || ""}
        onChange={(e) =>
          updateField("personal", "passportNumber", e.target.value)
        }
      />
    </div>
  );
}
