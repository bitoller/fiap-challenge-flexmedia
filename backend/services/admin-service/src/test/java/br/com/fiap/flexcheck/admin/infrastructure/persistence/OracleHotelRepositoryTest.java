package br.com.fiap.flexcheck.admin.infrastructure.persistence;

import br.com.fiap.flexcheck.admin.service.result.HotelProfileResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import java.util.concurrent.atomic.AtomicBoolean;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class OracleHotelRepositoryTest {

    @Test
    public void findByIdShouldCreateDefaultHotelWhenMissing() {
        JdbcTemplate jdbc = mock(JdbcTemplate.class);
        ObjectMapper objectMapper = new ObjectMapper();
        AtomicBoolean persisted = new AtomicBoolean(false);

        doThrow(new EmptyResultDataAccessException(1))
                .when(jdbc)
                .queryForObject(anyString(), ArgumentMatchers.<RowMapper<Object>>any(), eq(99L));
        doAnswer(invocation -> {
            persisted.set(true);
            return 1;
        }).when(jdbc).update(anyString(), any(Object[].class));

        OracleHotelRepository repository = new OracleHotelRepository(jdbc, objectMapper);

        HotelProfileResult result = repository.findById(99L);

        assertThat(result.id()).isEqualTo(99L);
        assertThat(result.name()).isNotBlank();
        assertThat(persisted).isTrue();
    }
}
