interface LanguageSelectorProps {
  currentLanguage: string;
  onChange: (language: string) => void;
}

const LANGUAGE_OPTIONS = [
  { code: "en", label: "EN" },
  { code: "pt-BR", label: "PT" },
  { code: "es", label: "ES" },
];

export function LanguageSelector({ currentLanguage, onChange }: LanguageSelectorProps) {
  return (
    <div className="language-selector">
      {LANGUAGE_OPTIONS.map((language) => (
        <button
          key={language.code}
          type="button"
          className={`lang-btn ${currentLanguage === language.code ? "active" : ""}`.trim()}
          onClick={() => onChange(language.code)}
          aria-pressed={currentLanguage === language.code}
          aria-label={`Switch to ${language.label}`}
        >
          {language.label}
        </button>
      ))}
    </div>
  );
}
