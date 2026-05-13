package br.com.fiap.flexcheck.pms.controller;

import br.com.fiap.flexcheck.pms.application.FindPmsEventUseCase;
import br.com.fiap.flexcheck.pms.application.ListPendingPmsEventsUseCase;
import br.com.fiap.flexcheck.pms.application.RecordPmsEventUseCase;
import br.com.fiap.flexcheck.pms.application.RetryPmsEventUseCase;
import br.com.fiap.flexcheck.pms.application.command.PmsEventCommand;
import br.com.fiap.flexcheck.pms.application.command.PmsSyncCommand;
import br.com.fiap.flexcheck.pms.service.result.PmsEventResult;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pms")
public class PmsController {
    private final RecordPmsEventUseCase recordPmsEventUseCase;
    private final FindPmsEventUseCase findPmsEventUseCase;
    private final ListPendingPmsEventsUseCase listPendingPmsEventsUseCase;
    private final RetryPmsEventUseCase retryPmsEventUseCase;

    public PmsController(
            RecordPmsEventUseCase recordPmsEventUseCase,
            FindPmsEventUseCase findPmsEventUseCase,
            ListPendingPmsEventsUseCase listPendingPmsEventsUseCase,
            RetryPmsEventUseCase retryPmsEventUseCase
    ) {
        this.recordPmsEventUseCase = recordPmsEventUseCase;
        this.findPmsEventUseCase = findPmsEventUseCase;
        this.listPendingPmsEventsUseCase = listPendingPmsEventsUseCase;
        this.retryPmsEventUseCase = retryPmsEventUseCase;
    }

    @PostMapping("/events")
    public PmsEventResult record(@Valid @RequestBody PmsEventCommand command) {
        return recordPmsEventUseCase.execute(command);
    }

    @PostMapping("/checkins")
    public PmsEventResult recordCheckin(@Valid @RequestBody PmsSyncCommand command) {
        return recordPmsEventUseCase.execute(command.toEventCommand("CHECKIN_SYNC"));
    }

    @PostMapping("/checkouts")
    public PmsEventResult recordCheckout(@Valid @RequestBody PmsSyncCommand command) {
        return recordPmsEventUseCase.execute(command.toEventCommand("CHECKOUT_SYNC"));
    }

    @GetMapping("/events/{eventId}")
    public PmsEventResult findById(@PathVariable Long eventId) {
        return findPmsEventUseCase.execute(eventId);
    }

    @GetMapping("/events/pending")
    public List<PmsEventResult> pending() {
        return listPendingPmsEventsUseCase.execute();
    }

    @PostMapping("/events/{eventId}/retry")
    public PmsEventResult retry(@PathVariable Long eventId) {
        return retryPmsEventUseCase.execute(eventId);
    }
}
