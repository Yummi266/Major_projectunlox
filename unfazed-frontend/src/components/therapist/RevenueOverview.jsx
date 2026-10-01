function RevenueOverview() {
  return (
    <article className="dashboard-card revenue-card">

      <div className="card-heading">
        <h2>Revenue, Last 6 Months</h2>
      </div>

      <div className="revenue-chart">

        <div className="chart-y-axis">
          <span>₹60k</span>
          <span>₹40k</span>
          <span>₹20k</span>
          <span>₹0</span>
        </div>

        <div className="chart-area">

          <div className="chart-grid-line line-one"></div>
          <div className="chart-grid-line line-two"></div>
          <div className="chart-grid-line line-three"></div>
          <div className="chart-grid-line line-four"></div>

          <svg
            className="revenue-line"
            viewBox="0 0 500 190"
            preserveAspectRatio="none"
          >
            <polyline
              points="0,145 90,125 180,135 270,90 365,105 500,42"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <circle cx="0" cy="145" r="5" />
            <circle cx="90" cy="125" r="5" />
            <circle cx="180" cy="135" r="5" />
            <circle cx="270" cy="90" r="5" />
            <circle cx="365" cy="105" r="5" />
            <circle cx="500" cy="42" r="5" />
          </svg>

          <div className="chart-months">
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
          </div>

        </div>
      </div>

    </article>
  );
}

export default RevenueOverview;