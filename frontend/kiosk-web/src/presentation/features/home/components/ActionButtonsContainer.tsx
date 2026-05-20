import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ActionButton } from "./ActionButton";

const ACTIONS = [
  {
    icon: "checkin",
    titleKey: "checkin",
    subtitleKey: "checkinSubtitle",
    path: "/checkin",
  },
  {
    icon: "checkout",
    titleKey: "checkout",
    subtitleKey: "checkoutSubtitle",
    path: "/checkout",
  },
  {
    icon: "services",
    titleKey: "services",
    subtitleKey: "servicesSubtitle",
    path: "/services",
  },
] as const;

export function ActionButtonsContainer() {
  const { t } = useTranslation("home");
  const navigate = useNavigate();

  return (
    <div className="action-buttons-container">
      {ACTIONS.map((action) => (
        <ActionButton
          key={action.path}
          icon={action.icon}
          title={t(action.titleKey)}
          subtitle={t(action.subtitleKey)}
          onClick={() => navigate(action.path)}
        />
      ))}
    </div>
  );
}
