import { useMemo, useState } from "react";
import { formatEventTimestamp, formatNumber, localizeAction, localizeActorType, localizeResourceType } from "../../admin/dashboard";
import type { AdminCopy } from "../../admin/copy";
import type { Language } from "../../admin/types";
import AdminSelect from "../../components/AdminSelect";
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

function normalize(value: string | null | undefined, fallback = "-") {
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

function localizeStatus(action: string, result: string, locale: Language) {
  const normalizedAction = action.toUpperCase();
  const normalizedResult = result.toUpperCase();
  const labels = locale === "pt-BR"
    ? { acknowledged: "Reconhecido", completed: "Concluído", failed: "Falhou", pending: "Pendente" }
    : locale === "es"
      ? { acknowledged: "Reconocido", completed: "Completado", failed: "Fallido", pending: "Pendiente" }
      : { acknowledged: "Acknowledged", completed: "Completed", failed: "Failed", pending: "Pending" };

  if (normalizedAction.includes("ACKNOWLEDGED")) return labels.acknowledged;
  if (normalizedResult.includes("SUCCESS") || normalizedResult === "OK") return labels.completed;
  if (normalizedResult.includes("FAIL") || normalizedResult.includes("DENIED")) return labels.failed;
  return labels.pending;
}

function formatActorReference(event: AuditEvent, locale: Language) {
  const actor = normalize(event.actorType, "");
  const actorId = normalize(event.actorId, "");
  if (!actor) return "";

  const localizedActor = localizeActorType(actor, locale);
  if (!actorId) return localizedActor;

  const readableId = actor.toUpperCase() === "KIOSK"
    ? actorId.replace(/^kiosk-/i, "")
    : actorId;
  return `${localizedActor} ${readableId}`;
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

const auditNarratives = {
  en: {
    supportReference: "Guest support",
    supportDetail: "A guest requested concierge assistance from the kiosk.",
    housekeepingReference: "Housekeeping request",
    housekeepingDetail: "A guest requested housekeeping from the kiosk.",
    amenitiesReference: "Amenities request",
    amenitiesDetail: "A guest requested towels or additional amenities.",
    diningReference: "Room service request",
    diningDetail: "A guest requested room service assistance.",
    checkoutReference: "Checkout",
    checkoutDetail: "The stay was closed and the room was released for hotel operations.",
    checkinReference: "Check-in",
    checkinDetail: "A guest arrival flow was completed successfully.",
    identityReference: "Guest identity",
    identityDetail: "Identity verification was completed for this stay.",
    reservationReference: "Reservation",
    reservationDetail: "The reservation was linked to the guest journey.",
    sessionReference: "Kiosk session",
    sessionDetail: "A guest session was started at the kiosk.",
    deviceReference: "Kiosk device",
    deviceDetail: "A device health or availability event was recorded.",
    systemReference: "Hotel operations",
    systemDetail: "An operational event was recorded for the selected hotel.",
  },
  "pt-BR": {
    supportReference: "Suporte ao hóspede",
    supportDetail: "Um hóspede solicitou assistência da concierge pelo kiosk.",
    housekeepingReference: "Solicitação de arrumação",
    housekeepingDetail: "Um hóspede solicitou arrumação do quarto pelo kiosk.",
    amenitiesReference: "Solicitação de amenities",
    amenitiesDetail: "Um hóspede solicitou toalhas ou amenities adicionais.",
    diningReference: "Solicitação de serviço de quarto",
    diningDetail: "Um hóspede solicitou atendimento do serviço de quarto.",
    checkoutReference: "Check-out",
    checkoutDetail: "A estadia foi encerrada e o quarto foi liberado para a operação do hotel.",
    checkinReference: "Check-in",
    checkinDetail: "Um fluxo de chegada foi concluído com sucesso.",
    identityReference: "Identidade do hóspede",
    identityDetail: "A verificação de identidade foi concluída para esta estadia.",
    reservationReference: "Reserva",
    reservationDetail: "A reserva foi vinculada à jornada do hóspede.",
    sessionReference: "Sessão do kiosk",
    sessionDetail: "Uma sessão do hóspede foi iniciada no kiosk.",
    deviceReference: "Dispositivo do kiosk",
    deviceDetail: "Um evento de integridade ou disponibilidade do dispositivo foi registrado.",
    systemReference: "Operação do hotel",
    systemDetail: "Um evento operacional foi registrado para o hotel selecionado.",
  },
  es: {
    supportReference: "Soporte al huésped",
    supportDetail: "Un huésped solicitó asistencia de concierge desde el kiosco.",
    housekeepingReference: "Solicitud de limpieza",
    housekeepingDetail: "Un huésped solicitó limpieza de la habitación desde el kiosco.",
    amenitiesReference: "Solicitud de amenities",
    amenitiesDetail: "Un huésped solicitó toallas o amenities adicionales.",
    diningReference: "Solicitud de servicio de habitación",
    diningDetail: "Un huésped solicitó asistencia de servicio de habitación.",
    checkoutReference: "Check-out",
    checkoutDetail: "La estancia se cerró y la habitación se liberó para la operación del hotel.",
    checkinReference: "Check-in",
    checkinDetail: "Se completó correctamente un flujo de llegada de huésped.",
    identityReference: "Identidad del huésped",
    identityDetail: "La verificación de identidad se completó para esta estancia.",
    reservationReference: "Reserva",
    reservationDetail: "La reserva se vinculó al recorrido del huésped.",
    sessionReference: "Sesión del kiosco",
    sessionDetail: "Se inició una sesión de huésped en el kiosco.",
    deviceReference: "Dispositivo del kiosco",
    deviceDetail: "Se registró un evento de disponibilidad o estado del dispositivo.",
    systemReference: "Operación del hotel",
    systemDetail: "Se registró un evento operativo para el hotel seleccionado.",
  },
};

function describeAudit(event: AuditEvent, locale: Language) {
  const narrative = auditNarratives[locale === "pt-BR" ? "pt-BR" : locale === "es" ? "es" : "en"];
  const action = event.action.toUpperCase();
  const source = [event.action, event.resourceType, event.actorType].filter(Boolean).join(" ").toUpperCase();

  if (/CHECK.?OUT/.test(action)) return { reference: narrative.checkoutReference, details: narrative.checkoutDetail };
  if (/CHECK.?IN/.test(action)) return { reference: narrative.checkinReference, details: narrative.checkinDetail };
  if (/HOUSEKEEPING/.test(source)) return { reference: narrative.housekeepingReference, details: narrative.housekeepingDetail };
  if (/AMENIT/.test(source)) return { reference: narrative.amenitiesReference, details: narrative.amenitiesDetail };
  if (/DINING|ROOM_SERVICE/.test(source)) return { reference: narrative.diningReference, details: narrative.diningDetail };
  if (/HELP|CONCIERGE|ASSIST/.test(source)) return { reference: narrative.supportReference, details: narrative.supportDetail };
  if (/STAY/.test(source)) return { reference: narrative.checkoutReference, details: narrative.checkoutDetail };
  if (/IDENTITY|BIOMETRY|FACE|DOCUMENT/.test(source)) return { reference: narrative.identityReference, details: narrative.identityDetail };
  if (/RESERVATION/.test(source)) return { reference: narrative.reservationReference, details: narrative.reservationDetail };
  if (/SESSION/.test(source)) return { reference: narrative.sessionReference, details: narrative.sessionDetail };
  if (/DEVICE|KIOSK|PRINTER|CAMERA/.test(source)) return { reference: narrative.deviceReference, details: narrative.deviceDetail };
  return { reference: narrative.systemReference, details: narrative.systemDetail };
}

function humanizeAudit(event: AuditEvent, locale: Language) {
  const action = localizeAction(normalize(event.action, "Event"), locale);
  const actor = normalize(event.actorType, "");
  const resourceType = normalize(event.resourceType, "");
  const resourceId = normalize(event.resourceId, "");
  const when = formatEventTimestamp(event.createdAt, locale) || "-";
  const description = describeAudit(event, locale);
  const isGuestService = /GUEST_SERVICE|CONCIERGE|HOUSEKEEPING|AMENIT|DINING/.test(
    [event.action, resourceType].filter(Boolean).join(" ").toUpperCase()
  );
  const roomLabel = locale === "pt-BR" ? "Quarto" : locale === "es" ? "Habitación" : "Room";
  const referenceLabel = isGuestService
    ? resourceId
      ? `${localizeResourceType(resourceType || "CONCIERGE", locale)}`
      : localizeResourceType(resourceType || "CONCIERGE", locale)
    : resourceId
      ? `${resourceType ? localizeResourceType(resourceType, locale) : "ID"} ${resourceId}`
      : actor
        ? localizeActorType(actor, locale)
        : "-";
  const contextLabel = isGuestService && resourceId
    ? `${roomLabel} ${resourceId}`
    : formatActorReference(event, locale) || referenceLabel;
  const status = localizeStatus(event.action, event.result, locale);

  return { action, ...description, referenceLabel, contextLabel, status, when, actor };
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

          <div className="admin-audit__sort">
            <span>{copy.sortBy}</span>
            <AdminSelect
              ariaLabel={copy.sortBy}
              className="admin-select--sort"
              value={sortOrder}
              options={[
                { value: "newest", label: copy.mostRecent },
                { value: "oldest", label: copy.oldest },
              ]}
              onChange={(value) => setSortOrder(value as AuditSort)}
            />
          </div>
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
                    <small>{human.actor !== "-" ? localizeActorType(human.actor, locale) : "-"}</small>
                  </div>
                  <div className="admin-audit__cell">
                    <strong>{human.reference}</strong>
                    <small>{human.referenceLabel}</small>
                  </div>
                  <div className="admin-audit__cell">
                    <strong>{human.details}</strong>
                    <small>{human.contextLabel}</small>
                  </div>
                  <div className="admin-audit__cell">
                    <span className={`admin-audit__pill admin-audit__pill--${category}`}>{getCategoryLabel(category, copy)}</span>
                  </div>
                  <div className="admin-audit__cell">
                    <span className={`admin-audit__pill admin-audit__pill--${getTone(event.result)}`}>{human.status}</span>
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
