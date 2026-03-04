import "../../../styles/stepindicator.css";

export default function StepIndicator({ step }) {
  const steps = ["Personal", "Academic", "Documents", "Review"];

  return (
    <div className="step-container">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const active = step >= stepNumber;
        const completed = step > stepNumber;

        return (
          <div key={index} className="step-item">
            {/* Circle */}
            <div className={`step-circle ${active ? "active" : ""}`}>
              {stepNumber}
            </div>

            {/* Label */}
            <p className="step-label">{label}</p>

            {/* Progress Line */}
            {index !== steps.length - 1 && (
              <div className="step-line">
                <div
                  className={`step-line-progress ${completed ? "filled" : ""}`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
