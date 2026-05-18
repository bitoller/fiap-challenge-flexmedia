import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HomePage } from "./presentation/features/home/pages/HomePage";
import { KioskLayout } from "./presentation/components/layouts/KioskLayout";
import { Button } from "./presentation/components/common/Button";
import { CheckinFlowProvider } from "./presentation/features/checkin-flow/context/CheckinFlowContext";
import { IdentificationPage } from "./presentation/features/checkin-flow/pages/IdentificationPage";
import { ReservationConfirmationPage } from "./presentation/features/checkin-flow/pages/ReservationConfirmationPage";
import { ReservationNotFoundPage } from "./presentation/features/checkin-flow/pages/ReservationNotFoundPage";
import { IdentityVerificationPage } from "./presentation/features/checkin-flow/pages/IdentityVerificationPage";
import { AddOnsPage } from "./presentation/features/checkin-flow/pages/AddOnsPage";
import { PaymentPage } from "./presentation/features/checkin-flow/pages/PaymentPage";
import { SuccessPage } from "./presentation/features/checkin-flow/pages/SuccessPage";
import { RecoveryPage } from "./presentation/features/checkin-flow/pages/RecoveryPage";
import { CheckoutFlowProvider } from "./presentation/features/checkout-flow/context/CheckoutFlowContext";
import { IdentificationPage as CheckoutIdentificationPage } from "./presentation/features/checkout-flow/pages/IdentificationPage";
import { SummaryPage as CheckoutSummaryPage } from "./presentation/features/checkout-flow/pages/SummaryPage";
import { ReconciliationPage as CheckoutReconciliationPage } from "./presentation/features/checkout-flow/pages/ReconciliationPage";
import { PaymentPage as CheckoutPaymentPage } from "./presentation/features/checkout-flow/pages/PaymentPage";
import { CardPage as CheckoutCardPage } from "./presentation/features/checkout-flow/pages/CardPage";
import { ReceiptPage as CheckoutReceiptPage } from "./presentation/features/checkout-flow/pages/ReceiptPage";
import { SuccessPage as CheckoutSuccessPage } from "./presentation/features/checkout-flow/pages/SuccessPage";
import { RecoveryPage as CheckoutRecoveryPage } from "./presentation/features/checkout-flow/pages/RecoveryPage";
import { PrivacyPolicyPage } from "./presentation/features/legal/pages/PrivacyPolicyPage";

type FlowName = "checkin" | "services";

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
    <CheckoutFlowProvider>
      <CheckinFlowProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/checkin" element={<IdentificationPage />} />
          <Route path="/checkin/not-found" element={<ReservationNotFoundPage />} />
          <Route path="/checkin/confirmation" element={<ReservationConfirmationPage />} />
          <Route path="/checkin/identity" element={<IdentityVerificationPage />} />
          <Route path="/checkin/add-ons" element={<AddOnsPage />} />
          <Route path="/checkin/payment" element={<PaymentPage />} />
          <Route path="/checkin/success" element={<SuccessPage />} />
          <Route path="/checkin/recovery" element={<RecoveryPage />} />
          <Route path="/checkout" element={<CheckoutIdentificationPage />} />
          <Route path="/checkout/summary" element={<CheckoutSummaryPage />} />
          <Route path="/checkout/reconciliation" element={<CheckoutReconciliationPage />} />
          <Route path="/checkout/payment" element={<CheckoutPaymentPage />} />
          <Route path="/checkout/card" element={<CheckoutCardPage />} />
          <Route path="/checkout/receipt" element={<CheckoutReceiptPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/checkout/recovery" element={<CheckoutRecoveryPage />} />
          <Route path="/services" element={<FlowPlaceholderPage flow="services" />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CheckinFlowProvider>
    </CheckoutFlowProvider>
  );
}
