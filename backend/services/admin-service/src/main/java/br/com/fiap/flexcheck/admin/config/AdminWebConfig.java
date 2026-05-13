package br.com.fiap.flexcheck.admin.config;

import br.com.fiap.flexcheck.admin.infrastructure.session.InMemoryAdminSessionRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AdminWebConfig implements WebMvcConfigurer {
    private final InMemoryAdminSessionRepository sessionRepository;

    public AdminWebConfig(InMemoryAdminSessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new AdminAuthInterceptor(sessionRepository))
                .addPathPatterns("/api/v1/admin/**")
                .excludePathPatterns(
                        "/api/v1/admin/auth/login",
                        "/api/v1/admin/audit-events",
                        "/api/v1/admin/dashboard"
                );
    }
}
