package br.com.fiap.flexcheck.checkin.infrastructure.repository;

import br.com.fiap.flexcheck.checkin.service.support.CheckoutChargeCalculator;
import br.com.fiap.flexcheck.checkin.security.SensitiveDataCodec;
import br.com.fiap.flexcheck.checkin.service.result.CheckoutPreviewResult;
import br.com.fiap.flexcheck.checkin.service.result.GuestResult;
import br.com.fiap.flexcheck.checkin.service.result.ReservationResult;
import br.com.fiap.flexcheck.checkin.service.result.RoomResult;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;

@Component
public class CheckoutPreviewRowMapper implements RowMapper<CheckoutPreviewResult> {
    private final SensitiveDataCodec sensitiveDataCodec;

    public CheckoutPreviewRowMapper(SensitiveDataCodec sensitiveDataCodec) {
        this.sensitiveDataCodec = sensitiveDataCodec;
    }

    @Override
    public CheckoutPreviewResult mapRow(ResultSet rs, int rowNum) throws SQLException {
        LocalDate arrivalDate = rs.getObject("arrival_date", LocalDate.class);
        LocalDate departureDate = rs.getObject("departure_date", LocalDate.class);
        Timestamp expectedCheckoutAt = rs.getTimestamp("expected_checkout_at");
        BigDecimal reservationTotal = rs.getBigDecimal("total_amount");
        BigDecimal checkoutDue = CheckoutChargeCalculator.calculateDue(expectedCheckoutAt);

        ReservationResult reservation = new ReservationResult(
                rs.getLong("reservation_id"),
                rs.getLong("hotel_id"),
                rs.getString("reservation_code"),
                rs.getString("reservation_status"),
                rs.getString("hotel_name"),
                arrivalDate,
                departureDate,
                reservationTotal,
                rs.getString("currency"),
                true,
                List.of(),
                new GuestResult(
                        rs.getLong("guest_id"),
                        rs.getString("full_name"),
                        rs.getString("document_type"),
                        maskDocument(sensitiveDataCodec.decrypt(rs.getString("document_number"))),
                        rs.getObject("birth_date", LocalDate.class),
                        sensitiveDataCodec.decrypt(rs.getString("email")),
                        sensitiveDataCodec.decrypt(rs.getString("phone"))
                ),
                new RoomResult(
                        rs.getLong("room_id"),
                        rs.getString("room_number"),
                        rs.getString("room_type"),
                        rs.getString("room_status")
                )
        );

        return new CheckoutPreviewResult(
                rs.getLong("stay_id"),
                rs.getString("stay_status"),
                checkoutDue,
                reservation,
                CheckoutChargeCalculator.buildCharges(expectedCheckoutAt)
        );
    }

    private static String maskDocument(String documentNumber) {
        if (documentNumber == null || documentNumber.length() < 4) {
            return documentNumber;
        }

        return "****" + documentNumber.substring(documentNumber.length() - 4);
    }
}
