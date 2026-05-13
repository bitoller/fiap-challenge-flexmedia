package br.com.fiap.flexcheck.checkin.domain.exception;

import java.util.Map;

public class BusinessException extends RuntimeException {
    private final String code;
    private final int statusCode;
    private final Map<String, Object> details;

    public BusinessException(String code, String message, int statusCode) {
        this(code, message, statusCode, Map.of());
    }

    public BusinessException(String code, String message, int statusCode, Map<String, Object> details) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
    }

    public String code() {
        return code;
    }

    public int statusCode() {
        return statusCode;
    }

    public Map<String, Object> details() {
        return details;
    }
}

