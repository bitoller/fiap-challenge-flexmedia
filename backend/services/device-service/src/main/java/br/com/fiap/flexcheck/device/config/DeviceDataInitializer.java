package br.com.fiap.flexcheck.device.config;

import br.com.fiap.flexcheck.device.application.command.DeviceHeartbeatCommand;
import br.com.fiap.flexcheck.device.application.RegisterDeviceHeartbeatUseCase;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DeviceDataInitializer {

    @Bean
    CommandLineRunner seedDevices(RegisterDeviceHeartbeatUseCase registerDeviceHeartbeatUseCase) {
        return args -> registerDeviceHeartbeatUseCase.execute(new DeviceHeartbeatCommand(
                1L,
                "KIOSK-PAULISTA-01",
                "Totem Recepcao 01",
                "ONLINE",
                92,
                true,
                true
        ));
    }
}
