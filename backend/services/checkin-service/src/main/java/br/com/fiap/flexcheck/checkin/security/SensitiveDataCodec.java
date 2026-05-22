package br.com.fiap.flexcheck.checkin.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;

@Component
public class SensitiveDataCodec {
    private static final String PREFIX = "v1:";
    private static final String DEFAULT_SECRET = "flexcheck-local-development-secret-change-me";
    private static final int IV_LENGTH = 12;
    private static final int TAG_LENGTH_BITS = 128;
    private final byte[] encryptionKey;
    private final byte[] legacyEncryptionKey;
    private final byte[] hashKey;
    private final byte[] legacyHashKey;
    private final SecureRandom secureRandom = new SecureRandom();

    public SensitiveDataCodec(@Value("${security.sensitive-data.secret:${SENSITIVE_DATA_SECRET:" + DEFAULT_SECRET + "}}") String secret) {
        String activeSecret = secret == null || secret.isBlank() ? DEFAULT_SECRET : secret;
        byte[] seed = sha256(activeSecret);
        this.encryptionKey = Arrays.copyOf(seed, 16);
        byte[] legacySeed = sha256(DEFAULT_SECRET);
        this.legacyEncryptionKey = DEFAULT_SECRET.equals(activeSecret) ? null : Arrays.copyOf(legacySeed, 16);
        this.hashKey = sha256("hash:" + Base64.getEncoder().encodeToString(seed));
        this.legacyHashKey = DEFAULT_SECRET.equals(activeSecret) ? null : sha256("hash:" + Base64.getEncoder().encodeToString(legacySeed));
    }

    public String documentHash(String documentType, String documentNumber) {
        String type = documentType == null ? "" : documentType.trim().toUpperCase();
        String value = normalizeDocument(documentNumber);
        return hmac(type + ":" + value, hashKey);
    }

    public List<String> documentHashCandidates(String documentType, String documentNumber) {
        String currentHash = documentHash(documentType, documentNumber);
        if (legacyHashKey == null) {
            return List.of(currentHash);
        }
        String type = documentType == null ? "" : documentType.trim().toUpperCase();
        String value = normalizeDocument(documentNumber);
        String legacyHash = hmac(type + ":" + value, legacyHashKey);
        if (currentHash.equals(legacyHash)) {
            return List.of(currentHash);
        }
        return List.of(currentHash, legacyHash);
    }

    public String encrypt(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            byte[] iv = new byte[IV_LENGTH];
            secureRandom.nextBytes(iv);
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(encryptionKey, "AES"), new GCMParameterSpec(TAG_LENGTH_BITS, iv));
            byte[] encrypted = cipher.doFinal(value.getBytes(StandardCharsets.UTF_8));
            return PREFIX + Base64.getEncoder().encodeToString(iv) + ":" + Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to encrypt sensitive data.", ex);
        }
    }

    public String decrypt(String value) {
        if (value == null || value.isBlank() || !value.startsWith(PREFIX)) {
            return value;
        }
        try {
            String[] parts = value.substring(PREFIX.length()).split(":", 2);
            byte[] iv = Base64.getDecoder().decode(parts[0]);
            byte[] encrypted = Base64.getDecoder().decode(parts[1]);
            return decryptWithKey(iv, encrypted, encryptionKey);
        } catch (Exception ex) {
            if (legacyEncryptionKey == null) {
                throw new IllegalStateException("Unable to decrypt sensitive data.", ex);
            }
            try {
                String[] parts = value.substring(PREFIX.length()).split(":", 2);
                byte[] iv = Base64.getDecoder().decode(parts[0]);
                byte[] encrypted = Base64.getDecoder().decode(parts[1]);
                return decryptWithKey(iv, encrypted, legacyEncryptionKey);
            } catch (Exception legacyEx) {
                throw new IllegalStateException("Unable to decrypt sensitive data.", legacyEx);
            }
        }
    }

    public String normalizeDocument(String value) {
        return value == null ? "" : value.replaceAll("\\D", "");
    }

    private String hmac(String value, byte[] key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(key, "HmacSHA256"));
            return HexFormat.of().formatHex(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to hash sensitive data.", ex);
        }
    }

    private String decryptWithKey(byte[] iv, byte[] encrypted, byte[] key) throws Exception {
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(key, "AES"), new GCMParameterSpec(TAG_LENGTH_BITS, iv));
        return new String(cipher.doFinal(encrypted), StandardCharsets.UTF_8);
    }

    private byte[] sha256(String value) {
        try {
            return MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to initialize sensitive data codec.", ex);
        }
    }
}
