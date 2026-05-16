import type { AuditEvent } from "../../types";

type AuditPageProps = {
  audit: AuditEvent[];
  emptyState: string;
};

function AuditPage({ audit, emptyState }: AuditPageProps) {
  return (
    <section className="admin-panel">
      <div className="admin-card">
        <h2>Audit</h2>
        {audit.length ? (
          <ul className="admin-list">
            {audit.map((event, index) => (
              <li key={index}>
                <strong>{event.action}</strong>
                <span>{event.result}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="admin-empty">{emptyState}</p>
        )}
      </div>
    </section>
  );
}

export default AuditPage;
