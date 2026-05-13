import { CheckoutCharge } from "../../../../domain/models";

interface CheckoutChargeListProps {
  charges: CheckoutCharge[];
  currency: string;
  locale: string;
}

export function CheckoutChargeList({ charges, currency, locale }: CheckoutChargeListProps) {
  const formatAmount = (amount: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount);

  return (
    <div className="checkout-charge-list">
      {charges.map((charge) => (
        <article key={charge.code} className="checkout-charge-list__item">
          <div>
            <span className="checkout-charge-list__title">{charge.description}</span>
            <span className="checkout-charge-list__code">{charge.code}</span>
          </div>
          <strong>{formatAmount(charge.amount)}</strong>
        </article>
      ))}
    </div>
  );
}
