import React from "react";
import { useTranslation } from "react-i18next";
import { useHotelBranding } from "../../../core/hotelBranding";

interface HeaderProps {
  onLanguageChange?: (language: string) => void;
  currentLanguage?: string;
}

export const Header: React.FC<HeaderProps> = ({ onLanguageChange, currentLanguage = "en" }) => {
  const { t } = useTranslation("common");
  const { hotel } = useHotelBranding();
  const languages = [
    { code: "en", label: "EN" },
    { code: "pt-BR", label: "PT" },
    { code: "es", label: "ES" },
  ];

  return (
    <header className="kiosk-header">
      <div className="container-fluid h-100">
        <div className="row h-100 align-items-center justify-content-between">
          <div className="col-auto">
            <h1 className="kiosk-hotel-name">{hotel.name || t("hotelName")}</h1>
          </div>
          <div className="col-auto">
            <div className="language-selector language-selector--header" aria-label={t("languageLabel")}>
              <span className="language-globe" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="language-globe-svg" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M3.5 12h17" />
                  <path d="M12 3.5a13 13 0 0 1 0 17" />
                  <path d="M12 3.5a13 13 0 0 0 0 17" />
                </svg>
              </span>
              {languages.map((language, index) => (
                <React.Fragment key={language.code}>
                  <button
                    type="button"
                    className={`lang-btn ${currentLanguage === language.code ? "active" : ""}`.trim()}
                    onClick={() => onLanguageChange?.(language.code)}
                    aria-pressed={currentLanguage === language.code}
                    aria-label={`Switch to ${language.label}`}
                  >
                    {language.label}
                  </button>
                  {index < languages.length - 1 ? <span className="language-divider" aria-hidden="true">|</span> : null}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
