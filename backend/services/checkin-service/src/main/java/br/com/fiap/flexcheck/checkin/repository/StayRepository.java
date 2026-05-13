package br.com.fiap.flexcheck.checkin.repository;

import br.com.fiap.flexcheck.checkin.domain.entity.Stay;
import br.com.fiap.flexcheck.checkin.service.result.CheckoutPreviewResult;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

public interface StayRepository {
    Long createStay(Long reservationId, Long roomId, LocalDate departureDate, BigDecimal totalAmount);

    Optional<Stay> findStay(Long stayId);

    Optional<CheckoutPreviewResult> findCheckoutPreview(Long hotelId, String roomNumber, String documentType, String documentNumber);

    void markCheckedIn(Long sessionId, Long reservationId, Long roomId);

    void checkout(Stay stay);
}

