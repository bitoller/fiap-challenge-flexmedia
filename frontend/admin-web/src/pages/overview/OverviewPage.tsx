import type { DashboardResult, HotelProfile, HotelSummary } from "../../types";
import type { OverviewMetric, TrendPoint } from "../../admin/types";
import type { AdminCopy } from "../../admin/copy";
import { buildActivityFeed, buildMetricCards, buildTrendPath, buildTrendPoints, buildUnits, formatEventTimestamp, formatNumber } from "../../admin/dashboard";

function isSupportRequest(record: Record<string, unknown>) {
  const source = [record.action, record.event, record.name, record.resourceType, record.resource_type]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toUpperCase();

  return /HELP|CONCIERGE|ASSIST/.test(source) && String(record.result ?? "").toUpperCase() === "SUCCESS";
}

function isSelectedHotelEvent(record: Record<string, unknown>, hotelId: number | null) {
  if (hotelId === null) {
    return true;
  }

  const eventHotelId = Number(record.hotelId ?? record.hotel_id);
  return !Number.isFinite(eventHotelId) || eventHotelId === hotelId;
}

type OverviewPageProps = {
  dashboard: DashboardResult | null;
  hotelProfile: HotelProfile | null;
  selectedHotel: HotelSummary | null;
  loading: boolean;
  emptyState: string;
  copy: AdminCopy["overviewPage"];
  locale: string;
  onRefresh: () => void;
  onAcknowledgeSupportRequests: () => void;
  onOpenAudit: () => void;
  onOpenDevices: () => void;
};

