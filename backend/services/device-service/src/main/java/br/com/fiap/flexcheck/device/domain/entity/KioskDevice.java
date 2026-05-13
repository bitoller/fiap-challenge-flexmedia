package br.com.fiap.flexcheck.device.domain.entity;

import java.time.LocalDateTime;

public record KioskDevice(
        Long id,
        Long hotelId,
        String deviceCode,
        String name,
        String status,
        Integer batteryLevel,
        boolean cameraOnline,
        boolean printerOnline,
        LocalDateTime lastSeenAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
