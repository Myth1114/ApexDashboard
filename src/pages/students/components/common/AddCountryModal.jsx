export default function AddCountryModal({
  isOpen,
  onClose,
  onAdd,
  value,
  setValue,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h3>Add Country</h3>

        <input
          type="text"
          placeholder="Enter country name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="input-field"
        />

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={onAdd}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