function OverviewPage({
  dashboard,
  hotelProfile,
  selectedHotel,
  loading,
  emptyState,
  copy,
  locale,
  onAcknowledgeSupportRequests,
  onOpenAudit,
  onOpenDevices,
}: OverviewPageProps) {
  const metrics: OverviewMetric[] = buildMetricCards(dashboard, copy.dashboard.metrics, locale);
  const trendPoints: TrendPoint[] = buildTrendPoints(dashboard, copy.dashboard);
  const trendPath = buildTrendPath(trendPoints);
  const trendMax = Math.max(...trendPoints.map((point) => point.value), 1);
  const trendMid = Math.max(1, Math.round(trendMax / 2));
  const activity = buildActivityFeed(dashboard, selectedHotel?.id ?? null, copy.dashboard.activity, locale as "en" | "pt-BR" | "es");
  const units = buildUnits(dashboard, selectedHotel, hotelProfile, copy.dashboard.units, locale);
  const recentSupportRequests = (dashboard?.recentSessions ?? []).filter(
    (record) => isSupportRequest(record) && isSelectedHotelEvent(record, selectedHotel?.id ?? null)
  );
  const openSupportRequests = dashboard?.openSupportRequests ?? recentSupportRequests.length;
  const latestSupportRequest = recentSupportRequests[0];
  const supportRequestTime = latestSupportRequest
    ? formatEventTimestamp(latestSupportRequest.createdAt ?? latestSupportRequest.created_at ?? latestSupportRequest.timestamp, locale as "en" | "pt-BR" | "es")
    : "";

  return (
    <section className="admin-overview">
      <section className="admin-metrics">
        {metrics.map((metric) => (
          <article key={metric.label} className="admin-card admin-card--metric">
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <p>{metric.detail}</p>
          </article>
        ))}
      </section>

      {openSupportRequests > 0 ? (
        <section className="admin-support-request" aria-label={copy.supportRequestTitle}>
          <div className="admin-support-request__signal" aria-hidden="true">
            <span />
          </div>
          <div className="admin-support-request__content">
            <span>{copy.supportRequestEyebrow}</span>
            <h2>{copy.supportRequestTitle}</h2>
            <p>{copy.supportRequestDescription}</p>
          </div>
          <div className="admin-support-request__meta">
            <strong>
              {openSupportRequests} {openSupportRequests === 1 ? copy.supportRequestCountSingular : copy.supportRequestCountPlural}
            </strong>
            {supportRequestTime ? <small>{supportRequestTime}</small> : null}
          </div>
          <button className="admin-support-request__action" type="button" onClick={onAcknowledgeSupportRequests}>
            {copy.supportRequestAcknowledge}
          </button>
        </section>
      ) : null}

      <section className="admin-overview-layout">
        <article className="admin-card admin-card--chart">
          <div className="admin-card__head">
            <div>
              <h2>{copy.trafficAndDemandLabel}</h2>
              <p className="admin-copy">{copy.trafficAndDemandSubtitle}</p>
            </div>
          </div>

          {loading ? (
            <p className="admin-empty">{copy.loadingLabel}</p>
          ) : dashboard ? (
            <div className="admin-trend">
              <div className="admin-trend__chart">
                <div className="admin-trend__y-axis" aria-hidden="true">
                  <span className="admin-trend__y-axis-label">{copy.dashboard.trendYAxisLabel}</span>
                  <span className="admin-trend__y-axis-value">{formatNumber(trendMax, locale)}</span>
                  <span className="admin-trend__y-axis-value admin-trend__y-axis-value--mid">{formatNumber(trendMid, locale)}</span>
                  <span className="admin-trend__y-axis-value admin-trend__y-axis-value--min">0</span>
                </div>
                <svg viewBox="0 0 100 60" className="admin-trend__svg" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#48a277" stopOpacity="0.34" />
                      <stop offset="100%" stopColor="#eff7ed" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  <path d={trendPath} fill="none" stroke="#27805e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.07" />
                  <path d={`${trendPath} L 100 60 L 0 60 Z`} fill="url(#trendFill)" />
                  <path d={trendPath} fill="none" stroke="#27805e" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="admin-trend__labels">
                {trendPoints.map((point) => (
                  <span key={point.label}>{point.label}</span>
                ))}
              </div>
            </div>
          ) : (
            <p className="admin-empty">{emptyState}</p>
          )}
        </article>

        <aside className="admin-card admin-card--activity">
          <div className="admin-card__head">
            <div>
              <h2>{copy.liveActivityLabel}</h2>
            </div>
          </div>

          <div className="admin-activity-feed">
            {activity.length ? (
              activity.map((item, index) => (
                <article key={`${item.meta}-${index}`} className={`admin-activity-item admin-activity-item--${item.tone}`}>
                  <span className="admin-activity-item__dot" />
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.subtitle}</p>
                    <small>{item.meta}</small>
                  </div>
                </article>
              ))
            ) : (
              <p className="admin-empty">{copy.noActivityLabel}</p>
            )}
          </div>

          <button className="admin-secondary-button admin-card__footer-button" type="button" onClick={onOpenAudit}>
            {copy.viewAllLogsLabel}
          </button>
        </aside>
      </section>

      <section className="admin-units">
        <div className="admin-units__head">
          <div>
            <h2>{copy.performanceTitle}</h2>
            <p className="admin-copy">{copy.performanceSubtitle}</p>
          </div>
          <span className="admin-units__hint">{copy.manageFleetLabel}</span>
        </div>

        <div className="admin-unit-grid">
          {units.length ? (
            units.map((unit) => (
              <article key={unit.name} className="admin-unit-card admin-card">
                <div className="admin-unit-card__visual" style={{ background: `linear-gradient(135deg, ${unit.accent}, rgba(255,255,255,0.18))` }}>
                  <div className="admin-unit-card__visual-chip">{unit.status}</div>
                </div>
                <div className="admin-unit-card__body">
                  <div className="admin-unit-card__title-row">
                    <h3>{unit.name}</h3>
                    <span className={`admin-unit-chip admin-unit-chip--${unit.statusTone}`}>{unit.metric}</span>
                  </div>
                  <p className="admin-copy">{unit.subtitle}</p>
                  <div className="admin-unit-card__footer">
                    <small>{unit.detail}</small>
                    <button type="button" onClick={onOpenDevices}>
                      {copy.viewLiveLabel}
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="admin-empty">{copy.noUnitsLabel}</p>
          )}
        </div>
      </section>
    </section>
  );
}

export default OverviewPage;
