export default function Input({ label, type = "text", value, onChange }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input type={type} value={value} onChange={onChange} />
    </div>
  );
}
