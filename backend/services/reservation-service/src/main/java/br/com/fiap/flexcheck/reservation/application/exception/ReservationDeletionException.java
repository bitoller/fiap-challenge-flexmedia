package br.com.fiap.flexcheck.reservation.application.exception;

public class ReservationDeletionException extends RuntimeException {
    private final Reason reason;

    public ReservationDeletionException(Reason reason, String message) {
        super(message);
        this.reason = reason;
    }

    public Reason reason() {
        return reason;
    }

    public enum Reason {
        ACTIVE_STAY,
        RESERVATION_NOT_FOUND
    }
}
