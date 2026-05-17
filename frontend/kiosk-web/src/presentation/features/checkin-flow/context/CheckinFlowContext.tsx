import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ApiError } from "../../../../domain/errors";
import {
  CompleteCheckinResponse,
  Reservation,
  Session,
  SessionReservation,
} from "../../../../domain/models";
import {
  CheckinFlowStep,
  CheckinPaymentMethod,
  CheckinRecoveryCode,
  CheckinSearchType,
  GuestContactDraft,
} from "../../../../domain/types";
import { checkinRepository } from "../../../../data/repositories/checkinRepository";
import { sessionRepository } from "../../../../data/repositories/sessionRepository";

interface RecoveryState {
  code: CheckinRecoveryCode;
  message: string;
}

interface CheckinFlowContextValue {
  session: Session | null;
  reservation: Reservation | null;
  guestContact: GuestContactDraft | null;
  checkinResult: CompleteCheckinResponse | null;
  paymentMethod: CheckinPaymentMethod | null;
  flowStep: CheckinFlowStep;
  recovery: RecoveryState | null;
  biometricsAccepted: boolean;
  isLoading: boolean;
  error: ApiError | null;
  startIdentification: (
    searchType: CheckinSearchType,
    value: string,
    language: string
  ) => Promise<SessionReservation>;
  updateGuestContact: (contact: Partial<GuestContactDraft>) => void;
  confirmGuestContact: () => Promise<void>;
  acceptTerms: (biometricsAccepted: boolean) => Promise<void>;
  completeCheckin: (paymentMethod: CheckinPaymentMethod) => Promise<CompleteCheckinResponse>;
  setPaymentMethod: (paymentMethod: CheckinPaymentMethod) => void;
  setFlowStep: (step: CheckinFlowStep) => void;
  setRecovery: (code: CheckinRecoveryCode, message: string) => void;
  clearFlow: () => void;
  resetError: () => void;
}

const CheckinFlowContext = createContext<CheckinFlowContextValue | undefined>(undefined);

function buildInitialGuestContact(
  reservation: Reservation,
  searchType: CheckinSearchType,
  searchValue: string
): GuestContactDraft {
  return {
    fullName: reservation.guest.fullName,
    documentType: reservation.guest.documentType,
    documentNumber: searchType === "CPF" ? searchValue : reservation.guest.maskedDocument,
    birthDate: reservation.guest.birthDate,
    email: reservation.guest.email,
    phone: reservation.guest.phone,
  };
}

function mapApiErrorToRecoveryCode(error: ApiError): CheckinRecoveryCode {
  if (error.code === "RESERVATION_NOT_ELIGIBLE") {
    return "RESERVATION_NOT_ELIGIBLE";
  }

  if (error.code === "PAYMENT_DECLINED") {
    return "PAYMENT_DECLINED";
  }

  if (error.code === "BIOMETRY_REJECTED") {
    return "BIOMETRY_REJECTED";
  }

  if (
    error.code === "DOCUMENT_REJECTED" ||
    error.code === "INVALID_DOCUMENT" ||
    error.code === "INVALID_DOCUMENT_TYPE" ||
    error.code === "DOCUMENT_MISMATCH"
  ) {
    return "DOCUMENT_REJECTED";
  }

  return "RESERVATION_NOT_FOUND";
}

