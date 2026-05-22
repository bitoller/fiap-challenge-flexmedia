import { Button } from "./Button";

interface RecoveryScreenAction {
  label: string;
  onClick: () => void;
  variant: "primary" | "secondary";
}

interface RecoveryScreenProps {
  eyebrow: string;
  title: string;
  body: string;
  primaryAction: RecoveryScreenAction;
  secondaryAction: RecoveryScreenAction;
}

function RecoveryIcon() {
  return (
    <span className="kiosk-recovery-screen__badge" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8.2" />
        <path d="M12 8.3v4.4" />
        <path d="M12 15.7h.01" />
      </svg>
    </span>
  );
}

export function RecoveryScreen({
  eyebrow,
  title,
  body,
  primaryAction,
  secondaryAction,
}: RecoveryScreenProps) {
  return (
    <section className="kiosk-recovery-screen" aria-label={title}>
      <div className="kiosk-recovery-screen__card">
        <RecoveryIcon />

        <p className="kiosk-recovery-screen__eyebrow">{eyebrow}</p>
        <div className="kiosk-recovery-screen__rule" aria-hidden="true" />
        <h1 className="kiosk-recovery-screen__title">{title}</h1>
        <p className="kiosk-recovery-screen__body">{body}</p>

        <div className="kiosk-recovery-screen__actions">
          <Button
            variant={primaryAction.variant}
            size="lg"
            onClick={primaryAction.onClick}
            className="kiosk-recovery-screen__button"
          >
            {primaryAction.label}
          </Button>

          <Button
            variant={secondaryAction.variant}
            size="lg"
            onClick={secondaryAction.onClick}
            className="kiosk-recovery-screen__button"
          >
            {secondaryAction.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
