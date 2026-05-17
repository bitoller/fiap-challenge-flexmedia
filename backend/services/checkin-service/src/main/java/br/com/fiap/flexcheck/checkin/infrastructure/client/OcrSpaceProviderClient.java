package br.com.fiap.flexcheck.checkin.infrastructure.client;

import br.com.fiap.flexcheck.checkin.service.identity.IdentityVerificationProperties;
import br.com.fiap.flexcheck.checkin.service.identity.OcrProviderClient;
import br.com.fiap.flexcheck.checkin.service.identity.OcrProviderResult;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class OcrSpaceProviderClient implements OcrProviderClient {
    private final IdentityVerificationProperties properties;
    private final RestClient restClient;

    public OcrSpaceProviderClient(IdentityVerificationProperties properties) {
        this.properties = properties;
        this.restClient = RestClient.builder()
                .baseUrl("https://api.ocr.space")
                .build();
    }

    @Override
    public OcrProviderResult extract(String imageBase64, String mimeType) {
        if (properties.ocr().apiKey() == null || properties.ocr().apiKey().isBlank()) {
            return new OcrProviderResult("UNAVAILABLE", "OCR_SPACE", null, null, "OCR-NOT-CONFIGURED", "OCR provider is not configured.");
        }

        try {
            var form = new LinkedMultiValueMap<String, String>();
            form.add("apikey", properties.ocr().apiKey());
            form.add("language", "por");
            form.add("isOverlayRequired", "false");
            form.add("scale", "true");
            form.add("detectOrientation", "true");
            form.add("OCREngine", "2");
            form.add("base64Image", "data:" + safeMimeType(mimeType) + ";base64," + imageBase64);

            Map<?, ?> response = restClient.post()
                    .uri("/parse/image")
                    .body(form)
                    .retrieve()
                    .body(Map.class);

            String text = extractText(response);
            DocumentOcrParser.ParsedDocument document = DocumentOcrParser.parse(text);
            return new OcrProviderResult("APPROVED", "OCR_SPACE", document.fullName(), document.documentNumber(), "OCR-" + System.currentTimeMillis(), null);
        } catch (Exception ex) {
            return new OcrProviderResult("UNAVAILABLE", "OCR_SPACE", null, null, "OCR-ERROR", "OCR provider is unavailable.");
        }
    }

    private String safeMimeType(String mimeType) {
        return mimeType == null || mimeType.isBlank() ? "image/jpeg" : mimeType;
    }

    private String extractText(Map<?, ?> response) {
        Object parsedResults = response == null ? null : response.get("ParsedResults");
        if (!(parsedResults instanceof Iterable<?> iterable)) {
            return "";
        }
        for (Object item : iterable) {
            if (item instanceof Map<?, ?> map && map.get("ParsedText") != null) {
                return String.valueOf(map.get("ParsedText"));
            }
        }
        return "";
    }
}