export function CheckinFlowProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [guestContact, setGuestContact] = useState<GuestContactDraft | null>(null);
  const [checkinResult, setCheckinResult] = useState<CompleteCheckinResponse | null>(null);
  const [paymentMethod, setPaymentMethodState] = useState<CheckinPaymentMethod | null>(null);
  const [flowStep, setFlowStepState] = useState<CheckinFlowStep>("identification");
  const [recovery, setRecoveryState] = useState<RecoveryState | null>(null);
  const [biometricsAccepted, setBiometricsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const clearFlow = useCallback(() => {
    sessionRepository.clearSession();
    setSession(null);
    setReservation(null);
    setGuestContact(null);
    setCheckinResult(null);
    setPaymentMethodState(null);
    setFlowStepState("identification");
    setRecoveryState(null);
    setBiometricsAccepted(false);
    setIsLoading(false);
    setError(null);
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const setFlowStep = useCallback((step: CheckinFlowStep) => {
    setFlowStepState(step);
  }, []);

  const setRecovery = useCallback((code: CheckinRecoveryCode, message: string) => {
    const apiError = new ApiError(code, message);
    setRecoveryState({ code, message });
    setFlowStepState("recovery");
    setError(apiError);
  }, []);

  const updateGuestContact = useCallback((contact: Partial<GuestContactDraft>) => {
    setGuestContact((current) => ({
      fullName: current?.fullName ?? "",
      documentType: current?.documentType ?? "CPF",
      documentNumber: current?.documentNumber ?? "",
      birthDate: current?.birthDate ?? "",
      email: current?.email ?? "",
      phone: current?.phone ?? "",
      ...contact,
    }));
  }, []);

  const startIdentification = useCallback(
    async (searchType: CheckinSearchType, value: string, language: string) => {
      setIsLoading(true);
      setError(null);
      setRecoveryState(null);

      try {
        const createdSession = await checkinRepository.createSession("CHECKIN", language);
        sessionRepository.setCurrentSession(createdSession);
        setSession(createdSession);

        const attachedSession = await checkinRepository.attachReservation(
          createdSession.sessionId,
          value,
          searchType
        );

        sessionRepository.setCurrentSession(attachedSession);
        setSession(attachedSession);
        setReservation(attachedSession.reservation);
        setGuestContact(buildInitialGuestContact(attachedSession.reservation, searchType, value));
        setFlowStepState("confirmation");

        return attachedSession;
      } catch (cause) {
        const apiError =
          cause instanceof ApiError
            ? cause
            : new ApiError("UNEXPECTED_ERROR", "The operation could not be completed right now.");

        setError(apiError);
        setRecoveryState({
          code: mapApiErrorToRecoveryCode(apiError),
          message: apiError.message,
        });
        setFlowStepState("recovery");
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const confirmGuestContact = useCallback(async () => {
    if (!session || !reservation || !guestContact) {
      throw new ApiError("SESSION_NOT_READY", "The data could not be confirmed right now.");
    }

    setIsLoading(true);
    setError(null);

    try {
      await checkinRepository.confirmGuest(session.sessionId, {
        id: reservation.guest.id,
        ...guestContact,
      });
      setFlowStepState("terms");
    } catch (cause) {
      const apiError =
        cause instanceof ApiError
          ? cause
          : new ApiError("UNEXPECTED_ERROR", "The operation could not be completed right now.");

      setError(apiError);
      setRecoveryState({
        code: mapApiErrorToRecoveryCode(apiError),
        message: apiError.message,
      });
      setFlowStepState("recovery");
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, [guestContact, reservation, session]);

  const acceptTerms = useCallback(
    async (nextBiometricsAccepted: boolean) => {
      if (!session) {
        throw new ApiError("SESSION_NOT_READY", "The terms could not be recorded right now.");
      }

      setIsLoading(true);
      setError(null);

      try {
        await checkinRepository.registerConsents(session.sessionId, nextBiometricsAccepted);
        setBiometricsAccepted(nextBiometricsAccepted);
        setFlowStepState("payment");
      } catch (cause) {
        const apiError =
          cause instanceof ApiError
            ? cause
            : new ApiError("UNEXPECTED_ERROR", "The operation could not be completed right now.");

        setError(apiError);
        setRecoveryState({
          code: mapApiErrorToRecoveryCode(apiError),
          message: apiError.message,
        });
        setFlowStepState("recovery");
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    [session]
  );

  const completeCheckin = useCallback(
    async (nextPaymentMethod: CheckinPaymentMethod) => {
      if (!session) {
        throw new ApiError("SESSION_NOT_READY", "Check-in could not be completed right now.");
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await checkinRepository.completeCheckin(
          session.sessionId,
          nextPaymentMethod,
          biometricsAccepted
        );

        setPaymentMethodState(nextPaymentMethod);
        setCheckinResult(result);
        setFlowStepState("success");
        return result;
      } catch (cause) {
        const apiError =
          cause instanceof ApiError
            ? cause
            : new ApiError("UNEXPECTED_ERROR", "The operation could not be completed right now.");

        setError(apiError);
        setRecoveryState({
          code: mapApiErrorToRecoveryCode(apiError),
          message: apiError.message,
        });
        setFlowStepState("recovery");
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    [biometricsAccepted, session]
  );

  const value = useMemo<CheckinFlowContextValue>(
    () => ({
      session,
      reservation,
      guestContact,
      checkinResult,
      paymentMethod,
      flowStep,
      recovery,
      biometricsAccepted,
      isLoading,
      error,
      startIdentification,
      updateGuestContact,
      confirmGuestContact,
      acceptTerms,
      completeCheckin,
      setPaymentMethod: setPaymentMethodState,
      setFlowStep,
      setRecovery,
      clearFlow,
      resetError,
    }),
    [
      acceptTerms,
      biometricsAccepted,
      checkinResult,
      clearFlow,
      completeCheckin,
      confirmGuestContact,
      error,
      flowStep,
      guestContact,
      isLoading,
      paymentMethod,
      recovery,
      reservation,
      resetError,
      session,
      setFlowStep,
      setRecovery,
      startIdentification,
      updateGuestContact,
    ]
  );

  return <CheckinFlowContext.Provider value={value}>{children}</CheckinFlowContext.Provider>;
}

export function useCheckinFlow() {
  const context = useContext(CheckinFlowContext);

  if (!context) {
    throw new Error("useCheckinFlow must be used within a CheckinFlowProvider");
  }

  return context;
}
