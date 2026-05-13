package br.com.fiap.flexcheck.checkin.controller;

import br.com.fiap.flexcheck.checkin.domain.exception.BusinessException;
import br.com.fiap.flexcheck.checkin.dto.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiError> business(BusinessException exception, HttpServletRequest request) {
        return ResponseEntity.status(exception.statusCode()).body(new ApiError(
                exception.code(),
                exception.getMessage(),
                exception.details(),
                request.getHeader("X-Correlation-Id")
        ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> validation(MethodArgumentNotValidException exception, HttpServletRequest request) {
        Map<String, Object> details = new HashMap<>();
        exception.getBindingResult().getFieldErrors()
                .forEach(error -> details.put(error.getField(), error.getDefaultMessage()));

        return ResponseEntity.badRequest().body(new ApiError(
                "VALIDATION_ERROR",
                "Revise os campos informados.",
                details,
                request.getHeader("X-Correlation-Id")
        ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> unexpected(Exception exception, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiError(
                "UNEXPECTED_ERROR",
                "Nao foi possivel concluir a operacao agora.",
                Map.of("exception", exception.getClass().getSimpleName()),
                request.getHeader("X-Correlation-Id")
        ));
    }
}
