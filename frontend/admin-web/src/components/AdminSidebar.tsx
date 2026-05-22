import type { ViewKey } from "../admin/types";

type AdminSidebarProps = {
  portal: string;
  role: string;
  labels: Record<ViewKey, string>;
  logoutLabel: string;
  selectedView: ViewKey;
  onSelectView: (view: ViewKey) => void;
  onLogout: () => void;
};

function AdminSidebar({ portal, role, labels, logoutLabel, selectedView, onSelectView, onLogout }: AdminSidebarProps) {
  return (
    <aside className="admin-sidebar">
      <div>
        <p className="admin-brand">{portal}</p>
        <span className="admin-role">{role}</span>
      </div>

      <nav className="admin-nav">
        {(["overview", "reservations", "devices", "audit", "branding", "identity"] as ViewKey[]).map((view) => (
          <button key={view} type="button" className={selectedView === view ? "is-active" : ""} onClick={() => onSelectView(view)}>
            {labels[view]}
          </button>
        ))}
      </nav>

      <button className="admin-secondary-button" type="button" onClick={onLogout}>
        {logoutLabel}
      </button>
    </aside>
  );
}

export default AdminSidebar;
