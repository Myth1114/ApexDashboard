export default function Input({
  label,
  type = "text",
  value,
  onChange,
  required,
  error,
}) {
  return (
    <div className="form-group">
      <label className="form-label">
        {label} {required && "*"}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`form-input ${error ? "input-error" : ""}`}
      />

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
