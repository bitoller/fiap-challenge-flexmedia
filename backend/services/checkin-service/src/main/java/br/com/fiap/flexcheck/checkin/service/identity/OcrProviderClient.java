package br.com.fiap.flexcheck.checkin.service.identity;

public interface OcrProviderClient {
    OcrProviderResult extract(String imageBase64, String mimeType);
}
