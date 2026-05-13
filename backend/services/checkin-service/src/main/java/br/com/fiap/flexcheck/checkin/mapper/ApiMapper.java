package br.com.fiap.flexcheck.checkin.mapper;

import br.com.fiap.flexcheck.checkin.dto.AttachReservationRequest;
import br.com.fiap.flexcheck.checkin.dto.CheckoutRequest;
import br.com.fiap.flexcheck.checkin.dto.CheckoutChargeResponse;
import br.com.fiap.flexcheck.checkin.dto.CheckoutLookupRequest;
import br.com.fiap.flexcheck.checkin.dto.CheckoutLookupResponse;
import br.com.fiap.flexcheck.checkin.dto.CheckoutResponse;
import br.com.fiap.flexcheck.checkin.dto.CompleteCheckinRequest;
import br.com.fiap.flexcheck.checkin.dto.CompleteCheckinResponse;
import br.com.fiap.flexcheck.checkin.dto.ConsentRequest;
import br.com.fiap.flexcheck.checkin.dto.CreateSessionRequest;
import br.com.fiap.flexcheck.checkin.dto.DashboardResponse;
import br.com.fiap.flexcheck.checkin.dto.GuestConfirmationRequest;
import br.com.fiap.flexcheck.checkin.dto.GuestResponse;
import br.com.fiap.flexcheck.checkin.dto.KeyResponse;
import br.com.fiap.flexcheck.checkin.dto.ReservationResponse;
import br.com.fiap.flexcheck.checkin.dto.RoomResponse;
import br.com.fiap.flexcheck.checkin.dto.SessionReservationResponse;
import br.com.fiap.flexcheck.checkin.dto.SessionResponse;
import br.com.fiap.flexcheck.checkin.service.command.AttachReservationCommand;
import br.com.fiap.flexcheck.checkin.service.command.CheckoutCommand;
import br.com.fiap.flexcheck.checkin.service.command.CheckoutLookupCommand;
import br.com.fiap.flexcheck.checkin.service.command.CompleteCheckinCommand;
import br.com.fiap.flexcheck.checkin.service.command.ConsentCommand;
import br.com.fiap.flexcheck.checkin.service.command.CreateSessionCommand;
import br.com.fiap.flexcheck.checkin.service.command.GuestConfirmationCommand;
import br.com.fiap.flexcheck.checkin.service.result.CheckoutResult;
import br.com.fiap.flexcheck.checkin.service.result.CheckoutChargeResult;
import br.com.fiap.flexcheck.checkin.service.result.CheckoutPreviewResult;
import br.com.fiap.flexcheck.checkin.service.result.CompleteCheckinResult;
import br.com.fiap.flexcheck.checkin.service.result.DashboardResult;
import br.com.fiap.flexcheck.checkin.service.result.KeyResult;
import br.com.fiap.flexcheck.checkin.service.result.ReservationResult;
import br.com.fiap.flexcheck.checkin.service.result.RoomResult;
import br.com.fiap.flexcheck.checkin.service.result.SessionReservationResult;
import br.com.fiap.flexcheck.checkin.service.result.SessionResult;

public final class ApiMapper {
    private ApiMapper() {
    }

    public static CreateSessionCommand toCommand(CreateSessionRequest request) {
        return new CreateSessionCommand(request.kioskId(), request.flowType(), request.language());
    }

    public static AttachReservationCommand toCommand(AttachReservationRequest request) {
        return new AttachReservationCommand(request.searchType(), request.searchValue());
    }

    public static GuestConfirmationCommand toCommand(GuestConfirmationRequest request) {
        return new GuestConfirmationCommand(
                request.guestId(),
                request.fullName(),
                request.documentType(),
                request.documentNumber(),
                request.birthDate(),
                request.email(),
                request.phone()
        );
    }

    public static ConsentCommand toCommand(ConsentRequest request) {
        return new ConsentCommand(request.items().stream()
                .map(item -> new ConsentCommand.ConsentItemCommand(item.type(), item.accepted(), item.version()))
                .toList());
    }

    public static CompleteCheckinCommand toCommand(CompleteCheckinRequest request) {
        return new CompleteCheckinCommand(
                request.paymentMethod(),
                request.keyType(),
                request.documentStatus(),
                request.biometryStatus()
        );
    }

    public static CheckoutCommand toCommand(CheckoutRequest request) {
        return new CheckoutCommand(request.paymentMethod(), request.confirmCharges());
    }

    public static CheckoutLookupCommand toCommand(CheckoutLookupRequest request) {
        return new CheckoutLookupCommand(
                request.hotelId(),
                request.roomNumber(),
                request.documentType(),
                request.documentNumber()
        );
    }

    public static SessionResponse toResponse(SessionResult result) {
        return new SessionResponse(result.sessionId(), result.status(), result.expiresAt(), result.correlationId());
    }

    public static SessionReservationResponse toResponse(SessionReservationResult result) {
        return new SessionReservationResponse(result.sessionId(), result.status(), toResponse(result.reservation()));
    }

    public static ReservationResponse toResponse(ReservationResult result) {
        return new ReservationResponse(
                result.id(),
                result.code(),
                result.status(),
                result.hotelName(),
                result.arrivalDate(),
                result.departureDate(),
                result.totalAmount(),
                result.currency(),
                result.eligible(),
                result.eligibilityReasons(),
                new GuestResponse(
                        result.guest().id(),
                        result.guest().fullName(),
                        result.guest().documentType(),
                        result.guest().maskedDocument(),
                        result.guest().birthDate(),
                        result.guest().email(),
                        result.guest().phone()
                ),
                toResponse(result.room())
        );
    }

    public static CompleteCheckinResponse toResponse(CompleteCheckinResult result) {
        return new CompleteCheckinResponse(
                result.sessionId(),
                result.status(),
                result.stayId(),
                result.roomNumber(),
                result.totalPaid(),
                toResponse(result.key())
        );
    }

    public static CheckoutResponse toResponse(CheckoutResult result) {
        return new CheckoutResponse(result.stayId(), result.status(), result.totalPaid(), result.receiptCode());
    }

    public static CheckoutLookupResponse toResponse(CheckoutPreviewResult result) {
        return new CheckoutLookupResponse(
                result.stayId(),
                result.stayStatus(),
                toResponse(result.reservation()),
                result.totalDue(),
                result.charges().stream().map(ApiMapper::toResponse).toList()
        );
    }

    public static DashboardResponse toResponse(DashboardResult result) {
        return new DashboardResponse(
                result.reservationsToday(),
                result.activeStays(),
                result.completedCheckins(),
                result.completedCheckouts(),
                result.failedSessions(),
                result.recentSessions()
        );
    }

    private static RoomResponse toResponse(RoomResult room) {
        return new RoomResponse(room.id(), room.number(), room.type(), room.status());
    }

    private static KeyResponse toResponse(KeyResult key) {
        return new KeyResponse(key.keyId(), key.type(), key.status(), key.value(), key.expiresAt());
    }

    private static CheckoutChargeResponse toResponse(CheckoutChargeResult charge) {
        return new CheckoutChargeResponse(charge.code(), charge.description(), charge.amount());
    }
}
