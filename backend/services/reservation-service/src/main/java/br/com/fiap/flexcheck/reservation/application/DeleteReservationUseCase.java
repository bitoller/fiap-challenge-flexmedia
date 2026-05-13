package br.com.fiap.flexcheck.reservation.application;

public interface DeleteReservationUseCase {
    void execute(Long hotelId, Long reservationId);
}
