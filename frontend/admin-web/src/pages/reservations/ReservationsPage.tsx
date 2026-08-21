import type { Dispatch, SetStateAction } from "react";
import { formatCurrency } from "../../admin/dashboard";
import type { AdminCopy } from "../../admin/copy";
import type { ReservationFormState } from "../../admin/types";
import type { ReservationSummary } from "../../types";
import AdminDatePicker from "../../components/AdminDatePicker";

type ReservationsPageProps = {
  emptyState: string;
  copy: AdminCopy["reservationsPage"];
  locale: string;
  reservationForm: ReservationFormState;
  setReservationForm: Dispatch<SetStateAction<ReservationFormState>>;
  reservations: ReservationSummary[];
  onCreateReservation: () => void;
  onDeleteReservation: (reservationId: number) => void;
};

function ReservationsPage({
  emptyState,
  copy,
  locale,
  reservationForm,
  setReservationForm,
  reservations,
  onCreateReservation,
  onDeleteReservation,
}: ReservationsPageProps) {
  const reservationDetails = reservations.map((reservation) => [
    { label: copy.status, value: reservation.status },
    { label: copy.eligibility, value: reservation.eligible ? copy.readyForKiosk : copy.receptionRequired },
    { label: copy.reservationCode, value: reservation.code },
    { label: copy.reservationId, value: String(reservation.id) },
    { label: copy.guestName, value: reservation.guest.fullName },
    { label: copy.guestDocumentLabel, value: `${reservation.guest.documentType} ${reservation.guest.maskedDocument}` },
    { label: copy.hotel, value: reservation.hotelName },
    { label: copy.hotelId, value: String(reservation.hotelId) },
    { label: copy.room, value: `${reservation.room.number} (${reservation.room.type})` },
    { label: copy.roomStatus, value: reservation.room.status },
    { label: copy.arrivalDate, value: reservation.arrivalDate },
    { label: copy.departureDate, value: reservation.departureDate },
    { label: copy.guestBirthDate, value: reservation.guest.birthDate },
    { label: copy.guestEmail, value: reservation.guest.email },
    { label: copy.guestPhone, value: reservation.guest.phone },
    { label: copy.totalAmount, value: formatCurrency(reservation.totalAmount, reservation.currency, locale) },
    { label: copy.currency, value: reservation.currency },
    {
      label: copy.eligibilityReasons,
      value: reservation.eligibilityReasons.length ? reservation.eligibilityReasons.join(", ") : copy.noRestrictions,
    },
  ]);

  return (
    <section className="admin-panel">
      <div className="admin-card">
        <h2>{copy.title}</h2>
        <p className="admin-copy">{copy.help}</p>
        <div className="admin-form-grid">
          <label>
            <span>{copy.hotelName}</span>
            <input
              value={reservationForm.hotelName}
              onChange={(event) => setReservationForm((current) => ({ ...current, hotelName: event.target.value }))}
              placeholder={copy.reservationForm.hotelNamePlaceholder}
            />
          </label>
          <label>
            <span>{copy.roomNumber}</span>
            <input
              value={reservationForm.roomNumber}
              onChange={(event) => setReservationForm((current) => ({ ...current, roomNumber: event.target.value }))}
              placeholder={copy.reservationForm.roomNumberPlaceholder}
            />
          </label>
          <label>
            <span>{copy.roomType}</span>
            <input
              value={reservationForm.roomType}
              onChange={(event) => setReservationForm((current) => ({ ...current, roomType: event.target.value }))}
              placeholder={copy.reservationForm.roomTypePlaceholder}
            />
          </label>
          <label>
            <span>{copy.reservationCode}</span>
            <input
              value={reservationForm.reservationCode}
              onChange={(event) => setReservationForm((current) => ({ ...current, reservationCode: event.target.value }))}
              placeholder={copy.reservationForm.reservationCodePlaceholder}
            />
          </label>
          <label>
            <span>{copy.arrivalDate}</span>
            <AdminDatePicker
              ariaLabel={copy.arrivalDate}
              language={locale as "en" | "pt-BR" | "es"}
              value={reservationForm.arrivalDate}
              onChange={(value) => setReservationForm((current) => ({ ...current, arrivalDate: value }))}
            />
          </label>
          <label>
            <span>{copy.departureDate}</span>
            <AdminDatePicker
              ariaLabel={copy.departureDate}
              language={locale as "en" | "pt-BR" | "es"}
              value={reservationForm.departureDate}
              onChange={(value) => setReservationForm((current) => ({ ...current, departureDate: value }))}
            />
          </label>
          <label>
            <span>{copy.guestName}</span>
            <input
              value={reservationForm.guestFullName}
              onChange={(event) => setReservationForm((current) => ({ ...current, guestFullName: event.target.value }))}
              placeholder={copy.reservationForm.guestNamePlaceholder}
            />
          </label>
          <label>
            <span>{copy.guestDocument}</span>
            <input
              value={reservationForm.guestDocumentNumber}
              onChange={(event) => setReservationForm((current) => ({ ...current, guestDocumentNumber: event.target.value }))}
              placeholder={copy.reservationForm.guestDocumentPlaceholder}
            />
          </label>
          <label>
            <span>{copy.guestEmail}</span>
            <input
              value={reservationForm.guestEmail}
              onChange={(event) => setReservationForm((current) => ({ ...current, guestEmail: event.target.value }))}
              placeholder={copy.reservationForm.guestEmailPlaceholder}
            />
          </label>
          <label>
            <span>{copy.totalAmount}</span>
            <input
              value={String(reservationForm.totalAmount)}
              onChange={(event) => setReservationForm((current) => ({ ...current, totalAmount: Number(event.target.value) }))}
              placeholder={copy.reservationForm.totalAmountPlaceholder}
            />
          </label>
        </div>
        <button className="admin-primary-button" type="button" onClick={onCreateReservation}>
          {copy.createReservationLabel}
        </button>
      </div>
      <div className="admin-card">
        <h2>{copy.reservationsTitle}</h2>
        {reservations.length ? (
          <ul className="admin-reservation-list">
            {reservations.map((reservation, index) => (
              <li key={reservation.id} className="admin-reservation-card">
                <div className="admin-reservation-card__header">
                  <div>
                    <p className="admin-reservation-card__kicker">
                      {copy.reservationCardKickerPrefix} #{index + 1}
                    </p>
                    <strong>{reservation.code}</strong>
                    <span>{reservation.guest.fullName}</span>
                  </div>
                  <div
                    className={
                      reservation.eligible
                        ? "admin-reservation-card__badge admin-reservation-card__badge--good"
                        : "admin-reservation-card__badge admin-reservation-card__badge--warning"
                    }
                  >
                    {reservation.eligible ? copy.readyForKiosk : copy.receptionRequired}
                  </div>
                </div>

                <div className="admin-reservation-card__grid">
                  {reservationDetails[index].map((item) => (
                    <div key={`${reservation.id}-${item.label}`} className="admin-reservation-card__field">
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>

                {reservation.eligibilityReasons.length ? (
                  <div className="admin-reservation-card__reasons">
                    <span>{copy.eligibilityNotes}</span>
                    <p>{reservation.eligibilityReasons.join(", ")}</p>
                  </div>
                ) : null}

                <div className="admin-reservation-card__footer">
                  <small>
                    {copy.roomFooterPrefix} {reservation.room.number} - {formatCurrency(reservation.totalAmount, reservation.currency, locale)}
                  </small>
                  <button type="button" className="admin-secondary-button admin-danger-button" onClick={() => onDeleteReservation(reservation.id)}>
                    {copy.deleteReservationLabel}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="admin-empty">{emptyState}</p>
        )}
      </div>
    </section>
  );
}

export default ReservationsPage;
