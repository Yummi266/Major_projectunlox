function PackageProgress() {
  return (
    <div className="client-package-card">

      <h2>Package progress</h2>

      <p>4/6 sessions used</p>

      <div className="progress-track">
        <div className="progress-fill"></div>
      </div>

      <button className="buy-sessions">
        Buy more sessions
      </button>

    </div>
  );
}

export default PackageProgress;