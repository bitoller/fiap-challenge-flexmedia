package br.com.fiap.flexcheck.device.service.result;

import java.time.LocalDateTime;

public record KioskDeviceResult(
        Long id,
        Long hotelId,
        String deviceCode,
        String name,
        String status,
        Integer batteryLevel,
        boolean cameraOnline,
        boolean printerOnline,
        LocalDateTime lastSeenAt
) {
}
