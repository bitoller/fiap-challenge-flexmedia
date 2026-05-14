import { useTranslation } from "react-i18next";
import { KioskLayout } from "../../../components/layouts/KioskLayout";
import { ActionButtonsContainer } from "../components/ActionButtonsContainer";

export function HomePage() {
  const { t } = useTranslation("home");
  const welcomeTitle = t("welcomeTitle");
  const welcomeSubtitle = t("selectOption");

  return (
    <KioskLayout>
      <section className="home-screen" aria-label={t("welcomeTitle")}>
        <div className="home-hero">
          <h1 className="welcome-title">{welcomeTitle}</h1>
          <p className="welcome-subtitle">{welcomeSubtitle}</p>
          <div className="home-watermark" aria-hidden="true">
            <span className="home-watermark-ring" />
            <span className="home-watermark-ring home-watermark-ring--inner" />
          </div>
        </div>

        <ActionButtonsContainer />

        <div className="home-divider" aria-hidden="true">
          <span className="home-divider-line" />
          <svg className="home-divider-star" viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path
              d="M12 4.5l1.5 4.1 4.1 1.5-4.1 1.5L12 15.7l-1.5-4.1-4.1-1.5 4.1-1.5L12 4.5zm6.2 4.2l.8 2.1 2.1.8-2.1.8-.8 2.1-.8-2.1-2.1-.8 2.1-.8.8-2.1z"
              fill="currentColor"
            />
          </svg>
          <span className="home-divider-line" />
        </div>
      </section>
    </KioskLayout>
  );
}
