import type { Dispatch, SetStateAction } from "react";
import { formatCurrency } from "../../admin/dashboard";
import type { ReservationFormState } from "../../admin/types";
import type { ReservationSummary } from "../../types";

type ReservationsPageProps = {
  emptyState: string;
  testAreaLabel: string;
  testHelpLabel: string;
  createReservationLabel: string;
  deleteReservationLabel: string;
  reservationForm: ReservationFormState;
  setReservationForm: Dispatch<SetStateAction<ReservationFormState>>;
  reservations: ReservationSummary[];
  onCreateReservation: () => void;
  onDeleteReservation: (reservationId: number) => void;
};

function ReservationsPage({
  emptyState,
  testAreaLabel,
  testHelpLabel,
  createReservationLabel,
  deleteReservationLabel,
  reservationForm,
  setReservationForm,
  reservations,
  onCreateReservation,
  onDeleteReservation,
}: ReservationsPageProps) {
  const reservationDetails = reservations.map((reservation) => [
    { label: "Reservation ID", value: String(reservation.id) },
    { label: "Reservation code", value: reservation.code },
    { label: "Status", value: reservation.status },
    { label: "Eligibility", value: reservation.eligible ? "Eligible for kiosk check-in" : "Needs reception" },
    { label: "Hotel", value: reservation.hotelName },
    { label: "Hotel ID", value: String(reservation.hotelId) },
    { label: "Arrival date", value: reservation.arrivalDate },
    { label: "Departure date", value: reservation.departureDate },
    { label: "Room", value: `${reservation.room.number} (${reservation.room.type})` },
    { label: "Room status", value: reservation.room.status },
    { label: "Guest name", value: reservation.guest.fullName },
    { label: "Guest document", value: `${reservation.guest.documentType} ${reservation.guest.maskedDocument}` },
    { label: "Guest birth date", value: reservation.guest.birthDate },
    { label: "Guest email", value: reservation.guest.email },
    { label: "Guest phone", value: reservation.guest.phone },
    { label: "Total amount", value: formatCurrency(reservation.totalAmount, reservation.currency) },
    { label: "Currency", value: reservation.currency },
    {
      label: "Eligibility reasons",
      value: reservation.eligibilityReasons.length ? reservation.eligibilityReasons.join(", ") : "No restrictions",
    },
  ]);

  return (
    <section className="admin-panel">
      <div className="admin-card">
        <h2>{testAreaLabel}</h2>
        <p className="admin-copy">{testHelpLabel}</p>
        <div className="admin-form-grid">
          <label>
            <span>Hotel name</span>
            <input
              value={reservationForm.hotelName}
              onChange={(event) => setReservationForm((current) => ({ ...current, hotelName: event.target.value }))}
              placeholder="Flex Hotel Paulista"
            />
          </label>
          <label>
            <span>Room number</span>
            <input
              value={reservationForm.roomNumber}
              onChange={(event) => setReservationForm((current) => ({ ...current, roomNumber: event.target.value }))}
              placeholder="1208"
            />
          </label>
          <label>
            <span>Room type</span>
            <input
              value={reservationForm.roomType}
              onChange={(event) => setReservationForm((current) => ({ ...current, roomType: event.target.value }))}
              placeholder="DELUXE"
            />
          </label>
          <label>
            <span>Reservation code</span>
            <input
              value={reservationForm.reservationCode}
              onChange={(event) => setReservationForm((current) => ({ ...current, reservationCode: event.target.value }))}
              placeholder="Optional code"
            />
          </label>
          <label>
            <span>Arrival date</span>
            <input
              type="date"
              value={reservationForm.arrivalDate}
              onChange={(event) => setReservationForm((current) => ({ ...current, arrivalDate: event.target.value }))}
            />
          </label>
          <label>
            <span>Departure date</span>
            <input
              type="date"
              value={reservationForm.departureDate}
              onChange={(event) => setReservationForm((current) => ({ ...current, departureDate: event.target.value }))}
            />
          </label>
          <label>
            <span>Guest name</span>
            <input
              value={reservationForm.guestFullName}
              onChange={(event) => setReservationForm((current) => ({ ...current, guestFullName: event.target.value }))}
              placeholder="Full guest name"
            />
          </label>
          <label>
            <span>Guest document</span>
            <input
              value={reservationForm.guestDocumentNumber}
              onChange={(event) => setReservationForm((current) => ({ ...current, guestDocumentNumber: event.target.value }))}
              placeholder="Document number"
            />
          </label>
          <label>
            <span>Guest email</span>
            <input
              value={reservationForm.guestEmail}
              onChange={(event) => setReservationForm((current) => ({ ...current, guestEmail: event.target.value }))}
              placeholder="guest@example.com"
            />
          </label>
          <label>
            <span>Total amount</span>
            <input
              value={String(reservationForm.totalAmount)}
              onChange={(event) => setReservationForm((current) => ({ ...current, totalAmount: Number(event.target.value) }))}
              placeholder="980"
            />
          </label>
        </div>
        <button className="admin-primary-button" onClick={onCreateReservation}>
          {createReservationLabel}
        </button>
      </div>
      <div className="admin-card">
        <h2>Reservations</h2>
        {reservations.length ? (
          <ul className="admin-reservation-list">
            {reservations.map((reservation, index) => (
              <li key={reservation.id} className="admin-reservation-card">
                <div className="admin-reservation-card__header">
                  <div>
                    <p className="admin-reservation-card__kicker">Reservation #{index + 1}</p>
                    <strong>{reservation.code}</strong>
                    <span>{reservation.guest.fullName}</span>
                  </div>
                  <div className={reservation.eligible ? "admin-reservation-card__badge admin-reservation-card__badge--good" : "admin-reservation-card__badge admin-reservation-card__badge--warning"}>
                    {reservation.eligible ? "Ready for kiosk" : "Reception required"}
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
                    <span>Eligibility notes</span>
                    <p>{reservation.eligibilityReasons.join(", ")}</p>
                  </div>
                ) : null}

                <div className="admin-reservation-card__footer">
                  <small>
                    Room {reservation.room.number} - {formatCurrency(reservation.totalAmount, reservation.currency)}
                  </small>
                  <button type="button" className="admin-secondary-button admin-danger-button" onClick={() => onDeleteReservation(reservation.id)}>
                    {deleteReservationLabel}
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
