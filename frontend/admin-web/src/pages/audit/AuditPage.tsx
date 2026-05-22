import { useMemo, useState } from "react";
import { formatNumber } from "../../admin/dashboard";
import type { AdminCopy } from "../../admin/copy";
import type { AuditEvent } from "../../types";

type AuditFilter = "all" | "security" | "system" | "ux";
type AuditSort = "newest" | "oldest";

type AuditPageProps = {
  audit: AuditEvent[];
  emptyState: string;
  copy: AdminCopy["auditPage"];
  locale: string;
  onRefresh: () => void;
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

function getCategoryLabel(category: AuditFilter, copy: AdminCopy["auditPage"]) {
  switch (category) {
    case "security":
      return copy.security;
    case "system":
      return copy.system;
    case "ux":
      return copy.ux;
    default:
      return copy.allEvents;
  }
}

function AuditPage({ audit, emptyState, copy, locale, onRefresh }: AuditPageProps) {
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

  const filterLabels: Record<AuditFilter, string> = {
    all: copy.filterAll,
    security: copy.filterSecurity,
    system: copy.filterSystem,
    ux: copy.filterUx,
  };

  if (!audit.length) {
    return (
      <section className="admin-audit">
        <div className="admin-audit__hero">
          <div>
            <p className="admin-eyebrow">{copy.trailKicker}</p>
            <h2>{copy.title}</h2>
            <p className="admin-copy admin-copy--compact">{emptyState}</p>
          </div>
          <button type="button" className="admin-secondary-button" onClick={onRefresh}>
            {copy.refreshLogs}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-audit">
      <div className="admin-audit__hero">
        <div>
          <p className="admin-eyebrow">{copy.trailKicker}</p>
          <h2>{copy.title}</h2>
          <p className="admin-copy admin-copy--compact">{copy.subtitle}</p>
        </div>
        <button type="button" className="admin-secondary-button" onClick={onRefresh}>
          {copy.refreshLogs}
        </button>
      </div>

      <div className="admin-metrics admin-audit__metrics">
        <article className="admin-card admin-card--metric admin-card--audit-metric">
          <p>{copy.securityAlerts}</p>
          <strong>{formatNumber(securityCount, locale)}</strong>
          <span>{copy.highPriorityEvents}</span>
        </article>
        <article className="admin-card admin-card--metric admin-card--audit-metric">
          <p>{copy.systemErrors}</p>
          <strong>{formatNumber(systemCount, locale)}</strong>
          <span>{copy.hardwareIssues}</span>
        </article>
        <article className="admin-card admin-card--metric admin-card--audit-metric">
          <p>{copy.uxInteractions}</p>
          <strong>{formatNumber(uxCount, locale)}</strong>
          <span>{copy.guestFacingOperations}</span>
        </article>
        <article className="admin-card admin-card--metric admin-card--audit-metric">
          <p>{copy.activeEvents}</p>
          <strong>{formatNumber(activeCount, locale)}</strong>
          <span>{copy.successfulActions}</span>
        </article>
      </div>

      <article className="admin-card admin-audit__panel">
        <div className="admin-audit__toolbar">
          <div className="admin-audit__tabs" role="tablist" aria-label={copy.trailKicker}>
            {(Object.keys(filterLabels) as AuditFilter[]).map((filter) => (
              <button
                key={filter}
                type="button"
                className={selectedFilter === filter ? "is-active" : ""}
                onClick={() => setSelectedFilter(filter)}
              >
                {filterLabels[filter]}
              </button>
            ))}
          </div>

          <label className="admin-audit__sort">
            <span>{copy.sortBy}</span>
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as AuditSort)}>
              <option value="newest">{copy.mostRecent}</option>
              <option value="oldest">{copy.oldest}</option>
            </select>
          </label>
        </div>

        <div className="admin-audit__table">
          <div className="admin-audit__head">
            <span>{copy.entry}</span>
            <span>{copy.referenceId}</span>
            <span>{copy.category}</span>
            <span>{copy.details}</span>
            <span>{copy.status}</span>
          </div>

          {filteredEntries.length ? (
            filteredEntries.map(({ event, category, position }) => (
              <div key={`${position}-${event.correlationId ?? event.action}-${event.resourceId ?? event.actorId ?? ""}`} className="admin-audit__row">
                <div className="admin-audit__cell">
                  <strong>#{formatNumber(position, locale)}</strong>
                  <small>{normalize(event.actorType, "Kiosk")}</small>
                </div>
                <div className="admin-audit__cell">
                  <strong>{normalize(event.resourceId ?? event.actorId, "—")}</strong>
                  <small>{normalize(event.resourceType, "—")}</small>
                </div>
                <div className="admin-audit__cell">
                  <span className={`admin-audit__pill admin-audit__pill--${category}`}>{getCategoryLabel(category, copy)}</span>
                </div>
                <div className="admin-audit__cell">
                  <strong>{event.action}</strong>
                  <small>
                    {normalize(event.resourceType, copy.resource)} • {normalize(event.correlationId, copy.noCorrelation)}
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
            {copy.showing} {formatNumber(filteredEntries.length, locale)} {copy.of} {formatNumber(entries.length, locale)} {copy.recentEntries}
          </small>
        </div>
      </article>
    </section>
  );
}

export default AuditPage;
