package br.com.fiap.flexcheck.admin.controller;

import br.com.fiap.flexcheck.admin.application.RequestGuestServiceUseCase;
import br.com.fiap.flexcheck.admin.application.command.GuestServiceRequestCommand;
import br.com.fiap.flexcheck.admin.domain.entity.GuestServiceType;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class GuestServiceRequestControllerTest {

    @Test
    void shouldAcceptAndMapTypedKioskRequest() throws Exception {
        RequestGuestServiceUseCase useCase = mock(RequestGuestServiceUseCase.class);
        MockMvc mockMvc = MockMvcBuilders
                .standaloneSetup(new GuestServiceRequestController(useCase))
                .build();

        mockMvc.perform(post("/api/v1/guest-service-requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Correlation-Id", "correlation-456")
                        .content("""
                                {
                                  "hotelId": 1,
                                  "kioskId": "kiosk-7",
                                  "serviceType": "AMENITIES",
                                  "route": "/services"
                                }
                                """))
                .andExpect(status().isAccepted());

        ArgumentCaptor<GuestServiceRequestCommand> commandCaptor = ArgumentCaptor.forClass(GuestServiceRequestCommand.class);
        verify(useCase).execute(commandCaptor.capture());

        GuestServiceRequestCommand command = commandCaptor.getValue();
        assertThat(command.hotelId()).isEqualTo(1L);
        assertThat(command.kioskId()).isEqualTo("kiosk-7");
        assertThat(command.serviceType()).isEqualTo(GuestServiceType.AMENITIES);
        assertThat(command.route()).isEqualTo("/services");
        assertThat(command.correlationId()).isEqualTo("correlation-456");
    }

    @Test
    void shouldRejectUnknownServiceType() throws Exception {
        RequestGuestServiceUseCase useCase = mock(RequestGuestServiceUseCase.class);
        MockMvc mockMvc = MockMvcBuilders
                .standaloneSetup(new GuestServiceRequestController(useCase))
                .build();

        mockMvc.perform(post("/api/v1/guest-service-requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "hotelId": 1,
                                  "kioskId": "kiosk-7",
                                  "serviceType": "UNKNOWN",
                                  "route": "/services"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }
}
