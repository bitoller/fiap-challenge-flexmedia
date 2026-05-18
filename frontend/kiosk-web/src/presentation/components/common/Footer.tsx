import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { KIOSK_CONFIG } from "../../../core/constants";
import { useHotelBranding } from "../../../core/hotelBranding";
import { supportRepository } from "../../../data/repositories/supportRepository";

export const Footer: React.FC = () => {
  const { t } = useTranslation("common");
  const { hotel } = useHotelBranding();
  const location = useLocation();
  const [supportState, setSupportState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const returnTo = useMemo(
    () => `${location.pathname}${location.search}${location.hash}`,
    [location.hash, location.pathname, location.search]
  );

  const requestSupport = async () => {
    if (supportState === "sending") {
      return;
    }

    setSupportState("sending");

    try {
      await supportRepository.requestConciergeHelp({
        hotelId: hotel.id || KIOSK_CONFIG.ACTIVE_HOTEL_ID,
        route: returnTo,
      });
      setSupportState("sent");
    } catch {
      setSupportState("error");
    }
  };

  return (
    <footer className="kiosk-footer">
      {supportState !== "idle" ? (
        <div className="footer-support-toast" role="status" aria-live="polite">
          <strong>
            {supportState === "error" ? t("conciergeHelpErrorTitle") : t("conciergeHelpTitle")}
          </strong>
          <span>
            {supportState === "sending"
              ? t("conciergeHelpSending")
              : supportState === "error"
                ? t("conciergeHelpErrorBody")
                : t("conciergeHelpBody")}
          </span>
          <button type="button" onClick={() => setSupportState("idle")}>
            {t("close")}
          </button>
        </div>
      ) : null}
      <div className="container-fluid">
        <div className="row align-items-center justify-content-between">
          <div className="col-auto">
            <p className="copyright-text">
              {t("copyright", { hotelName: hotel.name || t("hotelName") })}
            </p>
          </div>
          <div className="col-auto">
            <div className="footer-links">
              <Link to="/privacy-policy" state={{ returnTo }} className="footer-link">
                {t("privacyPolicy")}
              </Link>
              <button
                type="button"
                className="footer-link footer-link--accent footer-link--button"
                onClick={requestSupport}
                disabled={supportState === "sending"}
              >
                {t("contact")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
