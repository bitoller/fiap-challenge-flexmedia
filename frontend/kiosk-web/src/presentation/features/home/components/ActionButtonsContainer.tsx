import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ActionButton } from "./ActionButton";

export function ActionButtonsContainer() {
  const { t } = useTranslation("home");
  const navigate = useNavigate();

  return (
    <div className="action-buttons-container">
      <ActionButton
        icon="checkin"
        title={t("checkin")}
        subtitle={t("checkinSubtitle")}
        onClick={() => navigate("/checkin")}
      />
      <ActionButton
        icon="checkout"
        title={t("checkout")}
        subtitle={t("checkoutSubtitle")}
        onClick={() => navigate("/checkout")}
      />
      <ActionButton
        icon="services"
        title={t("services")}
        subtitle={t("servicesSubtitle")}
        onClick={() => navigate("/services")}
      />
    </div>
  );
}
