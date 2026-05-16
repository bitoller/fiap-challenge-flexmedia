type DevicesPageProps = {
  devices: Array<Record<string, unknown>>;
  emptyState: string;
};

function DevicesPage({ devices, emptyState }: DevicesPageProps) {
  return (
    <section className="admin-panel">
      <div className="admin-card">
        <h2>Devices</h2>
        {devices.length ? (
          <ul className="admin-list">
            {devices.map((device, index) => (
              <li key={index}>{JSON.stringify(device)}</li>
            ))}
          </ul>
        ) : (
          <p className="admin-empty">{emptyState}</p>
        )}
      </div>
    </section>
  );
}

export default DevicesPage;
