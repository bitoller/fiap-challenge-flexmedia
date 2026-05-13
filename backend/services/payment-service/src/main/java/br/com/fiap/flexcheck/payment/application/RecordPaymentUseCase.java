package br.com.fiap.flexcheck.payment.application;

import br.com.fiap.flexcheck.payment.application.command.PaymentCommand;
import br.com.fiap.flexcheck.payment.service.result.PaymentResult;

public interface RecordPaymentUseCase {
    PaymentResult execute(PaymentCommand command);
}
