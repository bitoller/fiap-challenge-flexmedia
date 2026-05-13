package br.com.fiap.flexcheck.checkin.infrastructure.client;

import br.com.fiap.flexcheck.checkin.service.result.KeyResult;

import java.time.LocalDate;

public interface KeyServiceClient {
    KeyResult issueKey(Long stayId, Long roomId, String keyType, LocalDate departureDate);

    void revokeKeys(Long stayId);
}
