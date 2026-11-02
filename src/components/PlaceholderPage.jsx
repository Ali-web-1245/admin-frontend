export default function PlaceholderPage({ title, note }) {
  return (
    <div className="page">
      <div className="card page-state">
        <h2 style={{ marginBottom: 8, color: "var(--text)" }}>{title}</h2>
        <p>{note}</p>
      </div>
    </div>
  );
}
