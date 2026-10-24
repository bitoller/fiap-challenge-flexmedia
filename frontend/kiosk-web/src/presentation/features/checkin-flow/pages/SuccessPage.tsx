import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BadgeCheck, CreditCard, DoorOpen, ScanFace } from "lucide-react";
import { Button } from "../../../components/common/Button";
import { formatCurrency } from "../../../../shared/formatters/currency";
import { useCheckinFlow } from "../context/CheckinFlowContext";
import { CheckinFlowLayout } from "../components/CheckinFlowLayout";
import { FlowStepHeader } from "../components/FlowStepHeader";

export function SuccessPage() {
  const { t, i18n } = useTranslation("checkin");
  const navigate = useNavigate();
  const { reservation, checkinResult, clearFlow } = useCheckinFlow();

  useEffect(() => {
    if (!reservation || !checkinResult) {
      navigate("/", { replace: true });
    }
  }, [checkinResult, navigate, reservation]);

  if (!reservation || !checkinResult) {
    return null;
  }

  const totalPaid = formatCurrency(checkinResult.totalPaid, reservation.currency, i18n.language);

  const concludeFlow = () => {
    clearFlow();
    navigate("/", { replace: true });
  };

  return (
    <CheckinFlowLayout>
      <section className="checkin-success" aria-label={t("successTitle")}>
        <FlowStepHeader
          step={t("stepSuccess")}
          title={t("successTitle")}
          subtitle={t("successSubtitle")}
        />

        <div className="checkin-success__layout">
          <article className="checkin-success__hero">
            <div className="checkin-success__access-visual" aria-hidden="true">
              <div className="checkin-success__face">
                <ScanFace />
              </div>
              <div className="checkin-success__scanner">
                <span />
              </div>
              <div className="checkin-success__card-pass">
                <CreditCard />
              </div>
            </div>

            <div>
              <span>{t("successAccessEyebrow")}</span>
              <h2>{t("successAccessTitle")}</h2>
              <p>{t("successAccessBody")}</p>
            </div>
          </article>

          <aside className="checkin-success__details">
            <article>
              <DoorOpen aria-hidden="true" />
              <div>
                <span>{t("successRoomLabel")}</span>
                <strong>{checkinResult.roomNumber}</strong>
                <small>{t("successRoomHint")}</small>
              </div>
            </article>
            <article>
              <BadgeCheck aria-hidden="true" />
              <div>
                <span>{t("successFaceLabel")}</span>
                <strong>{t("successFaceValue")}</strong>
                <small>{t("successFaceHint")}</small>
              </div>
            </article>
            <article>
              <CreditCard aria-hidden="true" />
              <div>
                <span>{t("successCardLabel")}</span>
                <strong>{t("successCardValue")}</strong>
                <small>{t("successCardHint")}</small>
              </div>
            </article>
            <article>
              <BadgeCheck aria-hidden="true" />
              <div>
                <span>{t("successPaidLabel")}</span>
                <strong>{totalPaid}</strong>
                <small>{t("successPaidHint")}</small>
              </div>
            </article>
          </aside>
        </div>

        <p className="checkin-success__copy">{t("successCopy")}</p>

        <div className="checkin-success__actions">
          <Button variant="primary" size="lg" onClick={concludeFlow}>
            {t("finishAndReturn")}
          </Button>
        </div>
      </section>
    </CheckinFlowLayout>
  );
}
