package br.com.fiap.flexcheck.checkin.infrastructure.repository;

import br.com.fiap.flexcheck.checkin.repository.CheckinAddOnRepository;
import br.com.fiap.flexcheck.checkin.service.result.CheckinAddOnOfferResult;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Repository
public class JdbcCheckinAddOnRepository implements CheckinAddOnRepository {
    private final JdbcTemplate jdbc;

    public JdbcCheckinAddOnRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public Set<String> findSelectedCodes(Long reservationId, Long sessionId) {
        return new HashSet<>(jdbc.queryForList("""
                SELECT code
                  FROM fc_reservation_addon
                 WHERE reservation_id = ?
                   AND session_id = ?
                   AND status = 'SELECTED'
                """, String.class, reservationId, sessionId));
    }

    @Override
    public BigDecimal findSelectedTotal(Long reservationId, Long sessionId) {
        BigDecimal total = jdbc.queryForObject("""
                SELECT COALESCE(SUM(total_amount), 0)
                  FROM fc_reservation_addon
                 WHERE reservation_id = ?
                   AND session_id = ?
                   AND status = 'SELECTED'
                """, BigDecimal.class, reservationId, sessionId);
        return total == null ? BigDecimal.ZERO : total;
    }

    @Override
    public BigDecimal findBaseAmount(Long reservationId, Long sessionId, BigDecimal currentTotalAmount) {
        BigDecimal storedBaseAmount = jdbc.queryForObject("""
                SELECT MIN(base_amount)
                  FROM fc_reservation_addon
                 WHERE reservation_id = ?
                   AND base_amount IS NOT NULL
                """, BigDecimal.class, reservationId);
        if (currentTotalAmount == null) {
            return storedBaseAmount == null ? BigDecimal.ZERO : storedBaseAmount;
        }

        if (storedBaseAmount != null) {
            return storedBaseAmount.min(currentTotalAmount);
        }

        return currentTotalAmount;
    }

    @Override
    public void replaceSelection(Long reservationId, Long sessionId, BigDecimal baseAmount, List<CheckinAddOnOfferResult> selectedOffers) {
        jdbc.update("""
                UPDATE fc_reservation_addon
                   SET status = 'REMOVED'
                 WHERE reservation_id = ?
                   AND session_id = ?
                   AND status = 'SELECTED'
                """, reservationId, sessionId);

        Timestamp now = Timestamp.valueOf(LocalDateTime.now());
        for (CheckinAddOnOfferResult offer : selectedOffers) {
            jdbc.update("""
                    INSERT INTO fc_reservation_addon (
                        reservation_id,
                        session_id,
                        code,
                        pricing_type,
                        quantity,
                        unit_amount,
                        total_amount,
                        base_amount,
                        currency,
                        status,
                        created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'SELECTED', ?)
                    """,
                    reservationId,
                    sessionId,
                    offer.code(),
                    offer.pricingType(),
                    offer.quantity(),
                    offer.unitAmount(),
                    offer.totalAmount(),
                    baseAmount,
                    offer.currency(),
                    now
            );
        }

    }

    @Override
    public void commitReservationTotal(Long reservationId, BigDecimal totalAmount) {
        jdbc.update("""
                UPDATE fc_reservation
                   SET total_amount = ?
                 WHERE id = ?
                """, totalAmount, reservationId);
    }
}
