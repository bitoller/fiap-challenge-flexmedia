import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { KioskLayout } from "../../../components/layouts/KioskLayout";
import { Button } from "../../../components/common/Button";

type LegalSection = {
  title: string;
  body: string[];
};

type PolicyLocationState = {
  returnTo?: string;
};

export function PrivacyPolicyPage() {
  const { t } = useTranslation("legal");
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as PolicyLocationState | null)?.returnTo;

  const sections = useMemo(
    () => t("sections", { returnObjects: true }) as LegalSection[],
    [t]
  );

  const handleBack = () => {
    if (returnTo) {
      navigate(returnTo);
      return;
    }

    navigate("/");
  };

  return (
    <KioskLayout>
      <section className="legal-policy" aria-labelledby="legal-policy-title">
        <div className="legal-policy__heading">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1 id="legal-policy-title">{t("title")}</h1>
          <p>{t("subtitle")}</p>
        </div>

        <article className="legal-policy__card">
          {sections.map((section) => (
            <section className="legal-policy__section" key={section.title}>
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </article>

        <div className="legal-policy__actions">
          <Button variant="secondary" size="lg" onClick={handleBack}>
            {t("back")}
          </Button>
        </div>
      </section>
    </KioskLayout>
  );
}
