import { useEffect, useRef, useState } from "react";
import type { Language } from "../admin/types";

type AdminDatePickerProps = {
  ariaLabel: string;
  language: Language;
  value: string;
  onChange: (value: string) => void;
};

type CalendarDay = {
  date: Date;
  inCurrentMonth: boolean;
};

const localeByLanguage: Record<Language, string> = {
  en: "en-US",
  "pt-BR": "pt-BR",
  es: "es-ES",
};

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day) ? new Date(year, month - 1, day) : new Date();
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCalendarDays(month: Date): CalendarDay[] {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return { date, inCurrentMonth: date.getMonth() === month.getMonth() };
  });
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  );
}

function Chevron({ direction }: { direction: "previous" | "next" }) {
  return <span aria-hidden="true">{direction === "previous" ? "‹" : "›"}</span>;
}

function AdminDatePicker({ ariaLabel, language, value, onChange }: AdminDatePickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedDate = parseDate(value);
  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  const locale = localeByLanguage[language];
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(2024, 0, 7 + index);
    return new Intl.DateTimeFormat(locale, { weekday: "narrow" }).format(date);
  });
  const calendarDays = getCalendarDays(visibleMonth);
  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(visibleMonth);
  const displayValue = new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(selectedDate);

  useEffect(() => {
    const closeOnOutsideInteraction = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideInteraction);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideInteraction);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const selectDate = (date: Date) => {
    onChange(toIsoDate(date));
    setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} className="admin-date-picker">
      <button
        type="button"
        className="admin-date-picker__trigger"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{displayValue}</span>
        <CalendarIcon />
      </button>

      {isOpen ? (
        <div className="admin-date-picker__calendar" role="dialog" aria-label={ariaLabel}>
          <div className="admin-date-picker__toolbar">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            >
              <Chevron direction="previous" />
            </button>
            <strong>{monthLabel}</strong>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            >
              <Chevron direction="next" />
            </button>
          </div>
          <div className="admin-date-picker__weekdays" aria-hidden="true">
            {weekDays.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
          </div>
          <div className="admin-date-picker__days">
            {calendarDays.map(({ date, inCurrentMonth }) => {
              const isoDate = toIsoDate(date);
              const isSelected = isoDate === value;
              const isToday = isoDate === toIsoDate(new Date());
              return (
                <button
                  key={isoDate}
                  type="button"
                  className={`${!inCurrentMonth ? "is-outside-month " : ""}${isSelected ? "is-selected " : ""}${isToday ? "is-today" : ""}`.trim()}
                  aria-pressed={isSelected}
                  onClick={() => selectDate(date)}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AdminDatePicker;
