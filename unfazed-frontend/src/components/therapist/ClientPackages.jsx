function ClientPackages() {
  const packages = [
    {
      client: "Sarah Wilson",
      package: "6-pack",
      used: 2,
      total: 6,
    },
    {
      client: "Michael Lee",
      package: "6-pack",
      used: 3,
      total: 6,
    },
    {
      client: "Daniel Smith",
      package: "6-pack",
      used: 5,
      total: 6,
    },
  ];

  return (
    <article className="dashboard-card packages-card">

      <div className="card-heading">
        <h2>Client Packages</h2>
      </div>

      <div className="packages-list">

        {packages.map((item, index) => {
          const remaining = item.total - item.used;
          const percentage = (item.used / item.total) * 100;

          return (
            <div className="package-item" key={index}>

              <div className="package-top">
                <div>
                  <strong>{item.client}</strong>
                  <span>{item.package}</span>
                </div>

                <span className="package-left">
                  {remaining} left
                </span>
              </div>

              <div className="package-progress">
                <div
                  className="package-progress-fill"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              {remaining <= 1 && (
                <button
                  type="button"
                  className="renew-button"
                >
                  Send Renewal Link
                </button>
              )}

            </div>
          );
        })}

      </div>

    </article>
  );
}

export default ClientPackages;