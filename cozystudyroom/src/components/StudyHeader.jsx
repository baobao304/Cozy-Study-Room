function StudyHeader() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="study-header">
      <div className="header-topline">
        <p className="eyebrow">Study Room</p>
        <span className="streak-badge">7 day streak</span>
      </div>

      <div className="header-grid">
        <div>
          <h1>Good evening, Mira.</h1>
          <p className="intro-text">Quiet focus, steady pace, no rush.</p>
        </div>

        <div className="header-meta">
          <p className="meta-label">Current date</p>
          <p className="meta-value">{currentDate}</p>
        </div>

        <p className="motivational-line">
          One calm block at a time keeps the whole day moving.
        </p>
      </div>
    </header>
  );
}

export { StudyHeader };
