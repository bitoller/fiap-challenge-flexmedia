import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/Button";
import { ApiError } from "../../../../domain/errors";
import { useCheckinFlow } from "../context/CheckinFlowContext";
import { CheckinFlowLayout } from "../components/CheckinFlowLayout";
import { FlowStepHeader } from "../components/FlowStepHeader";

export function ContactReviewPage() {
  const { t } = useTranslation("checkin");
  const navigate = useNavigate();
  const {
    reservation,
    guestContact,
    updateGuestContact,
    confirmGuestContact,
    isLoading,
    setRecovery,
  } = useCheckinFlow();

  useEffect(() => {
    if (!reservation) {
      navigate("/checkin", { replace: true });
    }
  }, [navigate, reservation]);

  if (!reservation || !guestContact) {
    return null;
  }

  const continueToTerms = async () => {
    try {
      await confirmGuestContact();
      navigate("/checkin/terms");
    } catch (error) {
      const apiError = error instanceof ApiError ? error : null;
      const code = apiError?.code === "BIOMETRY_REJECTED" ? "BIOMETRY_REJECTED" : "DOCUMENT_REJECTED";
      setRecovery(code, apiError?.message ?? t("contactErrorBody"));
      navigate("/checkin/recovery", {
        replace: true,
        state: { code, message: apiError?.message },
      });
    }
  };

  return (
    <CheckinFlowLayout
      topRightContent={<span className="checkin-topbar__confirmation-label">{t("contactTag")}</span>}
      bottomItems={[
        {
          key: "home",
          label: t("bottomHomeCompact"),
          icon: "home",
          onClick: () => navigate("/"),
        },
        {
          key: "assistant",
          label: t("bottomAssistant"),
          icon: "assistant",
          active: true,
        },
        {
          key: "emergency",
          label: t("bottomEmergency"),
          icon: "emergency",
        },
      ]}
    >
      <section className="checkin-contact" aria-label={t("contactTitle")}>
        <FlowStepHeader
          step={t("stepContact")}
          title={t("contactTitle")}
          subtitle={t("contactSubtitle")}
        />

        <div className="checkin-contact__layout">
          <article className="checkin-contact__summary">
            <h2>{t("contactSummaryTitle")}</h2>
            <p>{reservation.guest.fullName}</p>
            <dl>
              <div>
                <dt>{t("contactReservationLabel")}</dt>
                <dd>{reservation.code}</dd>
              </div>
              <div>
                <dt>{t("contactRoomLabel")}</dt>
                <dd>{reservation.room.type} {reservation.room.number}</dd>
              </div>
            </dl>
            <small>{t("contactSummaryHint")}</small>
          </article>

          <div className="checkin-contact__form">
            <label>
              <span>{t("contactFullNameLabel")}</span>
              <input
                type="text"
                value={guestContact.fullName}
                onChange={(event) => updateGuestContact({ fullName: event.target.value })}
              />
            </label>
            <label>
              <span>{t("contactDocumentTypeLabel")}</span>
              <input
                type="text"
                value={guestContact.documentType}
                onChange={(event) => updateGuestContact({ documentType: event.target.value })}
              />
            </label>
            <label>
              <span>{t("contactDocumentNumberLabel")}</span>
              <input
                type="text"
                value={guestContact.documentNumber}
                onChange={(event) => updateGuestContact({ documentNumber: event.target.value })}
              />
            </label>
            <div className="checkin-contact__split">
              <label>
                <span>{t("contactBirthDateLabel")}</span>
                <input
                  type="date"
                  value={guestContact.birthDate}
                  onChange={(event) => updateGuestContact({ birthDate: event.target.value })}
                />
              </label>
              <label>
                <span>{t("contactEmailLabel")}</span>
                <input
                  type="email"
                  value={guestContact.email}
                  onChange={(event) => updateGuestContact({ email: event.target.value })}
                />
              </label>
            </div>
            <label>
              <span>{t("contactPhoneLabel")}</span>
              <input
                type="tel"
                value={guestContact.phone}
                onChange={(event) => updateGuestContact({ phone: event.target.value })}
              />
            </label>
          </div>
        </div>

        <div className="checkin-contact__actions">
          <Button variant="secondary" size="lg" onClick={() => navigate("/checkin/confirmation")}>
            {t("back")}
          </Button>
          <Button variant="primary" size="lg" onClick={continueToTerms} isLoading={isLoading}>
            {t("continue")}
          </Button>
        </div>
      </section>
    </CheckinFlowLayout>
  );
}
