package br.com.fiap.flexcheck.checkin.service.identity;

public interface FaceMatchProviderClient {
    FaceMatchProviderResult compare(String documentImageBase64, String selfieImageBase64, String mimeType);
}
