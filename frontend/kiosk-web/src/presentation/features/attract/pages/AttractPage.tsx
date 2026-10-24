import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useHotelBranding } from "../../../../core/hotelBranding";
import { useLanguage } from "../../../hooks/useLanguage";
import guestArrivalImage from "../../../../assets/attract/guest-arrival.jpg";
import breakfastRoomImage from "../../../../assets/attract/breakfast-room.jpg";
import resortPoolImage from "../../../../assets/attract/resort-pool.jpg";

const HIGHLIGHT_IMAGES = [resortPoolImage, breakfastRoomImage, guestArrivalImage];

const PROMOTION_TRANSLATION_KEYS: Record<string, { title: string; description: string }> = {
  "spa weekend": {
    title: "attractPromotionSpaTitle",
    description: "attractPromotionSpaBody",
  },
  "restaurant experience": {
    title: "attractPromotionRestaurantTitle",
    description: "attractPromotionRestaurantBody",
  },
};

function promotionTranslationKeys(title: string) {
  return PROMOTION_TRANSLATION_KEYS[title.trim().toLowerCase()];
}

const LANGUAGE_OPTIONS = [
  { code: "en", label: "EN", nameKey: "english" },
  { code: "pt-BR", label: "PT", nameKey: "portuguese" },
  { code: "es", label: "ES", nameKey: "spanish" },
] as const;

export function AttractPage() {
  const { t, i18n } = useTranslation("home");
  const { t: tCommon } = useTranslation("common");
  const navigate = useNavigate();
  const { hotel } = useHotelBranding();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [activeHighlight, setActiveHighlight] = useState(0);
  const [now, setNow] = useState(() => new Date());

  const highlights = useMemo(() => {
    const fallbackHighlights = [
      {
        eyebrow: t("attractArrivalEyebrow"),
        title: t("attractArrivalTitle"),
        description: t("attractArrivalBody"),
        image: guestArrivalImage,
      },
      {
        eyebrow: t("attractBreakfastEyebrow"),
        title: t("attractBreakfastTitle"),
        description: t("attractBreakfastBody"),
        image: breakfastRoomImage,
      },
      {
        eyebrow: t("attractPoolEyebrow"),
        title: t("attractPoolTitle"),
        description: t("attractPoolBody"),
        image: resortPoolImage,
      },
    ];

    const configuredPromotions = hotel.content.promotions
      .filter((promotion) => promotion.active)
      .sort((left, right) => left.order - right.order)
      .slice(0, 3)
      .map((promotion, index) => {
        const translationKeys = promotionTranslationKeys(promotion.title);

        return {
          eyebrow: t("attractFeatured"),
          title: translationKeys ? t(translationKeys.title) : promotion.title,
          description: translationKeys ? t(translationKeys.description) : promotion.description,
          image: HIGHLIGHT_IMAGES[index % HIGHLIGHT_IMAGES.length],
        };
      });

    if (!configuredPromotions.length) return fallbackHighlights;

    const supplementalHighlights = fallbackHighlights.filter(
      (highlight) => !configuredPromotions.some((promotion) => promotion.image === highlight.image)
    );

    return [...configuredPromotions, ...supplementalHighlights].slice(0, 3);
  }, [hotel.content.promotions, t]);

  useEffect(() => {
    setActiveHighlight(0);
  }, [highlights.length]);

  useEffect(() => {
    if (highlights.length < 2) return;

    const intervalId = window.setInterval(() => {
      setActiveHighlight((current) => (current + 1) % highlights.length);
    }, 8000);

    return () => window.clearInterval(intervalId);
  }, [highlights.length]);

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(intervalId);
  }, []);

  const begin = () => navigate("/home");
  const currentHighlight = highlights[activeHighlight] ?? highlights[0];
  const hotelName = hotel.name || tCommon("hotelName");
  const locale = i18n.language || currentLanguage;
  const timeLabel = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(now);
  const dateLabel = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(now);

  return (
    <div
      className={`attract-page attract-page--${activeHighlight % 3}`}
      onClick={(event) => {
        if (!(event.target as HTMLElement).closest("[data-attract-control]")) begin();
      }}
    >
      <header className="attract-header">
        <div className="attract-brand">
          {hotel.branding.logoUrl ? (
            <img src={hotel.branding.logoUrl} alt={hotelName} />
          ) : (
            <span>{hotelName}</span>
          )}
          <small>{t("attractHotelSignature")}</small>
        </div>

        <div className="attract-language" data-attract-control aria-label={tCommon("languageLabel")}>
          {LANGUAGE_OPTIONS.map((language) => (
            <button
              key={language.code}
              type="button"
              className={currentLanguage === language.code ? "is-active" : ""}
              onClick={() => changeLanguage(language.code)}
              aria-pressed={currentLanguage === language.code}
              aria-label={tCommon("switchLanguage", { language: tCommon(language.nameKey) })}
            >
              {language.label}
            </button>
          ))}
        </div>
      </header>

      <main className="attract-main">
        <section className="attract-welcome" aria-labelledby="attract-title">
          <p className="attract-eyebrow">{t("attractEyebrow")}</p>
          <h1 id="attract-title">{t("attractTitle", { hotelName })}</h1>
          <p className="attract-intro">{t("attractSubtitle")}</p>

          <button type="button" className="attract-start" onClick={begin} data-attract-control>
            <span>
              <strong>{t("attractStart")}</strong>
              <small>{t("attractStartHint")}</small>
            </span>
            <ArrowRight aria-hidden="true" />
          </button>

          <p className="attract-anywhere">{t("attractAnywhere")}</p>
        </section>

        <aside className="attract-feature" aria-label={t("attractHighlightsLabel")}>
          <img
            key={`${activeHighlight}-${currentHighlight.image}`}
            className="attract-feature__image"
            src={currentHighlight.image}
            alt=""
          />
          <div className="attract-feature__topline">
            <span>{t("attractHighlightsLabel")}</span>
            <span>{String(activeHighlight + 1).padStart(2, "0")} / {String(highlights.length).padStart(2, "0")}</span>
          </div>

          <div className="attract-feature__copy" key={`${activeHighlight}-${currentHighlight.title}`}>
            <p>{currentHighlight.eyebrow}</p>
            <h2>{currentHighlight.title}</h2>
            <span>{currentHighlight.description}</span>
          </div>

          <div className="attract-feature__progress" aria-hidden="true">
            {highlights.map((highlight, index) => (
              <span key={`${highlight.title}-${index}`} className={index === activeHighlight ? "is-active" : ""} />
            ))}
          </div>
        </aside>
      </main>

      <footer className="attract-footer">
        <div className="attract-clock">
          <strong>{timeLabel}</strong>
          <span>{dateLabel}</span>
        </div>
        <div className="attract-stay-times">
          <span>{t("attractCheckinLabel")} <strong>{hotel.checkinTime}</strong></span>
          <span>{t("attractCheckoutLabel")} <strong>{hotel.checkoutTime}</strong></span>
          <span>{t("attractReception")}</span>
        </div>
      </footer>
    </div>
  );
}
