package br.com.fiap.flexcheck.device.application.command;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record DeviceHeartbeatCommand(
        @NotNull @Positive Long hotelId,
        @NotBlank String deviceCode,
        @NotBlank String name,
        @NotBlank String status,
        @Min(0) @Max(100) Integer batteryLevel,
        Boolean cameraOnline,
        Boolean printerOnline
) {
}
