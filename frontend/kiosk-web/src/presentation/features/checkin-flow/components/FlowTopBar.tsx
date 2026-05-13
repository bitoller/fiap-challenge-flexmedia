import { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../hooks/useLanguage";

interface FlowTopBarProps {
  rightContent: ReactNode;
  rightDescription?: string;
}

export function FlowTopBar({ rightContent, rightDescription }: FlowTopBarProps) {
  const { t } = useTranslation("common");
  const { currentLanguage, changeLanguage } = useLanguage();
  const currentLabel = useMemo(() => {
    if (currentLanguage === "pt-BR") return "PORTUGUÊS";
    if (currentLanguage === "es") return "ESPAÑOL";
    return "ENGLISH";
  }, [currentLanguage]);

  const cycleLanguage = () => {
    if (currentLanguage === "en") {
      changeLanguage("pt-BR");
      return;
    }

    if (currentLanguage === "pt-BR") {
      changeLanguage("es");
      return;
    }

    changeLanguage("en");
  };

  return (
    <header className="checkin-topbar">
      <div className="checkin-topbar__brand">{t("hotelName")}</div>

      <div className="checkin-topbar__actions" aria-label={rightDescription ?? t("languageLabel")}>
        {rightContent}
        <button
          type="button"
          className="checkin-language-pill"
          onClick={cycleLanguage}
          aria-label={t("languageLabel")}
        >
          <span className="checkin-language-pill__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="8.4" />
              <path d="M3.8 12h16.4" />
              <path d="M12 3.6a14 14 0 0 1 0 16.8" />
              <path d="M12 3.6a14 14 0 0 0 0 16.8" />
            </svg>
          </span>
          <span className="checkin-language-pill__label">{currentLabel}</span>
        </button>
      </div>
    </header>
  );
}
