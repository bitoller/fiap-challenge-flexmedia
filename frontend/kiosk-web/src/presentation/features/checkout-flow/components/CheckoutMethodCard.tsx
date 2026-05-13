import { ReactNode } from "react";

interface CheckoutMethodCardProps {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function CheckoutMethodCard({
  title,
  subtitle,
  icon,
  selected = false,
  disabled = false,
  onClick,
}: CheckoutMethodCardProps) {
  return (
    <button
      type="button"
      className={`checkout-method-card ${selected ? "is-selected" : ""} ${disabled ? "is-disabled" : ""}`.trim()}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
    >
      <span className="checkout-method-card__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="checkout-method-card__title">{title}</span>
      {subtitle ? <span className="checkout-method-card__subtitle">{subtitle}</span> : null}
    </button>
  );
}
