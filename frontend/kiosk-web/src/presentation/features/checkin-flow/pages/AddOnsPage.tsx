import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, BedDouble, Check, Clock3, Coffee, Plus } from "lucide-react";
import { CheckinAddOnOffer } from "../../../../domain/models";
import { CheckinFlowLayout } from "../components/CheckinFlowLayout";
import { FlowStepHeader } from "../components/FlowStepHeader";
import { useCheckinFlow } from "../context/CheckinFlowContext";

const ADD_ON_ICONS = {
  BREAKFAST: Coffee,
  ROOM_UPGRADE: BedDouble,
  LATE_CHECKOUT: Clock3,
} as const;

function imageClassName(code: string) {
  return `checkin-addons__image checkin-addons__image--${code.toLowerCase().replace(/_/g, "-")}`;
}

export function AddOnsPage() {
  const { t, i18n } = useTranslation("checkin");
  const navigate = useNavigate();
  const { reservation, addOnQuote, isLoading, loadAddOns, applyAddOns, setFlowStep } = useCheckinFlow();
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  useEffect(() => {
    if (!reservation) {
      navigate("/checkin", { replace: true });
      return;
    }

    let active = true;
    loadAddOns()
      .then((quote) => {
        if (active) {
          setSelectedCodes(quote.selectedCodes);
        }
      })
      .catch(() => navigate("/checkin/recovery", { replace: true }));

    return () => {
      active = false;
    };
  }, [loadAddOns, navigate, reservation?.id]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(i18n.language, {
        style: "currency",
        currency: addOnQuote?.currency ?? reservation?.currency ?? "BRL",
      }),
    [addOnQuote?.currency, i18n.language, reservation?.currency]
  );

  const selectedOffers = useMemo(() => {
    const selected = new Set(selectedCodes);
    return addOnQuote?.offers.filter((offer) => selected.has(offer.code)) ?? [];
  }, [addOnQuote?.offers, selectedCodes]);

  const selectedTotal = selectedOffers.reduce((total, offer) => total + offer.totalAmount, 0);
  const baseAmount = addOnQuote?.baseAmount ?? reservation?.totalAmount ?? 0;
  const updatedTotal = baseAmount + selectedTotal;

  if (!reservation) {
    return null;
  }

  const toggleOffer = (offer: CheckinAddOnOffer) => {
    setSelectedCodes((current) =>
      current.includes(offer.code)
        ? current.filter((code) => code !== offer.code)
        : [...current, offer.code]
    );
  };

  const continueToPayment = async (codes: string[]) => {
    try {
      await applyAddOns(codes);
      setFlowStep("payment");
      navigate("/checkin/payment");
    } catch {
      navigate("/checkin/recovery", { replace: true });
    }
  };

  return (
    <CheckinFlowLayout>
      <section className="checkin-addons" aria-label={t("addOnsTitle")}>
        <FlowStepHeader
          step={t("stepAddOns")}
          title={t("addOnsTitle")}
          subtitle={t("addOnsSubtitle")}
        />

        <div className="checkin-addons__grid">
          {(addOnQuote?.offers ?? []).map((offer) => {
            const selected = selectedCodes.includes(offer.code);
            const Icon = ADD_ON_ICONS[offer.code as keyof typeof ADD_ON_ICONS] ?? Plus;

            return (
              <article key={offer.code} className={`checkin-addons__card ${selected ? "is-selected" : ""}`}>
                <div className={imageClassName(offer.code)} aria-hidden="true">
                  <Icon />
                </div>
                <div className="checkin-addons__body">
                  <p className="checkin-addons__eyebrow">{t(`addOns.items.${offer.code}.eyebrow`)}</p>
                  <h2>{t(`addOns.items.${offer.code}.title`)}</h2>
                  <p>{t(`addOns.items.${offer.code}.description`)}</p>
                  <div className="checkin-addons__footer">
                    <div>
                      <span>{t(`addOns.pricing.${offer.pricingType}`)}</span>
                      <strong>{currencyFormatter.format(offer.unitAmount)}</strong>
                      {offer.quantity > 1 && <small>{t("addOns.quantity", { count: offer.quantity })}</small>}
                    </div>
                    <button type="button" onClick={() => toggleOffer(offer)} aria-pressed={selected}>
                      {selected ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
                      {selected ? t("addOns.selected") : t("addOns.add")}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="checkin-addons__summary" aria-live="polite">
          <div>
            <span>{t("addOns.baseTotal")}</span>
            <strong>{currencyFormatter.format(baseAmount)}</strong>
          </div>
          <div>
            <span>{t("addOns.selectedTotal")}</span>
            <strong>{currencyFormatter.format(selectedTotal)}</strong>
          </div>
          <div>
            <span>{t("addOns.updatedTotal")}</span>
            <strong>{currencyFormatter.format(updatedTotal)}</strong>
          </div>
        </div>

        <div className="checkin-addons__actions">
          <button type="button" className="checkin-action-button checkin-action-button--ghost" onClick={() => navigate("/checkin/identity")}>
            {t("back")}
          </button>
          <div>
            <button type="button" className="checkin-action-button checkin-action-button--secondary" onClick={() => continueToPayment([])} disabled={isLoading}>
              {t("addOns.skip")}
            </button>
            <button type="button" className="checkin-action-button checkin-action-button--primary" onClick={() => continueToPayment(selectedCodes)} disabled={isLoading}>
              {t("addOns.continue")}
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </CheckinFlowLayout>
  );
}
