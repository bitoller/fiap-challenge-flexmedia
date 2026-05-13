package br.com.fiap.flexcheck.identity.infrastructure.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

public final class PasswordHasher {
    private PasswordHasher() {
    }

    public static String hash(String rawPassword) {
        return digest(rawPassword == null ? "" : rawPassword);
    }

    public static boolean matches(String rawPassword, String expectedHash) {
        return digest(rawPassword == null ? "" : rawPassword).equalsIgnoreCase(expectedHash);
    }

    private static String digest(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is not available", exception);
        }
    }
}
