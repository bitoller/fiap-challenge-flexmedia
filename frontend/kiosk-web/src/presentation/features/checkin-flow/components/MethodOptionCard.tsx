import { ReactNode } from "react";

interface MethodOptionCardProps {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function MethodOptionCard({
  title,
  subtitle,
  icon,
  selected = false,
  disabled = false,
  onClick,
}: MethodOptionCardProps) {
  return (
    <button
      type="button"
      className={`checkin-method-card ${selected ? "is-selected" : ""} ${disabled ? "is-disabled" : ""}`.trim()}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
    >
      <span className="checkin-method-card__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="checkin-method-card__copy">
        <span className="checkin-method-card__title">{title}</span>
        {subtitle ? <span className="checkin-method-card__subtitle">{subtitle}</span> : null}
      </span>
    </button>
  );
}
