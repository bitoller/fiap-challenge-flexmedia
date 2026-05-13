package br.com.fiap.flexcheck.checkin.infrastructure.repository;

import br.com.fiap.flexcheck.checkin.service.result.CheckoutChargeResult;
import br.com.fiap.flexcheck.checkin.service.result.CheckoutPreviewResult;
import br.com.fiap.flexcheck.checkin.service.result.GuestResult;
import br.com.fiap.flexcheck.checkin.service.result.ReservationResult;
import br.com.fiap.flexcheck.checkin.service.result.RoomResult;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class CheckoutPreviewRowMapper implements RowMapper<CheckoutPreviewResult> {
    @Override
    public CheckoutPreviewResult mapRow(ResultSet rs, int rowNum) throws SQLException {
        LocalDate arrivalDate = rs.getObject("arrival_date", LocalDate.class);
        LocalDate departureDate = rs.getObject("departure_date", LocalDate.class);
        int nights = (int) Math.max(1, ChronoUnit.DAYS.between(arrivalDate, departureDate));
        BigDecimal totalAmount = rs.getBigDecimal("total_amount");

        ReservationResult reservation = new ReservationResult(
                rs.getLong("reservation_id"),
                rs.getLong("hotel_id"),
                rs.getString("reservation_code"),
                rs.getString("reservation_status"),
                rs.getString("hotel_name"),
                arrivalDate,
                departureDate,
                totalAmount,
                rs.getString("currency"),
                true,
                List.of(),
                new GuestResult(
                        rs.getLong("guest_id"),
                        rs.getString("full_name"),
                        rs.getString("document_type"),
                        maskDocument(rs.getString("document_number")),
                        rs.getObject("birth_date", LocalDate.class),
                        rs.getString("email"),
                        rs.getString("phone")
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
                totalAmount,
                reservation,
                buildCharges(totalAmount, nights, rs.getString("room_type"))
        );
    }

    private static List<CheckoutChargeResult> buildCharges(BigDecimal totalAmount, int nights, String roomType) {
        BigDecimal accommodation = totalAmount.multiply(new BigDecimal("0.7347")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal minibar = totalAmount.multiply(new BigDecimal("0.0612")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal restaurant = totalAmount.subtract(accommodation).subtract(minibar).setScale(2, RoundingMode.HALF_UP);

        return List.of(
                new CheckoutChargeResult(
                        "ACCOMMODATION",
                        nights + " nights - " + roomType,
                        accommodation
                ),
                new CheckoutChargeResult(
                        "MINIBAR",
                        "Mini bar usage",
                        minibar
                ),
                new CheckoutChargeResult(
                        "RESTAURANT",
                        "Dining and room service",
                        restaurant
                )
        );
    }

    private static String maskDocument(String documentNumber) {
        if (documentNumber == null || documentNumber.length() < 4) {
            return documentNumber;
        }

        return "****" + documentNumber.substring(documentNumber.length() - 4);
    }
}
