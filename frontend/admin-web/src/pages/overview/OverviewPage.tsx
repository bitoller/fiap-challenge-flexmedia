import type { DashboardResult, HotelProfile, HotelSummary } from "../../types";
import type { OverviewMetric, TrendPoint } from "../../admin/types";
import { buildActivityFeed, buildMetricCards, buildTrendPath, buildTrendPoints, buildUnits } from "../../admin/dashboard";

type OverviewPageProps = {
  dashboard: DashboardResult | null;
  hotelProfile: HotelProfile | null;
  selectedHotel: HotelSummary | null;
  loading: boolean;
  emptyState: string;
  loadingLabel: string;
  noActivityLabel: string;
  noUnitsLabel: string;
  liveActivityLabel: string;
  performanceTitle: string;
  performanceSubtitle: string;
  trafficAndDemandLabel: string;
  trafficAndDemandSubtitle: string;
  manageFleetLabel: string;
  viewAllLogsLabel: string;
  exportDataLabel: string;
  viewLiveLabel: string;
  onRefresh: () => void;
  onOpenAudit: () => void;
};

function OverviewPage({
  dashboard,
  hotelProfile,
  selectedHotel,
  loading,
  emptyState,
  loadingLabel,
  noActivityLabel,
  noUnitsLabel,
  liveActivityLabel,
  performanceTitle,
  performanceSubtitle,
  trafficAndDemandLabel,
  trafficAndDemandSubtitle,
  manageFleetLabel,
  viewAllLogsLabel,
  exportDataLabel,
  viewLiveLabel,
  onRefresh,
  onOpenAudit,
}: OverviewPageProps) {
  const metrics: OverviewMetric[] = buildMetricCards(dashboard);
  const trendPoints: TrendPoint[] = buildTrendPoints(dashboard);
  const trendPath = buildTrendPath(trendPoints);
  const activity = buildActivityFeed(dashboard, selectedHotel?.id ?? null);
  const units = buildUnits(dashboard, selectedHotel, hotelProfile);

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

      <section className="admin-overview-layout">
        <article className="admin-card admin-card--chart">
          <div className="admin-card__head">
            <div>
              <h2>{trafficAndDemandLabel}</h2>
              <p className="admin-copy">{trafficAndDemandSubtitle}</p>
            </div>
            <div className="admin-card__actions">
              <button className="admin-secondary-button" type="button" onClick={onRefresh}>
                {exportDataLabel}
              </button>
              <button className="admin-primary-button" type="button" onClick={onRefresh}>
                {viewLiveLabel}
              </button>
            </div>
          </div>

          {loading ? (
            <p className="admin-empty">{loadingLabel}</p>
          ) : dashboard ? (
            <div className="admin-trend">
              <svg viewBox="0 0 100 60" className="admin-trend__svg" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#d8b46d" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#f7f2e8" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <path d={trendPath} fill="none" stroke="#9d7724" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.07" />
                <path d={`${trendPath} L 100 60 L 0 60 Z`} fill="url(#trendFill)" />
                <path d={trendPath} fill="none" stroke="#9d7724" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
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
              <h2>{liveActivityLabel}</h2>
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
              <p className="admin-empty">{noActivityLabel}</p>
            )}
          </div>

          <button className="admin-secondary-button admin-card__footer-button" type="button" onClick={onOpenAudit}>
            {viewAllLogsLabel}
          </button>
        </aside>
      </section>

      <section className="admin-units">
        <div className="admin-units__head">
          <div>
            <h2>{performanceTitle}</h2>
            <p className="admin-copy">{performanceSubtitle}</p>
          </div>
          <span className="admin-units__hint">{manageFleetLabel}</span>
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
                    <button type="button">{viewLiveLabel}</button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="admin-empty">{noUnitsLabel}</p>
          )}
        </div>
      </section>
    </section>
  );
}

export default OverviewPage;
