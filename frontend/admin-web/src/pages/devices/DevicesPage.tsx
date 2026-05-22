import { useMemo, useState } from "react";
import { formatNumber } from "../../admin/dashboard";
import type { AdminCopy } from "../../admin/copy";
import type { DeviceStatus, KioskDevice } from "../../types";

type DevicesPageProps = {
  deviceStatus: DeviceStatus | null;
  hotelName: string | null;
  emptyState: string;
  copy: AdminCopy["devicesPage"];
  locale: string;
  onRefresh: () => void;
};

function formatBattery(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return null;
  }
  return `${value}%`;
}

function formatLastSeen(value: string, locale: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function statusTone(status: string) {
  const value = status.toUpperCase();
  if (value.includes("OFFLINE") || value.includes("ERROR")) {
    return "danger";
  }
  if (value.includes("MAINT")) {
    return "warning";
  }
  return "good";
}

function moduleTone(active: boolean) {
  return active ? "good" : "danger";
}

function moduleLabel(active: boolean, copy: AdminCopy["devicesPage"]) {
  return active ? copy.online : copy.offline;
}

function sortDevices(devices: KioskDevice[]) {
  return [...devices].sort((left, right) => {
    const leftWeight = left.status.toUpperCase() === "ONLINE" ? 0 : left.status.toUpperCase() === "MAINTENANCE" ? 1 : 2;
    const rightWeight = right.status.toUpperCase() === "ONLINE" ? 0 : right.status.toUpperCase() === "MAINTENANCE" ? 1 : 2;
    if (leftWeight !== rightWeight) {
      return leftWeight - rightWeight;
    }
    return left.deviceCode.localeCompare(right.deviceCode);
  });
}

function DevicesPage({ deviceStatus, hotelName, emptyState, copy, locale, onRefresh }: DevicesPageProps) {
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);

  const devices = useMemo(() => sortDevices(deviceStatus?.devices ?? []), [deviceStatus]);
  const total = deviceStatus?.totalDevices ?? 0;
  const online = deviceStatus?.onlineDevices ?? 0;
  const alerts = (deviceStatus?.offlineDevices ?? 0) + (deviceStatus?.maintenanceDevices ?? 0) + (deviceStatus?.errorDevices ?? 0);
  const connectivity = total > 0 ? ((online / total) * 100).toFixed(1) : "0.0";
  const activeLabel = total > 0 ? `${formatNumber(total, locale)} ${copy.units}` : `0 ${copy.units}`;
  const alertLabel = alerts > 0 ? `${formatNumber(alerts, locale)} ${copy.pending}` : `0 ${copy.pending}`;

  const selectedDevice = devices.find((device) => device.id === selectedDeviceId) ?? null;

  if (!deviceStatus || devices.length === 0) {
    return (
      <section className="admin-devices">
        <div className="admin-devices__hero">
          <div>
            <p className="admin-eyebrow">{copy.heroKicker}</p>
            <h2>{copy.heroTitle}</h2>
            <p className="admin-copy admin-copy--compact">{emptyState}</p>
          </div>
          <button type="button" className="admin-secondary-button" onClick={onRefresh}>
            {copy.refreshFleet}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-devices">
      <div className="admin-devices__hero">
        <div>
          <p className="admin-eyebrow">{copy.heroKicker}</p>
          <h2>{copy.heroTitle}</h2>
          <p className="admin-copy admin-copy--compact">
            {hotelName ? copy.heroSubtitleWithHotel.replace("{hotelName}", hotelName) : copy.heroSubtitleFallback}
          </p>
        </div>
        <button type="button" className="admin-secondary-button" onClick={onRefresh}>
          {copy.refreshFleet}
        </button>
      </div>

      <div className="admin-metrics admin-devices__metrics">
        <article className="admin-card admin-card--metric admin-card--device-metric">
          <p>{copy.totalActiveKiosks}</p>
          <strong>{activeLabel}</strong>
          <span>{copy.allSystemsOperational}</span>
        </article>
        <article className="admin-card admin-card--metric admin-card--device-metric">
          <p>{copy.averageConnectivity}</p>
          <strong>{connectivity}%</strong>
          <span>{online > 0 ? `+${formatNumber(online, locale)} ${copy.online}` : copy.offline}</span>
        </article>
        <article className="admin-card admin-card--metric admin-card--device-metric">
          <p>{copy.alertsPending}</p>
          <strong>{alertLabel}</strong>
          <span>{alerts > 0 ? copy.attentionNeeded : copy.noCriticalTasks}</span>
        </article>
      </div>

      <article className="admin-card admin-devices__fleet">
        <div className="admin-devices__fleet-head">
          <div>
            <h3>{copy.fleetStatus}</h3>
            <p className="admin-copy">{copy.liveStatus}</p>
          </div>
          <span className="admin-live-pill">{hotelName ?? copy.allProperties}</span>
        </div>

        <div className="admin-device-list">
          {devices.map((device) => {
            const isSelected = selectedDevice?.id === device.id;
            const batteryLabel = formatBattery(device.batteryLevel);

            return (
              <div key={device.id} className={`admin-device-card ${isSelected ? "is-selected" : ""}`}>
                <div className="admin-device-card__row">
                  <div className="admin-device-card__identity">
                    <strong>{device.name}</strong>
                    <span>
                      ID: {device.deviceCode} - Hotel {device.hotelId}
                    </span>
                  </div>
                  <div className={`admin-device-pill admin-device-pill--${statusTone(device.status)}`}>{device.status}</div>
                </div>

                <div className="admin-device-card__row admin-device-card__row--modules">
                  <div className={`admin-device-module admin-device-module--${moduleTone(device.printerOnline)}`}>
                    <span>{copy.printer}</span>
                    <strong>{moduleLabel(device.printerOnline, copy)}</strong>
                  </div>
                  <div className={`admin-device-module admin-device-module--${moduleTone(device.cameraOnline)}`}>
                    <span>{copy.camera}</span>
                    <strong>{moduleLabel(device.cameraOnline, copy)}</strong>
                  </div>
                  <div className={`admin-device-module admin-device-module--${device.batteryLevel !== null && device.batteryLevel >= 20 ? "good" : "warning"}`}>
                    <span>{copy.battery}</span>
                    <strong>{batteryLabel ?? copy.batteryUnavailable}</strong>
                  </div>
                  <div className="admin-device-module">
                    <span>{copy.lastSeen}</span>
                    <strong>{formatLastSeen(device.lastSeenAt, locale)}</strong>
                  </div>
                </div>

                {isSelected ? (
                  <div className="admin-device-card__details">
                    <div>
                      <span>{copy.deviceCode}</span>
                      <strong>{device.deviceCode}</strong>
                    </div>
                    <div>
                      <span>{copy.status}</span>
                      <strong>{device.status}</strong>
                    </div>
                    <div>
                      <span>{copy.batteryLevel}</span>
                      <strong>{batteryLabel ?? copy.batteryUnavailable}</strong>
                    </div>
                  </div>
                ) : null}

                <div className="admin-device-card__actions">
                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={() => setSelectedDeviceId((current) => (current === device.id ? null : device.id))}
                  >
                    {isSelected ? copy.hideDetails : copy.details}
                  </button>
                  <span className="admin-device-card__meta">
                    {copy.updated} {formatLastSeen(device.lastSeenAt, locale)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </article>
    </section>
  );
}

export default DevicesPage;
