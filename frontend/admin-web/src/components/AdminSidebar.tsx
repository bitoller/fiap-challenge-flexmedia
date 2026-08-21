import type { ViewKey } from "../admin/types";
import AdminIcon from "./AdminIcon";

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
  const navigation = ["overview", "reservations", "devices", "audit", "branding"] as ViewKey[];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <div className="admin-sidebar__mark"><AdminIcon name="spark" /></div>
        <div>
          <p className="admin-brand">{portal}</p>
          <span className="admin-role">{role}</span>
        </div>
      </div>

      <nav className="admin-nav">
        {navigation.map((view) => (
          <button key={view} type="button" className={selectedView === view ? "is-active" : ""} onClick={() => onSelectView(view)}>
            <AdminIcon name={view} />
            {labels[view]}
          </button>
        ))}
      </nav>

      <button className="admin-sidebar__logout" type="button" onClick={onLogout}>
        <AdminIcon name="logout" />
        {logoutLabel}
      </button>
    </aside>
  );
}

export default AdminSidebar;
