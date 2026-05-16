import { useMemo, useState } from "react";
import { formatNumber } from "../../admin/dashboard";
import type { DeviceStatus, KioskDevice } from "../../types";

type DevicesPageProps = {
  deviceStatus: DeviceStatus | null;
  hotelName: string | null;
  emptyState: string;
  onRefresh: () => void;
};

function formatBattery(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return "N/A";
  }
  return `${value}%`;
}

function formatLastSeen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat(undefined, {
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

function moduleLabel(active: boolean) {
  return active ? "Ready" : "Offline";
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

function DevicesPage({ deviceStatus, hotelName, emptyState, onRefresh }: DevicesPageProps) {
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);

  const devices = useMemo(() => sortDevices(deviceStatus?.devices ?? []), [deviceStatus]);
  const total = deviceStatus?.totalDevices ?? 0;
  const online = deviceStatus?.onlineDevices ?? 0;
  const alerts = (deviceStatus?.offlineDevices ?? 0) + (deviceStatus?.maintenanceDevices ?? 0) + (deviceStatus?.errorDevices ?? 0);
  const connectivity = total > 0 ? ((online / total) * 100).toFixed(1) : "0.0";
  const activeLabel = total > 0 ? `${formatNumber(total)} units` : "0 units";
  const alertLabel = alerts > 0 ? `${formatNumber(alerts)} pending` : "00";

  const selectedDevice = devices.find((device) => device.id === selectedDeviceId) ?? null;

  if (!deviceStatus || devices.length === 0) {
    return (
      <section className="admin-devices">
        <div className="admin-devices__hero">
          <div>
            <p className="admin-eyebrow">Network operations center</p>
            <h2>Device Status & Monitoring</h2>
            <p className="admin-copy admin-copy--compact">{emptyState}</p>
          </div>
          <button type="button" className="admin-secondary-button" onClick={onRefresh}>
            Refresh fleet
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-devices">
      <div className="admin-devices__hero">
        <div>
          <p className="admin-eyebrow">Network operations center</p>
          <h2>Device Status & Monitoring</h2>
          <p className="admin-copy admin-copy--compact">
            {hotelName ? `Fleet overview for ${hotelName}` : "Fleet overview for the selected hotel, with live operational health and kiosk status."}
          </p>
        </div>
        <button type="button" className="admin-secondary-button" onClick={onRefresh}>
          Refresh fleet
        </button>
      </div>

      <div className="admin-metrics admin-devices__metrics">
        <article className="admin-card admin-card--metric admin-card--device-metric">
          <p>Total active kiosks</p>
          <strong>{activeLabel}</strong>
          <span>All systems operational</span>
        </article>
        <article className="admin-card admin-card--metric admin-card--device-metric">
          <p>Average connectivity</p>
          <strong>{connectivity}%</strong>
          <span>{online > 0 ? `+${formatNumber(online)} online` : "No active devices"}</span>
        </article>
        <article className="admin-card admin-card--metric admin-card--device-metric">
          <p>Alerts pending</p>
          <strong>{alertLabel}</strong>
          <span>{alerts > 0 ? "Attention needed" : "No critical tasks"}</span>
        </article>
      </div>

      <article className="admin-card admin-devices__fleet">
        <div className="admin-devices__fleet-head">
          <div>
            <h3>Kiosk Fleet Status</h3>
            <p className="admin-copy">Live status, hardware health, and last-seen information for the selected property.</p>
          </div>
          <span className="admin-live-pill">{hotelName ?? "All properties"}</span>
        </div>

        <div className="admin-device-list">
          {devices.map((device) => {
            const isSelected = selectedDevice?.id === device.id;
            return (
              <div key={device.id} className={`admin-device-card ${isSelected ? "is-selected" : ""}`}>
                <div className="admin-device-card__row">
                  <div className="admin-device-card__identity">
                    <strong>{device.name}</strong>
                    <span>
                      ID: {device.deviceCode} • Hotel {device.hotelId}
                    </span>
                  </div>
                  <div className={`admin-device-pill admin-device-pill--${statusTone(device.status)}`}>{device.status}</div>
                </div>

                <div className="admin-device-card__row admin-device-card__row--modules">
                  <div className={`admin-device-module admin-device-module--${moduleTone(device.printerOnline)}`}>
                    <span>Printer</span>
                    <strong>{moduleLabel(device.printerOnline)}</strong>
                  </div>
                  <div className={`admin-device-module admin-device-module--${moduleTone(device.cameraOnline)}`}>
                    <span>Camera</span>
                    <strong>{moduleLabel(device.cameraOnline)}</strong>
                  </div>
                  <div className={`admin-device-module admin-device-module--${device.batteryLevel !== null && device.batteryLevel >= 20 ? "good" : "warning"}`}>
                    <span>Battery</span>
                    <strong>{formatBattery(device.batteryLevel)}</strong>
                  </div>
                  <div className="admin-device-module">
                    <span>Last seen</span>
                    <strong>{formatLastSeen(device.lastSeenAt)}</strong>
                  </div>
                </div>

                {isSelected ? (
                  <div className="admin-device-card__details">
                    <div>
                      <span>Device code</span>
                      <strong>{device.deviceCode}</strong>
                    </div>
                    <div>
                      <span>Status</span>
                      <strong>{device.status}</strong>
                    </div>
                    <div>
                      <span>Battery level</span>
                      <strong>{formatBattery(device.batteryLevel)}</strong>
                    </div>
                  </div>
                ) : null}

                <div className="admin-device-card__actions">
                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={() => setSelectedDeviceId((current) => (current === device.id ? null : device.id))}
                  >
                    {isSelected ? "Hide details" : "Details"}
                  </button>
                  <span className="admin-device-card__meta">Updated {formatLastSeen(device.lastSeenAt)}</span>
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
