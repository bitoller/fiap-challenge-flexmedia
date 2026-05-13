import React from "react";
import { useTranslation } from "react-i18next";
import { useHotelBranding } from "../../../core/hotelBranding";

export const Footer: React.FC = () => {
  const { t } = useTranslation("common");
  const { hotel } = useHotelBranding();

  return (
    <footer className="kiosk-footer">
      <div className="container-fluid">
        <div className="row align-items-center justify-content-between">
          <div className="col-auto">
            <p className="copyright-text">
              {t("copyright", { hotelName: hotel.name || t("hotelName") })}
            </p>
          </div>
          <div className="col-auto">
            <div className="footer-links">
              <a href="#privacy" className="footer-link">
                {t("privacyPolicy")}
              </a>
              <a href="#contact" className="footer-link footer-link--accent">
                {t("contact")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
