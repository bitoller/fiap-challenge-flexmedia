import { useMemo, useState } from "react";
import { formatEventTimestamp, formatNumber, localizeAction, localizeActorType, localizeResourceType } from "../../admin/dashboard";
import type { AdminCopy } from "../../admin/copy";
import type { Language } from "../../admin/types";
import type { AuditEvent } from "../../types";

type AuditFilter = "all" | "security" | "system" | "ux";
type AuditSort = "newest" | "oldest";

type AuditPageProps = {
  audit: AuditEvent[];
  emptyState: string;
  copy: AdminCopy["auditPage"];
  locale: Language;
  onRefresh: () => void;
};

function normalize(value: string | null | undefined, fallback = "—") {
  return value && value.trim() ? value.trim() : fallback;
}

function toTitleCase(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
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

function humanizeAudit(event: AuditEvent, locale: Language) {
  const action = localizeAction(normalize(event.action, "Event"), locale);
  const actor = normalize(event.actorType, "");
  const resourceType = normalize(event.resourceType, "");
  const resourceId = normalize(event.resourceId, "");
  const correlationId = normalize(event.correlationId, "");
  const when = formatEventTimestamp(event.createdAt, locale) || "—";

  const contextParts = [actor ? localizeActorType(actor, locale) : "", resourceType ? localizeResourceType(resourceType, locale) : "", resourceId].filter(Boolean);
  const context = contextParts.length ? contextParts.join(" • ") : "—";
  const reference = resourceId !== "—" ? resourceId : correlationId !== "—" ? correlationId : "—";
  const referenceLabel = resourceType !== "—" ? localizeResourceType(resourceType, locale) : "—";

  return { action, context, reference, referenceLabel, when, actor };
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
            <span>{copy.when}</span>
            <span>{copy.entry}</span>
            <span>{copy.referenceId}</span>
            <span>{copy.details}</span>
            <span>{copy.category}</span>
            <span>{copy.status}</span>
          </div>

          {filteredEntries.length ? (
            filteredEntries.map(({ event, category, position }) => {
              const human = humanizeAudit(event, locale);

              return (
                <div key={`${position}-${event.correlationId ?? event.action}-${event.resourceId ?? event.actorId ?? ""}`} className="admin-audit__row">
                  <div className="admin-audit__cell">
                    <strong>{human.when}</strong>
                    <small>{sortOrder === "newest" ? copy.mostRecent : copy.oldest}</small>
                  </div>
                  <div className="admin-audit__cell">
                    <strong>{human.action}</strong>
                    <small>{human.actor !== "—" ? localizeActorType(human.actor, locale) : "—"}</small>
                  </div>
                  <div className="admin-audit__cell">
                    <strong>{human.reference}</strong>
                    <small>{human.referenceLabel}</small>
                  </div>
                  <div className="admin-audit__cell">
                    <strong>{human.context}</strong>
                    <small>{normalize(event.correlationId, copy.noCorrelation)}</small>
                  </div>
                  <div className="admin-audit__cell">
                    <span className={`admin-audit__pill admin-audit__pill--${category}`}>{getCategoryLabel(category, copy)}</span>
                  </div>
                  <div className="admin-audit__cell">
                    <span className={`admin-audit__pill admin-audit__pill--${getTone(event.result)}`}>{event.result}</span>
                  </div>
                </div>
              );
            })
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
