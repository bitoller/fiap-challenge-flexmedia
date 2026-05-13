package br.com.fiap.flexcheck.payment.application.impl;

import br.com.fiap.flexcheck.payment.application.RecordPaymentUseCase;
import br.com.fiap.flexcheck.payment.application.command.PaymentCommand;
import br.com.fiap.flexcheck.payment.infrastructure.repository.InMemoryPaymentRepository;
import br.com.fiap.flexcheck.payment.service.result.PaymentResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultRecordPaymentUseCase implements RecordPaymentUseCase {
    private final InMemoryPaymentRepository paymentRepository;

    public DefaultRecordPaymentUseCase(InMemoryPaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public PaymentResult execute(PaymentCommand command) {
        Long id = paymentRepository.insertPayment(
                command.stayId(),
                command.reservationId(),
                command.transactionType(),
                command.status(),
                command.amount(),
                command.authorizationCode()
        );
        return new PaymentResult(id, command.transactionType(), command.status(), command.amount(), command.authorizationCode());
    }
}
