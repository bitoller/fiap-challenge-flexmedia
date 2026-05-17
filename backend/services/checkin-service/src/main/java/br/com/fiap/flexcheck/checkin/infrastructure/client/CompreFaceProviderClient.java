package br.com.fiap.flexcheck.checkin.infrastructure.client;

import br.com.fiap.flexcheck.checkin.service.identity.FaceMatchProviderClient;
import br.com.fiap.flexcheck.checkin.service.identity.FaceMatchProviderResult;
import br.com.fiap.flexcheck.checkin.service.identity.IdentityVerificationProperties;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;

@Service
public class CompreFaceProviderClient implements FaceMatchProviderClient {
    private final IdentityVerificationProperties properties;

    public CompreFaceProviderClient(IdentityVerificationProperties properties) {
        this.properties = properties;
    }

    @Override
    public FaceMatchProviderResult compare(String documentImageBase64, String selfieImageBase64, String mimeType) {
        if (properties.faceMatch().baseUrl() == null || properties.faceMatch().baseUrl().isBlank()) {
            return new FaceMatchProviderResult("UNAVAILABLE", "COMPREFACE", null, "FACE-NOT-CONFIGURED", "Face match provider is not configured.");
        }

        if (properties.demoAutoApprove()) {
            return new FaceMatchProviderResult("APPROVED", "COMPREFACE_SIMULATED", BigDecimal.valueOf(99), "FACE-" + System.currentTimeMillis(), null);
        }

        try {
            RestClient restClient = RestClient.builder()
                    .baseUrl(trimTrailingSlash(properties.faceMatch().baseUrl()))
                    .build();

            var form = new LinkedMultiValueMap<String, Object>();
            form.add("source_image", imageResource(documentImageBase64, "document.jpg"));
            form.add("target_image", imageResource(selfieImageBase64, "selfie.jpg"));

            Map<?, ?> response = restClient.post()
                    .uri("/api/v1/verification/verify")
                    .header("x-api-key", properties.faceMatch().apiKey())
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(form)
                    .retrieve()
                    .body(Map.class);

            Optional<BigDecimal> score = findScore(response);
            boolean approved = score
                    .map(value -> value.compareTo(properties.faceMatch().threshold()) >= 0)
                    .orElse(false);
            return new FaceMatchProviderResult(
                    approved ? "APPROVED" : "REJECTED",
                    "COMPREFACE",
                    score.orElse(null),
                    "FACE-" + System.currentTimeMillis(),
                    approved ? null : "Face match is below the configured threshold."
            );
        } catch (Exception ex) {
            return new FaceMatchProviderResult("UNAVAILABLE", "COMPREFACE", null, "FACE-ERROR", "Face match provider is unavailable.");
        }
    }

    private String trimTrailingSlash(String value) {
        return value == null ? "" : value.replaceAll("/+$", "");
    }

    private ByteArrayResource imageResource(String imageBase64, String filename) {
        String encoded = imageBase64 == null ? "" : imageBase64.replaceFirst("^data:[^,]+,", "");
        byte[] bytes = Base64.getDecoder().decode(encoded);
        return new ByteArrayResource(bytes) {
            @Override
            public String getFilename() {
                return filename;
            }
        };
    }

    private Optional<BigDecimal> findScore(Object value) {
        if (value instanceof Map<?, ?> map) {
            for (Object key : map.keySet()) {
                if (isScoreKey(String.valueOf(key))) {
                    Optional<BigDecimal> score = toScore(map.get(key));
                    if (score.isPresent()) {
                        return score;
                    }
                }
            }
            for (Object nested : map.values()) {
                Optional<BigDecimal> score = findScore(nested);
                if (score.isPresent()) {
                    return score;
                }
            }
        }
        if (value instanceof Iterable<?> iterable) {
            for (Object item : iterable) {
                Optional<BigDecimal> score = findScore(item);
                if (score.isPresent()) {
                    return score;
                }
            }
        }
        return Optional.empty();
    }

    private boolean isScoreKey(String key) {
        String normalized = key == null ? "" : key.toLowerCase();
        return normalized.contains("similarity");
    }

    private Optional<BigDecimal> toScore(Object value) {
        if (!(value instanceof Number number)) {
            return Optional.empty();
        }
        BigDecimal score = BigDecimal.valueOf(number.doubleValue());
        if (score.compareTo(BigDecimal.ONE) <= 0) {
            score = score.multiply(BigDecimal.valueOf(100));
        }
        return Optional.of(score);
    }
}
