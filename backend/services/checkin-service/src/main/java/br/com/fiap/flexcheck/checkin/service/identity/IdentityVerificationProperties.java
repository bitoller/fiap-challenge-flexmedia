package br.com.fiap.flexcheck.checkin.service.identity;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.math.BigDecimal;

@ConfigurationProperties(prefix = "identity.verification")
public record IdentityVerificationProperties(
        boolean demoAutoApprove,
        boolean documentOnlyFallbackEnabled,
        Ocr ocr,
        FaceMatch faceMatch
) {
    public IdentityVerificationProperties {
        ocr = ocr == null ? new Ocr("", 10) : ocr;
        faceMatch = faceMatch == null ? new FaceMatch("", "", BigDecimal.valueOf(85), 10) : faceMatch;
    }

    public record Ocr(String apiKey, int timeoutSeconds) {
    }

    public record FaceMatch(String baseUrl, String apiKey, BigDecimal threshold, int timeoutSeconds) {
    }
}
