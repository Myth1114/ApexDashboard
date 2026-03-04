import "../../../../styles/steps.css";

export default function DocumentsStep({ formData, setFormData }) {
  const handleFile = (field, file) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file,
      },
    }));
  };

  return (
    <div className="documents-container">
      <div className="file-group">
        <label className="file-label">Passport Copy</label>
        <input
          type="file"
          className="file-input"
          onChange={(e) => handleFile("passportCopy", e.target.files[0])}
        />
      </div>

      <div className="file-group">
        <label className="file-label">Transcript</label>
        <input
          type="file"
          className="file-input"
          onChange={(e) => handleFile("transcript", e.target.files[0])}
        />
      </div>
    </div>
  );
}
