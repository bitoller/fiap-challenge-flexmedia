interface FlowStepHeaderProps {
  step: string;
  title: string;
  subtitle?: string;
}

export function FlowStepHeader({ step, title, subtitle }: FlowStepHeaderProps) {
  return (
    <div className="checkin-step-header">
      <p className="checkin-step-header__step">{step}</p>
      <h1 className="checkin-step-header__title">{title}</h1>
      {subtitle ? <p className="checkin-step-header__subtitle">{subtitle}</p> : null}
    </div>
  );
}
