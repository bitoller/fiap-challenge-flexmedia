interface CheckoutKeypadProps {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
}

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

export function CheckoutKeypad({
  onDigit,
  onBackspace,
  onConfirm,
  confirmDisabled = false,
}: CheckoutKeypadProps) {
  return (
    <div className="checkout-keypad" aria-label="Checkout keypad">
      {keys.map((digit) => (
        <button key={digit} type="button" className="checkout-keypad__key" onClick={() => onDigit(digit)}>
          {digit}
        </button>
      ))}
      <button type="button" className="checkout-keypad__key checkout-keypad__key--soft" onClick={onBackspace} aria-label="Delete">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M9 6h8l4 6-4 6H9L3 12l6-6Zm1.7 4.2L8.4 13l2.3 2.8m0-5.6L8.4 11m2.3 1.2 3.1-3.1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button type="button" className="checkout-keypad__key" onClick={() => onDigit("0")}>
        0
      </button>
      <button
        type="button"
        className={`checkout-keypad__key checkout-keypad__key--confirm ${confirmDisabled ? "is-disabled" : ""}`.trim()}
        disabled={confirmDisabled}
        onClick={onConfirm}
        aria-label="Confirm"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M7.5 12.1l3.1 3.1 6-6.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
