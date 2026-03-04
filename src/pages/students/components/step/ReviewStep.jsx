export default function ReviewStep({ formData }) {
  return (
    <div className="review-container">
      <h2 className="review-title">Review Student Details</h2>

      <div className="review-card">
        <div className="review-row">
          <span className="review-label">Full Name</span>
          <span className="review-value">
            {formData.personal.firstName} {formData.personal.lastName}
          </span>
        </div>
        <div className="review-row">
          <span className="review-label">Gender</span>
          <span className="review-value">{formData.personal.gender}</span>
        </div>
        <div className="review-row">
          <span className="review-label">Email</span>
          <span className="review-value">{formData.contact.email}</span>
        </div>
        <div className="review-row">
          <span className="review-label">Contact Number</span>
          <span className="review-value">{formData.contact.phone}</span>
        </div>
        <div className="review-row">
          <span className="review-label">Passport Number</span>
          <span className="review-value">
            {formData.personal.passportNumber}
          </span>
        </div>

        <div className="review-row">
          <span className="review-label">Preferred Country</span>
          <span className="review-value">
            {formData.academic.preferredCountry}
          </span>
        </div>

        <div className="review-row">
          <span className="review-label">Preferred University</span>
          <span className="review-value">
            {formData.academic.preferredUniversity}
          </span>
        </div>

        <div className="review-row">
          <span className="review-label">Preferred Course</span>
          <span className="review-value">
            {formData.academic.preferredCourse}
          </span>
        </div>
        <div className="review-row">
          <span className="review-label">Intake</span>
          <span className="review-value">{formData.academic.intake}</span>
        </div>
      </div>
    </div>
  );
}
