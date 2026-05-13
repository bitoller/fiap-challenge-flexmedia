package br.com.fiap.flexcheck.admin.config;

import br.com.fiap.flexcheck.admin.infrastructure.session.InMemoryAdminSessionRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;

public class AdminAuthInterceptor implements HandlerInterceptor {
    private final InMemoryAdminSessionRepository sessionRepository;

    public AdminAuthInterceptor(InMemoryAdminSessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String token = request.getHeader("X-Admin-Token");
        if (sessionRepository.isValid(token)) {
            return true;
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"code\":\"UNAUTHORIZED\",\"message\":\"Administrator session required.\"}");
        return false;
    }
}
