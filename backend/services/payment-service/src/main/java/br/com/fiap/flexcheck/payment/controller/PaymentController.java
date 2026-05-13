package br.com.fiap.flexcheck.payment.controller;

import br.com.fiap.flexcheck.payment.application.RecordPaymentUseCase;
import br.com.fiap.flexcheck.payment.application.command.PaymentCommand;
import br.com.fiap.flexcheck.payment.service.result.PaymentResult;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {
    private final RecordPaymentUseCase recordPaymentUseCase;

    public PaymentController(RecordPaymentUseCase recordPaymentUseCase) {
        this.recordPaymentUseCase = recordPaymentUseCase;
    }

    @PostMapping("/transactions")
    public PaymentResult recordPayment(@Valid @RequestBody PaymentCommand command) {
        return recordPaymentUseCase.execute(command);
    }
}
