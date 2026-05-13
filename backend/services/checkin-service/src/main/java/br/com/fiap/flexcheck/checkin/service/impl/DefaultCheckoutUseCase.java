package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.domain.entity.Stay;
import br.com.fiap.flexcheck.checkin.domain.exception.BusinessException;
import br.com.fiap.flexcheck.checkin.infrastructure.client.AuditServiceClient;
import br.com.fiap.flexcheck.checkin.infrastructure.client.KeyServiceClient;
import br.com.fiap.flexcheck.checkin.infrastructure.client.PmsAdapterServiceClient;
import br.com.fiap.flexcheck.checkin.infrastructure.client.PaymentServiceClient;
import br.com.fiap.flexcheck.checkin.repository.StayRepository;
import br.com.fiap.flexcheck.checkin.service.CheckoutUseCase;
import br.com.fiap.flexcheck.checkin.service.command.CheckoutCommand;
import br.com.fiap.flexcheck.checkin.service.result.CheckoutResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DefaultCheckoutUseCase implements CheckoutUseCase {
    private final StayRepository stayRepository;
    private final PaymentServiceClient paymentServiceClient;
    private final KeyServiceClient keyServiceClient;
    private final PmsAdapterServiceClient pmsAdapterServiceClient;
    private final AuditServiceClient auditServiceClient;

    public DefaultCheckoutUseCase(
            StayRepository stayRepository,
            PaymentServiceClient paymentServiceClient,
            KeyServiceClient keyServiceClient,
            PmsAdapterServiceClient pmsAdapterServiceClient,
            AuditServiceClient auditServiceClient
    ) {
        this.stayRepository = stayRepository;
        this.paymentServiceClient = paymentServiceClient;
        this.keyServiceClient = keyServiceClient;
        this.pmsAdapterServiceClient = pmsAdapterServiceClient;
        this.auditServiceClient = auditServiceClient;
    }

    @Override
    @Transactional
    public CheckoutResult execute(Long stayId, CheckoutCommand command) {
        if (!command.confirmCharges()) {
            throw new BusinessException("CHARGES_NOT_CONFIRMED", "Confirme os valores para concluir o check-out.", 400);
        }

        Stay stay = stayRepository.findStay(stayId)
                .orElseThrow(() -> new BusinessException("STAY_NOT_FOUND", "Estadia nao encontrada.", 404));

        if (!stay.isActiveForCheckout()) {
            throw new BusinessException("STAY_NOT_ACTIVE", "Essa estadia ja foi encerrada ou nao esta ativa.", 409);
        }

        if ("TEST_CARD_DECLINED".equalsIgnoreCase(command.paymentMethod())) {
            paymentServiceClient.recordPayment(stayId, stay.reservationId(), "CAPTURE", "DECLINED", stay.totalAmount(), null);
            throw new BusinessException("PAYMENT_DECLINED", "Pagamento recusado. Procure a recepcao.", 409);
        }

        paymentServiceClient.recordPayment(stayId, stay.reservationId(), "CAPTURE", "APPROVED", stay.totalAmount(), "CAP-" + stayId);
        keyServiceClient.revokeKeys(stayId);
        stayRepository.checkout(stay);
        pmsAdapterServiceClient.syncCheckout(stay.reservationId(), stayId, stay.roomId(), stay.totalAmount());
        auditServiceClient.record(new br.com.fiap.flexcheck.checkin.domain.entity.AuditEvent("KIOSK", null, "CHECKOUT_COMPLETED", "STAY", String.valueOf(stayId), "SUCCESS", null));

        return new CheckoutResult(stayId, "CHECKED_OUT", stay.totalAmount(), "RCP-" + stayId);
    }
}
