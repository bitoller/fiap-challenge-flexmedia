package br.com.fiap.flexcheck.checkin.infrastructure.repository;

import br.com.fiap.flexcheck.checkin.repository.PaymentRepository;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Repository
public class JdbcPaymentRepository implements PaymentRepository {
    private final SimpleJdbcInsert paymentInsert;

    public JdbcPaymentRepository(DataSource dataSource) {
        this.paymentInsert = new SimpleJdbcInsert(dataSource)
                .withTableName("fc_payment_transaction")
                .usingGeneratedKeyColumns("id");
    }

    @Override
    public Long insertPayment(Long stayId, Long reservationId, String type, String status, BigDecimal amount, String authorizationCode) {
        Map<String, Object> values = new HashMap<>();
        values.put("stay_id", stayId);
        values.put("reservation_id", reservationId);
        values.put("transaction_type", type);
        values.put("status", status);
        values.put("amount", amount);
        values.put("currency", "BRL");
        values.put("provider", "MOCK");
        values.put("authorization_code", authorizationCode);
        values.put("idempotency_key", UUID.randomUUID().toString());
        values.put("created_at", Timestamp.valueOf(LocalDateTime.now()));
        return paymentInsert.executeAndReturnKey(values).longValue();
    }
}
