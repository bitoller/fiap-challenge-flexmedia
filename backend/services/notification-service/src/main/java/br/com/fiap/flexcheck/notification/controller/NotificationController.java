package br.com.fiap.flexcheck.notification.controller;

import br.com.fiap.flexcheck.notification.application.CreateAlertNotificationUseCase;
import br.com.fiap.flexcheck.notification.application.CreateReceiptNotificationUseCase;
import br.com.fiap.flexcheck.notification.application.GetNotificationUseCase;
import br.com.fiap.flexcheck.notification.application.ListNotificationsUseCase;
import br.com.fiap.flexcheck.notification.application.command.CreateAlertNotificationCommand;
import br.com.fiap.flexcheck.notification.application.command.CreateReceiptNotificationCommand;
import br.com.fiap.flexcheck.notification.service.result.NotificationResult;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {
    private final CreateReceiptNotificationUseCase createReceiptNotificationUseCase;
    private final CreateAlertNotificationUseCase createAlertNotificationUseCase;
    private final ListNotificationsUseCase listNotificationsUseCase;
    private final GetNotificationUseCase getNotificationUseCase;

    public NotificationController(
            CreateReceiptNotificationUseCase createReceiptNotificationUseCase,
            CreateAlertNotificationUseCase createAlertNotificationUseCase,
            ListNotificationsUseCase listNotificationsUseCase,
            GetNotificationUseCase getNotificationUseCase
    ) {
        this.createReceiptNotificationUseCase = createReceiptNotificationUseCase;
        this.createAlertNotificationUseCase = createAlertNotificationUseCase;
        this.listNotificationsUseCase = listNotificationsUseCase;
        this.getNotificationUseCase = getNotificationUseCase;
    }

    @PostMapping("/receipts")
    public NotificationResult createReceipt(@Valid @RequestBody CreateReceiptNotificationCommand command) {
        return createReceiptNotificationUseCase.execute(command);
    }

    @PostMapping("/alerts")
    public NotificationResult createAlert(@Valid @RequestBody CreateAlertNotificationCommand command) {
        return createAlertNotificationUseCase.execute(command);
    }

    @GetMapping
    public List<NotificationResult> list() {
        return listNotificationsUseCase.execute();
    }

    @GetMapping("/{notificationId}")
    public NotificationResult get(@PathVariable Long notificationId) {
        return getNotificationUseCase.execute(notificationId);
    }
}
