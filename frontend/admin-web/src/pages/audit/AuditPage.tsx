import { useMemo, useState } from "react";
import { formatNumber } from "../../admin/dashboard";
import type { AuditEvent } from "../../types";

type AuditFilter = "all" | "security" | "system" | "ux";
type AuditSort = "newest" | "oldest";

type AuditPageProps = {
  audit: AuditEvent[];
  emptyState: string;
  onRefresh: () => void;
};

const FILTER_LABELS: Record<AuditFilter, string> = {
  all: "All events",
  security: "Security",
  system: "System",
  ux: "UX interactions",
};

function normalize(value: string | null | undefined, fallback = "—") {
  return value && value.trim() ? value.trim() : fallback;
}

function classifyAudit(event: AuditEvent): AuditFilter {
  const haystack = [event.actorType, event.action, event.resourceType, event.resourceId, event.result].filter(Boolean).join(" ").toUpperCase();

  if (/LOGIN|AUTH|TOKEN|PASSWORD|CREDENTIAL|IDENTITY|CONSENT|ACCESS/.test(haystack)) {
    return "security";
  }

  if (/DEVICE|SYSTEM|MAINT|ERROR|FAIL|HEALTH|MONITOR|PRINTER|CAMERA/.test(haystack)) {
    return "system";
  }

  return "ux";
}

function getTone(result: string) {
  const value = result.toUpperCase();
  if (value.includes("FAIL") || value.includes("CRIT") || value.includes("DENIED")) {
    return "danger";
  }
  if (value.includes("WARN") || value.includes("ALERT")) {
    return "warning";
  }
  if (value.includes("INFO")) {
    return "neutral";
  }
  return "good";
}

function getCategoryLabel(category: AuditFilter) {
  switch (category) {
    case "security":
      return "Security";
    case "system":
      return "System";
    case "ux":
      return "UX";
    default:
      return "All";
  }
}

function AuditPage({ audit, emptyState, onRefresh }: AuditPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<AuditFilter>("all");
  const [sortOrder, setSortOrder] = useState<AuditSort>("newest");

  const entries = useMemo(() => {
    const base = audit.map((event, index) => ({
      event,
      category: classifyAudit(event),
      position: index + 1,
    }));

    return sortOrder === "newest" ? base : [...base].reverse();
  }, [audit, sortOrder]);

  const filteredEntries = selectedFilter === "all" ? entries : entries.filter((entry) => entry.category === selectedFilter);

  const securityCount = entries.filter((entry) => entry.category === "security").length;
  const systemCount = entries.filter((entry) => entry.category === "system").length;
  const uxCount = entries.filter((entry) => entry.category === "ux").length;
  const activeCount = entries.filter((entry) => getTone(entry.event.result) !== "danger").length;

  if (!audit.length) {
    return (
      <section className="admin-audit">
        <div className="admin-audit__hero">
          <div>
            <p className="admin-eyebrow">Audit trail</p>
            <h2>Operational events</h2>
            <p className="admin-copy admin-copy--compact">{emptyState}</p>
          </div>
          <button type="button" className="admin-secondary-button" onClick={onRefresh}>
            Refresh logs
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-audit">
      <div className="admin-audit__hero">
        <div>
          <p className="admin-eyebrow">Audit trail</p>
          <h2>Operational events</h2>
          <p className="admin-copy admin-copy--compact">
            Real-time history of security, system, and guest-flow events for the selected hotel.
          </p>
        </div>
        <button type="button" className="admin-secondary-button" onClick={onRefresh}>
          Refresh logs
        </button>
      </div>

      <div className="admin-metrics admin-audit__metrics">
        <article className="admin-card admin-card--metric admin-card--audit-metric">
          <p>Security alerts</p>
          <strong>{formatNumber(securityCount)}</strong>
          <span>High priority events</span>
        </article>
        <article className="admin-card admin-card--metric admin-card--audit-metric">
          <p>System errors</p>
          <strong>{formatNumber(systemCount)}</strong>
          <span>Hardware or platform issues</span>
        </article>
        <article className="admin-card admin-card--metric admin-card--audit-metric">
          <p>UX interactions</p>
          <strong>{formatNumber(uxCount)}</strong>
          <span>Guest-facing operations</span>
        </article>
        <article className="admin-card admin-card--metric admin-card--audit-metric">
          <p>Active events</p>
          <strong>{formatNumber(activeCount)}</strong>
          <span>Successful actions in view</span>
        </article>
      </div>

      <article className="admin-card admin-audit__panel">
        <div className="admin-audit__toolbar">
          <div className="admin-audit__tabs" role="tablist" aria-label="Audit filters">
            {(Object.keys(FILTER_LABELS) as AuditFilter[]).map((filter) => (
              <button
                key={filter}
                type="button"
                className={selectedFilter === filter ? "is-active" : ""}
                onClick={() => setSelectedFilter(filter)}
              >
                {FILTER_LABELS[filter]}
              </button>
            ))}
          </div>

          <label className="admin-audit__sort">
            <span>Sort by</span>
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as AuditSort)}>
              <option value="newest">Most recent</option>
              <option value="oldest">Oldest</option>
            </select>
          </label>
        </div>

        <div className="admin-audit__table">
          <div className="admin-audit__head">
            <span>Entry</span>
            <span>Reference ID</span>
            <span>Category</span>
            <span>Details</span>
            <span>Status</span>
          </div>

          {filteredEntries.length ? (
            filteredEntries.map(({ event, category, position }) => (
              <div key={`${position}-${event.correlationId ?? event.action}-${event.resourceId ?? event.actorId ?? ""}`} className="admin-audit__row">
                <div className="admin-audit__cell">
                  <strong>#{formatNumber(position)}</strong>
                  <small>{normalize(event.actorType, "Kiosk")}</small>
                </div>
                <div className="admin-audit__cell">
                  <strong>{normalize(event.resourceId ?? event.actorId, "—")}</strong>
                  <small>{normalize(event.resourceType, "—")}</small>
                </div>
                <div className="admin-audit__cell">
                  <span className={`admin-audit__pill admin-audit__pill--${category}`}>{getCategoryLabel(category)}</span>
                </div>
                <div className="admin-audit__cell">
                  <strong>{event.action}</strong>
                  <small>
                    {normalize(event.resourceType, "Resource")} • {normalize(event.correlationId, "No correlation")}
                  </small>
                </div>
                <div className="admin-audit__cell">
                  <span className={`admin-audit__pill admin-audit__pill--${getTone(event.result)}`}>{event.result}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="admin-empty admin-audit__empty">{emptyState}</p>
          )}
        </div>

        <div className="admin-audit__footer">
          <small>
            Showing {formatNumber(filteredEntries.length)} of {formatNumber(entries.length)} recent entries
          </small>
        </div>
      </article>
    </section>
  );
}

export default AuditPage;
