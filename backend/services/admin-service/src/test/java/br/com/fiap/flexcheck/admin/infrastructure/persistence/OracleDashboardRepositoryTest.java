package br.com.fiap.flexcheck.admin.infrastructure.persistence;

import br.com.fiap.flexcheck.admin.domain.entity.AuditEvent;
import br.com.fiap.flexcheck.admin.service.result.DashboardResult;
import br.com.fiap.flexcheck.admin.service.result.DeviceStatusResult;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class OracleDashboardRepositoryTest {

    @Test
    public void dashboardShouldPreserveNullFieldsInRecentAuditEntries() {
        JdbcTemplate jdbc = mock(JdbcTemplate.class);
        OracleAuditRepository auditRepository = mock(OracleAuditRepository.class);

        when(jdbc.queryForObject(anyString(), eq(Long.class), anyLong()))
                .thenReturn(4L, 2L, 3L, 1L);
        when(auditRepository.countByResult(1L, "FAILURE")).thenReturn(2L);
        when(auditRepository.countOpenSupportRequests(1L)).thenReturn(0L);
        when(auditRepository.recent(1L)).thenReturn(List.of(
                new AuditEvent(1L, "ADMIN", null, "UPDATE", null, "hotel-1", "SUCCESS", null, null)
        ));

        OracleDashboardRepository repository = new OracleDashboardRepository(jdbc, auditRepository);
        DeviceStatusResult deviceStatus = new DeviceStatusResult(3L, 2L, 1L, 0L, 0L, List.of(Map.of("id", 1L)));

        DashboardResult result = repository.dashboard(1L, deviceStatus);

        assertThat(result.hotelId()).isEqualTo(1L);
        assertThat(result.failedSessions()).isEqualTo(2L);
        assertThat(result.recentSessions()).hasSize(1);
        Map<String, Object> recent = result.recentSessions().get(0);
        assertThat(recent.get("actorType")).isEqualTo("ADMIN");
        assertThat(recent.get("actorId")).isNull();
        assertThat(recent.get("resourceType")).isNull();
        assertThat(recent.get("correlationId")).isNull();
    }
}
