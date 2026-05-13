import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HomePage } from "./presentation/features/home/pages/HomePage";
import { KioskLayout } from "./presentation/components/layouts/KioskLayout";
import { Button } from "./presentation/components/common/Button";
import { CheckinFlowProvider } from "./presentation/features/checkin-flow/context/CheckinFlowContext";
import { IdentificationPage } from "./presentation/features/checkin-flow/pages/IdentificationPage";
import { ReservationConfirmationPage } from "./presentation/features/checkin-flow/pages/ReservationConfirmationPage";
import { ReservationNotFoundPage } from "./presentation/features/checkin-flow/pages/ReservationNotFoundPage";
import { ContactReviewPage } from "./presentation/features/checkin-flow/pages/ContactReviewPage";
import { TermsPage } from "./presentation/features/checkin-flow/pages/TermsPage";
import { PaymentPage } from "./presentation/features/checkin-flow/pages/PaymentPage";
import { SuccessPage } from "./presentation/features/checkin-flow/pages/SuccessPage";
import { RecoveryPage } from "./presentation/features/checkin-flow/pages/RecoveryPage";

type FlowName = "checkin" | "checkout" | "services";

const FLOW_COPY: Record<
  FlowName,
  {
    titleKey: string;
    bodyKey: string;
  }
> = {
  checkin: {
    titleKey: "checkinComingSoonTitle",
    bodyKey: "checkinComingSoonBody",
  },
  checkout: {
    titleKey: "checkoutComingSoonTitle",
    bodyKey: "checkoutComingSoonBody",
  },
  services: {
    titleKey: "servicesComingSoonTitle",
    bodyKey: "servicesComingSoonBody",
  },
};

function FlowPlaceholderPage({ flow }: { flow: FlowName }) {
  const { t } = useTranslation("home");
  const navigate = useNavigate();
  const copy = FLOW_COPY[flow];

  return (
    <KioskLayout>
      <section className="home-screen home-placeholder" aria-label={t(copy.titleKey)}>
        <div className="home-placeholder-panel">
          <p className="eyebrow">{t(`${flow}Subtitle`)}</p>
          <h1 className="home-placeholder-title">{t(copy.titleKey)}</h1>
          <p className="home-placeholder-copy">{t(copy.bodyKey)}</p>
          <div className="home-placeholder-actions">
            <Button variant="secondary" size="lg" onClick={() => navigate("/")}>
              {t("backToHome")}
            </Button>
          </div>
        </div>
      </section>
    </KioskLayout>
  );
}

export default function App() {
  return (
    <CheckinFlowProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/checkin" element={<IdentificationPage />} />
        <Route path="/checkin/not-found" element={<ReservationNotFoundPage />} />
        <Route path="/checkin/confirmation" element={<ReservationConfirmationPage />} />
        <Route path="/checkin/contact" element={<ContactReviewPage />} />
        <Route path="/checkin/terms" element={<TermsPage />} />
        <Route path="/checkin/payment" element={<PaymentPage />} />
        <Route path="/checkin/success" element={<SuccessPage />} />
        <Route path="/checkin/recovery" element={<RecoveryPage />} />
        <Route path="/checkout" element={<FlowPlaceholderPage flow="checkout" />} />
        <Route path="/services" element={<FlowPlaceholderPage flow="services" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CheckinFlowProvider>
  );
}
