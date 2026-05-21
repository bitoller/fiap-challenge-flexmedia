package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.domain.entity.Stay;
import br.com.fiap.flexcheck.checkin.domain.exception.BusinessException;
import br.com.fiap.flexcheck.checkin.infrastructure.client.AuditServiceClient;
import br.com.fiap.flexcheck.checkin.infrastructure.client.KeyServiceClient;
import br.com.fiap.flexcheck.checkin.infrastructure.client.NotificationServiceClient;
import br.com.fiap.flexcheck.checkin.infrastructure.client.PmsAdapterServiceClient;
import br.com.fiap.flexcheck.checkin.infrastructure.client.PaymentServiceClient;
import br.com.fiap.flexcheck.checkin.repository.StayRepository;
import br.com.fiap.flexcheck.checkin.service.CheckoutUseCase;
import br.com.fiap.flexcheck.checkin.service.command.CheckoutCommand;
import br.com.fiap.flexcheck.checkin.service.result.CheckoutResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class DefaultCheckoutUseCase implements CheckoutUseCase {
    private final StayRepository stayRepository;
    private final PaymentServiceClient paymentServiceClient;
    private final KeyServiceClient keyServiceClient;
    private final PmsAdapterServiceClient pmsAdapterServiceClient;
    private final NotificationServiceClient notificationServiceClient;
    private final AuditServiceClient auditServiceClient;

    public DefaultCheckoutUseCase(
            StayRepository stayRepository,
            PaymentServiceClient paymentServiceClient,
            KeyServiceClient keyServiceClient,
            PmsAdapterServiceClient pmsAdapterServiceClient,
            NotificationServiceClient notificationServiceClient,
            AuditServiceClient auditServiceClient
    ) {
        this.stayRepository = stayRepository;
        this.paymentServiceClient = paymentServiceClient;
        this.keyServiceClient = keyServiceClient;
        this.pmsAdapterServiceClient = pmsAdapterServiceClient;
        this.notificationServiceClient = notificationServiceClient;
        this.auditServiceClient = auditServiceClient;
    }

    @Override
    @Transactional
    public CheckoutResult execute(Long stayId, CheckoutCommand command) {
        if (!command.confirmCharges()) {
            throw new BusinessException("CHARGES_NOT_CONFIRMED", "Confirm the charges to complete checkout.", 400);
        }

        Stay stay = stayRepository.findStay(stayId)
                .orElseThrow(() -> new BusinessException("STAY_NOT_FOUND", "Stay not found.", 404));

        if (!stay.isActiveForCheckout()) {
            throw new BusinessException("STAY_NOT_ACTIVE", "This stay has already been closed or is not active.", 409);
        }

        if ("TEST_CARD_DECLINED".equalsIgnoreCase(command.paymentMethod())) {
            paymentServiceClient.recordPayment(stayId, stay.reservationId(), "CAPTURE", "DECLINED", stay.checkoutDue(), null);
            notificationServiceClient.sendAlert(
                    "reception",
                    "Checkout payment declined",
                    "Checkout payment declined for stay " + stayId + ". Human support required.",
                    "STAY",
                    String.valueOf(stayId)
            );
            throw new BusinessException("PAYMENT_DECLINED", "Payment declined. Please contact reception.", 409);
        }

        if (stay.checkoutDue().compareTo(BigDecimal.ZERO) > 0) {
            paymentServiceClient.recordPayment(stayId, stay.reservationId(), "CAPTURE", "APPROVED", stay.checkoutDue(), "CAP-" + stayId);
        }
        keyServiceClient.revokeKeys(stayId);
        stayRepository.checkout(stay);
        pmsAdapterServiceClient.syncCheckout(stay.reservationId(), stayId, stay.roomId(), stay.checkoutDue());
        notificationServiceClient.sendReceipt(
                stay.guestEmail(),
                "Check-out completed",
                "Your check-out was completed successfully. Receipt " + "RCP-" + stayId + " is available.",
                "STAY",
                String.valueOf(stayId)
        );
        auditServiceClient.record(new br.com.fiap.flexcheck.checkin.domain.entity.AuditEvent(stay.hotelId(), "KIOSK", null, "CHECKOUT_COMPLETED", "STAY", String.valueOf(stayId), "SUCCESS", null));

        return new CheckoutResult(stayId, "CHECKED_OUT", stay.checkoutDue(), "RCP-" + stayId);
    }
}
