package br.com.fiap.flexcheck.checkin.config;

import br.com.fiap.flexcheck.checkin.service.identity.IdentityVerificationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(IdentityVerificationProperties.class)
public class IdentityVerificationConfig {
}
