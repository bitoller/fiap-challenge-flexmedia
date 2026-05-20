import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ApiError } from "../../../../domain/errors";
import {
  CheckinAddOnQuote,
  CompleteCheckinResponse,
  IdentityVerificationResponse,
  Reservation,
  Session,
  SessionReservation,
} from "../../../../domain/models";
import {
  CheckinFlowStep,
  CheckinPaymentMethod,
  CheckinRecoveryCode,
  CheckinSearchType,
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
  checkinResult: CompleteCheckinResponse | null;
  addOnQuote: CheckinAddOnQuote | null;
  paymentMethod: CheckinPaymentMethod | null;
  identityVerification: IdentityVerificationResponse | null;
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
  verifyIdentityDocument: (imageBase64: string, mimeType: string) => Promise<IdentityVerificationResponse>;
  verifyIdentitySelfie: (imageBase64: string, mimeType: string) => Promise<IdentityVerificationResponse>;
  confirmIdentityVerification: (termsAccepted: boolean, biometricConsentAccepted: boolean) => Promise<IdentityVerificationResponse>;
  loadAddOns: () => Promise<CheckinAddOnQuote>;
  applyAddOns: (selectedCodes: string[]) => Promise<CheckinAddOnQuote>;
  completeCheckin: (paymentMethod: CheckinPaymentMethod) => Promise<CompleteCheckinResponse>;
  setPaymentMethod: (paymentMethod: CheckinPaymentMethod) => void;
  setFlowStep: (step: CheckinFlowStep) => void;
  setRecovery: (code: CheckinRecoveryCode, message: string) => void;
  clearFlow: () => void;
  resetError: () => void;
}

const CheckinFlowContext = createContext<CheckinFlowContextValue | undefined>(undefined);

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

function normalizeApiError(cause: unknown) {
  return cause instanceof ApiError
    ? cause
    : new ApiError("UNEXPECTED_ERROR", "The operation could not be completed right now.");
}

export function CheckinFlowProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [checkinResult, setCheckinResult] = useState<CompleteCheckinResponse | null>(null);
  const [addOnQuote, setAddOnQuote] = useState<CheckinAddOnQuote | null>(null);
  const [paymentMethod, setPaymentMethodState] = useState<CheckinPaymentMethod | null>(null);
  const [identityVerification, setIdentityVerification] = useState<IdentityVerificationResponse | null>(null);
  const [flowStep, setFlowStepState] = useState<CheckinFlowStep>("identification");
  const [recovery, setRecoveryState] = useState<RecoveryState | null>(null);
  const [biometricsAccepted, setBiometricsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const clearFlow = useCallback(() => {
    sessionRepository.clearSession();
    setSession(null);
    setReservation(null);
    setCheckinResult(null);
    setAddOnQuote(null);
    setPaymentMethodState(null);
    setIdentityVerification(null);
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

  const storeApiError = useCallback((apiError: ApiError) => {
    setError(apiError);
    setRecoveryState({
      code: mapApiErrorToRecoveryCode(apiError),
      message: apiError.message,
    });
    setFlowStepState("recovery");
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
        setIdentityVerification(null);
        setAddOnQuote(null);
        setFlowStepState("confirmation");

        return attachedSession;
      } catch (cause) {
        const apiError = normalizeApiError(cause);
        storeApiError(apiError);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    [storeApiError]
  );

  const verifyIdentityDocument = useCallback(
    async (imageBase64: string, mimeType: string) => {
      if (!session) {
        throw new ApiError("SESSION_NOT_READY", "Identity verification could not start right now.");
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await checkinRepository.verifyIdentityDocument(session.sessionId, imageBase64, mimeType);
        setIdentityVerification(result);
        return result;
      } catch (cause) {
        const apiError = normalizeApiError(cause);
        storeApiError(apiError);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    [session, storeApiError]
  );

  const verifyIdentitySelfie = useCallback(
    async (imageBase64: string, mimeType: string) => {
      if (!session) {
        throw new ApiError("SESSION_NOT_READY", "Identity verification could not continue right now.");
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await checkinRepository.verifyIdentitySelfie(session.sessionId, imageBase64, mimeType);
        setIdentityVerification(result);
        return result;
      } catch (cause) {
        const apiError = normalizeApiError(cause);
        storeApiError(apiError);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    [session, storeApiError]
  );

  const confirmIdentityVerification = useCallback(
    async (termsAccepted: boolean, biometricConsentAccepted: boolean) => {
      if (!session) {
        throw new ApiError("SESSION_NOT_READY", "Identity verification could not be confirmed right now.");
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await checkinRepository.confirmIdentityVerification(
          session.sessionId,
          termsAccepted,
          biometricConsentAccepted
        );
        setIdentityVerification(result);
        setBiometricsAccepted(biometricConsentAccepted);
        setFlowStepState("add-ons");
        return result;
      } catch (cause) {
        const apiError = normalizeApiError(cause);
        storeApiError(apiError);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    [session, storeApiError]
  );

  const loadAddOns = useCallback(async () => {
    if (!session) {
      throw new ApiError("SESSION_NOT_READY", "Add-on services could not be loaded right now.");
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await checkinRepository.listAddOns(session.sessionId);
      setAddOnQuote(result);
      setReservation(result.reservation);
      setFlowStepState("add-ons");
      return result;
    } catch (cause) {
      const apiError = normalizeApiError(cause);
      storeApiError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, [session, storeApiError]);

  const applyAddOns = useCallback(async (selectedCodes: string[]) => {
    if (!session) {
      throw new ApiError("SESSION_NOT_READY", "Add-on services could not be saved right now.");
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await checkinRepository.applyAddOns(session.sessionId, selectedCodes);
      setAddOnQuote(result);
      setReservation(result.reservation);
      setFlowStepState("payment");
      return result;
    } catch (cause) {
      const apiError = normalizeApiError(cause);
      storeApiError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, [session, storeApiError]);

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
          biometricsAccepted,
          identityVerification?.documentStatus ?? "APPROVED",
          identityVerification?.biometryStatus
        );

        setPaymentMethodState(nextPaymentMethod);
        setCheckinResult(result);
        setFlowStepState("success");
        return result;
      } catch (cause) {
        const apiError = normalizeApiError(cause);
        storeApiError(apiError);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    [biometricsAccepted, identityVerification, session, storeApiError]
  );

  const value = useMemo<CheckinFlowContextValue>(
    () => ({
      session,
      reservation,
      checkinResult,
      addOnQuote,
      paymentMethod,
      identityVerification,
      flowStep,
      recovery,
      biometricsAccepted,
      isLoading,
      error,
      startIdentification,
      verifyIdentityDocument,
      verifyIdentitySelfie,
      confirmIdentityVerification,
      loadAddOns,
      applyAddOns,
      completeCheckin,
      setPaymentMethod: setPaymentMethodState,
      setFlowStep,
      setRecovery,
      clearFlow,
      resetError,
    }),
    [
      biometricsAccepted,
      addOnQuote,
      applyAddOns,
      checkinResult,
      clearFlow,
      completeCheckin,
      error,
      flowStep,
      identityVerification,
      isLoading,
      paymentMethod,
      recovery,
      reservation,
      resetError,
      session,
      setFlowStep,
      setRecovery,
      startIdentification,
      loadAddOns,
      verifyIdentityDocument,
      verifyIdentitySelfie,
      confirmIdentityVerification,
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
