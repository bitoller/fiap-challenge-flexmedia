interface CheckoutStepHeaderProps {
  step: string;
  title: string;
  subtitle?: string;
}

export function CheckoutStepHeader({ step, title, subtitle }: CheckoutStepHeaderProps) {
  return (
    <header className="checkout-step-header">
      <p className="checkout-step-header__eyebrow">{step}</p>
      <h1 className="checkout-step-header__title">{title}</h1>
      {subtitle ? <p className="checkout-step-header__subtitle">{subtitle}</p> : null}
    </header>
  );
}
