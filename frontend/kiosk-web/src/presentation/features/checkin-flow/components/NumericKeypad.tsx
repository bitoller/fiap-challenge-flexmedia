import { Check, Delete } from "lucide-react";

interface NumericKeypadProps {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
}

const keys = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
] as const;

export function NumericKeypad({
  onDigit,
  onBackspace,
  onConfirm,
  confirmDisabled = false,
}: NumericKeypadProps) {
  return (
    <div className="checkin-keypad" aria-label="Numeric keypad">
      {keys.map((digit) => (
        <button key={digit} type="button" className="checkin-keypad__key" onClick={() => onDigit(digit)}>
          {digit}
        </button>
      ))}
      <button
        type="button"
        className="checkin-keypad__key checkin-keypad__key--soft"
        onClick={onBackspace}
        aria-label="Delete entry"
      >
        <span className="checkin-keypad__icon" aria-hidden="true">
          <Delete />
        </span>
      </button>
      <button type="button" className="checkin-keypad__key" onClick={() => onDigit("0")}>
        0
      </button>
      <button
        type="button"
        className={`checkin-keypad__key checkin-keypad__key--confirm ${confirmDisabled ? "is-disabled" : ""}`.trim()}
        onClick={onConfirm}
        aria-label="Confirm"
      >
        <span className="checkin-keypad__icon" aria-hidden="true">
          <Check />
        </span>
      </button>
    </div>
  );
}
