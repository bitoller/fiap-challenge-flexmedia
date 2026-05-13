import { CheckinBottomNavKey } from "../../../../domain/types";

interface BottomNavItem {
  key: CheckinBottomNavKey;
  label: string;
  icon: "home" | "assistant" | "emergency";
  active?: boolean;
  onClick?: () => void;
}

interface FlowBottomNavProps {
  items: BottomNavItem[];
}

function BottomNavIcon({ icon }: { icon: BottomNavItem["icon"] }) {
  if (icon === "home") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5.5 11.2 12 5l6.5 6.2V19H14v-4.5H10V19H5.5v-7.8Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }

  if (icon === "assistant") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5.5 4.5h13v9h-7l-4.1 3v-3h-1.9v-9Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4.4v15.2M4.4 12h15.2M6.7 6.7l10.6 10.6M17.3 6.7 6.7 17.3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function FlowBottomNav({ items }: FlowBottomNavProps) {
  return (
    <nav className="checkin-bottom-nav" aria-label="Check-in navigation">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`checkin-bottom-nav__item ${item.active ? "is-active" : ""}`.trim()}
          onClick={item.onClick}
          disabled={!item.onClick}
          aria-pressed={item.active}
        >
          <span className="checkin-bottom-nav__icon">
            <BottomNavIcon icon={item.icon} />
          </span>
          <span className="checkin-bottom-nav__label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
