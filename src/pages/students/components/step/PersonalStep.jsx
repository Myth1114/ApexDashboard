import Input from "../Input";
import "../../../../styles/steps.css";

export default function PersonalStep({ formData, updateField }) {
  return (
    <div className="personal-grid">
      <Input
        label="First Name"
        value={formData.personal.firstName}
        onChange={(e) => updateField("personal", "firstName", e.target.value)}
      />

      <Input
        label="Last Name"
        value={formData.personal.lastName}
        onChange={(e) => updateField("personal", "lastName", e.target.value)}
      />
      <Input
        label="Gender"
        value={formData.personal.gender}
        onChange={(e) => updateField("personal", "gender", e.target.value)}
      />
      <Input
        label="Email"
        type="email"
        value={formData.contact.email}
        onChange={(e) => updateField("contact", "email", e.target.value)}
      />
      <Input
        label="Contact Number"
        type="number"
        value={formData.contact.phone}
        onChange={(e) => updateField("contact", "phone", e.target.value)}
      />
      <Input
        label="Date of Birth"
        type="date"
        value={formData.personal.dateOfBirth}
        onChange={(e) => updateField("personal", "dateOfBirth", e.target.value)}
      />

      <Input
        label="Passport Number"
        value={formData.personal.passportNumber}
        onChange={(e) =>
          updateField("personal", "passportNumber", e.target.value)
        }
      />
    </div>
  );
}
