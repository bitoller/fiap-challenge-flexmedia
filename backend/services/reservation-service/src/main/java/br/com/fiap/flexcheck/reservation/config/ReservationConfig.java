package br.com.fiap.flexcheck.reservation.config;

import br.com.fiap.flexcheck.reservation.domain.service.ReservationEligibilityPolicy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ReservationConfig {

    @Bean
    public ReservationEligibilityPolicy reservationEligibilityPolicy() {
        return new ReservationEligibilityPolicy();
    }
}
