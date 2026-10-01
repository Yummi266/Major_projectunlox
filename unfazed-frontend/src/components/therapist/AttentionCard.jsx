function AttentionCard() {
  return (
    <article className="dashboard-card attention-card">
      <div className="card-heading">
        <h2>Needs Your Attention</h2>
      </div>

      <div className="attention-list">

        <div className="attention-item attention-danger">
          <div>
            <strong>Check-in overdue</strong>
            <span>Sarah Wilson</span>
          </div>

          <button type="button">
            Review Check-in
          </button>
        </div>

        <div className="attention-item attention-warning">
          <div>
            <strong>Invoice pending</strong>
            <span>Michael Lee</span>
          </div>

          <button type="button">
            Send Invoice
          </button>
        </div>

        <div className="attention-item attention-info">
          <div>
            <strong>Package ending soon</strong>
            <span>Daniel Smith · 1 session left</span>
          </div>

          <button type="button">
            Send Renewal Link
          </button>
        </div>

      </div>
    </article>
  );
}

export default AttentionCard;