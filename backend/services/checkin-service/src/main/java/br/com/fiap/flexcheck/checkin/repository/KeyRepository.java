package br.com.fiap.flexcheck.checkin.repository;

import br.com.fiap.flexcheck.checkin.domain.entity.KeyCredential;

import java.time.LocalDate;

public interface KeyRepository {
    KeyCredential createKey(Long stayId, Long roomId, String keyType, LocalDate departureDate);
}

