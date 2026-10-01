function StatCard({ title, value, change, changeText }) {
  return (
    <article className="stat-card">
      <p className="card-label">{title}</p>

      <div className="stat-value">
        {value}
      </div>

      <div className="stat-change">
        <span>{change}</span>
        <small>{changeText}</small>
      </div>
    </article>
  );
}

export default StatCard;