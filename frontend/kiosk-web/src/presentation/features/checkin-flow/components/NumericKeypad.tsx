import { Check, Delete } from "lucide-react";
import { useTranslation } from "react-i18next";

interface NumericKeypadProps {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
  showConfirm?: boolean;
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
  showConfirm = true,
}: NumericKeypadProps) {
  const { t } = useTranslation("common");

  return (
    <div className="checkin-keypad" aria-label={t("keypadLabel")}>
      {keys.map((digit) => (
        <button key={digit} type="button" className="checkin-keypad__key" onClick={() => onDigit(digit)}>
          {digit}
        </button>
      ))}
      <button
        type="button"
        className="checkin-keypad__key checkin-keypad__key--soft"
        onClick={onBackspace}
        aria-label={t("deleteEntry")}
      >
        <span className="checkin-keypad__icon" aria-hidden="true">
          <Delete />
        </span>
      </button>
      <button type="button" className="checkin-keypad__key" onClick={() => onDigit("0")}>
        0
      </button>
      {showConfirm ? (
        <button
          type="button"
          className={`checkin-keypad__key checkin-keypad__key--confirm ${confirmDisabled ? "is-disabled" : ""}`.trim()}
          onClick={onConfirm}
          disabled={confirmDisabled}
          aria-label={t("confirmEntry")}
        >
          <span className="checkin-keypad__icon" aria-hidden="true">
            <Check />
          </span>
        </button>
      ) : null}
    </div>
  );
}
