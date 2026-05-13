package br.com.fiap.flexcheck.device.infrastructure.repository;

import br.com.fiap.flexcheck.device.application.command.DeviceHeartbeatCommand;
import br.com.fiap.flexcheck.device.domain.entity.KioskDevice;
import br.com.fiap.flexcheck.device.service.result.KioskDeviceResult;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class InMemoryDeviceRepository {
    private final AtomicLong sequence = new AtomicLong(1L);
    private final ConcurrentMap<String, KioskDevice> devices = new ConcurrentHashMap<>();

    public KioskDeviceResult recordHeartbeat(DeviceHeartbeatCommand command) {
        LocalDateTime now = LocalDateTime.now();
        KioskDevice device = devices.compute(command.deviceCode(), (code, existing) -> {
            if (existing == null) {
                return new KioskDevice(
                        sequence.getAndIncrement(),
                        command.hotelId(),
                        code,
                        command.name(),
                        normalizeStatus(command.status()),
                        command.batteryLevel(),
                        command.cameraOnline() == null || command.cameraOnline(),
                        command.printerOnline() == null || command.printerOnline(),
                        now,
                        now,
                        now
                );
            }

            return new KioskDevice(
                    existing.id(),
                    command.hotelId(),
                    code,
                    command.name(),
                    normalizeStatus(command.status()),
                    command.batteryLevel(),
                    command.cameraOnline() == null || command.cameraOnline(),
                    command.printerOnline() == null || command.printerOnline(),
                    now,
                    existing.createdAt(),
                    now
            );
        });
        return toResult(device);
    }

    public List<KioskDeviceResult> listDevices() {
        return devices.values().stream()
                .sorted(Comparator.comparing(KioskDevice::deviceCode))
                .map(this::toResult)
                .toList();
    }

    public Optional<KioskDeviceResult> findByCode(String deviceCode) {
        return Optional.ofNullable(devices.get(deviceCode)).map(this::toResult);
    }

    private KioskDeviceResult toResult(KioskDevice device) {
        return new KioskDeviceResult(
                device.id(),
                device.hotelId(),
                device.deviceCode(),
                device.name(),
                device.status(),
                device.batteryLevel(),
                device.cameraOnline(),
                device.printerOnline(),
                device.lastSeenAt()
        );
    }

    private String normalizeStatus(String status) {
        String value = status == null ? "OFFLINE" : status.trim().toUpperCase();
        return switch (value) {
            case "ONLINE", "OFFLINE", "MAINTENANCE", "ERROR" -> value;
            default -> "OFFLINE";
        };
    }
}
