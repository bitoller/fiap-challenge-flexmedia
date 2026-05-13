package br.com.fiap.flexcheck.checkin.config;

import br.com.fiap.flexcheck.checkin.domain.service.ReservationEligibilityPolicy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DomainConfig {

    @Bean
    public ReservationEligibilityPolicy reservationEligibilityPolicy() {
        return new ReservationEligibilityPolicy();
    }
}

