import "./timeline.css";

export default function Timeline({ timeline }) {
  if (!timeline || timeline.length === 0) {
    return <div className="timeline-empty">No activity yet</div>;
  }

  const sortedTimeline = [...timeline].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="timeline-container">
      <h3 className="timeline-title">Activity Timeline</h3>

      <div className="timeline">
        {sortedTimeline.map((event) => (
          <div key={event.id} className="timeline-item">
            <div className={`timeline-dot ${event.type}`} />

            <div className="timeline-content">
              <div className="timeline-message">{event.message}</div>
              <div className="timeline-date">
                {new Date(event.date).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
