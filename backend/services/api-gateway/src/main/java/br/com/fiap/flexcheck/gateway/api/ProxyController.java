package br.com.fiap.flexcheck.gateway.api;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@RestController
public class ProxyController {
    private static final Set<String> SKIPPED_REQUEST_HEADERS = Set.of(
            "host",
            "connection",
            "content-length",
            "transfer-encoding"
    );

    private static final Set<String> SKIPPED_RESPONSE_HEADERS = new HashSet<>(Set.of(
            "connection",
            "content-length",
            "transfer-encoding"
    ));

    private final HttpClient httpClient;
    private final String checkinServiceUrl;

    public ProxyController(@Value("${services.checkin.url:http://localhost:8080}") String checkinServiceUrl) {
        this.checkinServiceUrl = checkinServiceUrl;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
    }

    @RequestMapping("/api/v1/**")
    public ResponseEntity<byte[]> proxy(HttpServletRequest servletRequest, @RequestBody(required = false) byte[] body)
            throws IOException, InterruptedException {
        URI targetUri = buildTargetUri(servletRequest);
        HttpRequest.Builder requestBuilder = HttpRequest.newBuilder(targetUri)
                .timeout(Duration.ofSeconds(20));

        Collections.list(servletRequest.getHeaderNames()).forEach(headerName -> {
            if (!SKIPPED_REQUEST_HEADERS.contains(headerName.toLowerCase())) {
                Collections.list(servletRequest.getHeaders(headerName))
                        .forEach(value -> requestBuilder.header(headerName, value));
            }
        });

        String correlationId = servletRequest.getHeader("X-Correlation-Id");
        if (correlationId == null || correlationId.isBlank()) {
            requestBuilder.header("X-Correlation-Id", java.util.UUID.randomUUID().toString());
        }

        HttpRequest.BodyPublisher publisher = hasBody(servletRequest.getMethod())
                ? HttpRequest.BodyPublishers.ofByteArray(body == null ? new byte[0] : body)
                : HttpRequest.BodyPublishers.noBody();

        HttpRequest request = requestBuilder.method(servletRequest.getMethod(), publisher).build();
        HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());

        HttpHeaders headers = new HttpHeaders();
        response.headers().map().forEach((name, values) -> {
            if (!SKIPPED_RESPONSE_HEADERS.contains(name.toLowerCase())) {
                headers.put(name, values);
            }
        });

        return new ResponseEntity<>(response.body(), headers, HttpStatus.valueOf(response.statusCode()));
    }

    private URI buildTargetUri(HttpServletRequest request) {
        String path = request.getRequestURI();
        String query = request.getQueryString();
        String target = checkinServiceUrl + path + (query == null ? "" : "?" + query);
        return URI.create(target);
    }

    private boolean hasBody(String method) {
        return switch (method.toUpperCase()) {
            case "POST", "PUT", "PATCH", "DELETE" -> true;
            default -> false;
        };
    }
}

