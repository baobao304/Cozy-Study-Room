function ProgressStatsCard() {
  return (
    <section className="study-card">
      <div className="card-label">Progress</div>
      <h2>Quiet wins</h2>
      <div className="stats-grid" aria-label="Study progress stats">
        <div>
          <span className="stat-value">4</span>
          <span className="stat-label">blocks done</span>
        </div>
        <div>
          <span className="stat-value">2h</span>
          <span className="stat-label">focus time</span>
        </div>
        <div>
          <span className="stat-value">87%</span>
          <span className="stat-label">task flow</span>
        </div>
      </div>
    </section>
  );
}

export { ProgressStatsCard };
